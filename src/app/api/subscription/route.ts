import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const FREE_WEEKLY_LIMIT = 1;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Auto-expire any Pro subscription whose endDate has passed.
 * Side-effect: downgrades the User row to free + cancels the Subscription row.
 * Idempotent — safe to call on every subscription check.
 */
async function autoExpireSubscriptions(email: string): Promise<void> {
  try {
    const now = new Date();
    // Find any active subscription for this email that has expired.
    const expired = await db.subscription.findMany({
      where: {
        userEmail: email,
        status: "active",
        endDate: { lt: now },
      },
    });
    if (expired.length === 0) return;
    console.log(`[subscription] auto-expiring ${expired.length} subs for ${email}`);
    for (const sub of expired) {
      await db.subscription.update({
        where: { id: sub.id },
        data: { status: "expired", endDate: now },
      });
    }
    // Downgrade user to free.
    await db.user.update({
      where: { email },
      data: { plan: "free", analysesLimit: FREE_WEEKLY_LIMIT },
    });
    console.log(`[subscription] user ${email} downgraded to free (expired)`);
  } catch (err) {
    console.error(`[subscription] auto-expire failed for ${email}:`, err);
  }
}

/**
 * Reset weekly usage counter if the rolling 7-day window has elapsed.
 */
async function maybeResetWeeklyUsage(email: string, user: any): Promise<{ analysesUsed: number; weeklyResetAt: Date | null }> {
  const now = new Date();
  const resetAt = user.weeklyResetAt ? new Date(user.weeklyResetAt) : null;
  // If never reset OR the last reset is older than 7 days, reset now.
  if (!resetAt || (now.getTime() - resetAt.getTime()) >= WEEK_MS) {
    try {
      await db.user.update({
        where: { email },
        data: {
          analysesUsed: 0,
          weeklyResetAt: now,
        },
      });
      console.log(`[subscription] weekly reset for ${email} (was ${user.analysesUsed})`);
      return { analysesUsed: 0, weeklyResetAt: now };
    } catch (err) {
      console.error(`[subscription] weekly reset failed for ${email}:`, err);
    }
  }
  return { analysesUsed: user.analysesUsed, weeklyResetAt: resetAt };
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");
    const anonymousId = request.nextUrl.searchParams.get("anonymousId");

    // ── Anonymous user (no email) ──────────────────────────────────────────
    if (!email) {
      if (!anonymousId) {
        return NextResponse.json({
          plan: "free",
          anonymous: true,
          analysesUsed: 0,
          analysesLimit: FREE_WEEKLY_LIMIT,
          weeklyWindowMs: WEEK_MS,
          subscription: null,
        });
      }
      // Look up anonymous usage logs in the last 7 days.
      const since = new Date(Date.now() - WEEK_MS);
      const count = await db.usageLog.count({
        where: {
          anonymous: true,
          anonymousId,
          createdAt: { gte: since },
        },
      });
      return NextResponse.json({
        plan: "free",
        anonymous: true,
        anonymousId,
        analysesUsed: count,
        analysesLimit: FREE_WEEKLY_LIMIT,
        weeklyWindowMs: WEEK_MS,
        subscription: null,
      });
    }

    // ── Logged-in user ─────────────────────────────────────────────────────
    await autoExpireSubscriptions(email);

    let user = await db.user.findUnique({
      where: { email },
      include: {
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    // Auto-create a Free user row so usage is tracked persistently across sessions.
    // (Previously we returned free defaults without persisting — that meant Free
    // users got unlimited analyses because there was no row to track against.)
    if (!user) {
      console.log(`[subscription] auto-creating Free user for ${email}`);
      try {
        user = await db.user.create({
          data: {
            email,
            plan: "free",
            analysesUsed: 0,
            analysesLimit: FREE_WEEKLY_LIMIT,
          },
          include: { subscriptions: true },
        });
      } catch (createErr) {
        // Race condition — another request created it. Re-fetch.
        console.warn(`[subscription] race creating user for ${email}:`, createErr);
        user = await db.user.findUnique({
          where: { email },
          include: { subscriptions: { orderBy: { createdAt: "desc" }, take: 1 } },
        });
      }
    }

    if (!user) {
      return NextResponse.json({
        plan: "free",
        analysesUsed: 0,
        analysesLimit: FREE_WEEKLY_LIMIT,
        weeklyWindowMs: WEEK_MS,
        subscription: null,
      });
    }

    // Refresh weekly counter if window elapsed (only matters for Free users).
    const isPro = user.plan === "pro";
    let analysesUsed = user.analysesUsed;
    let weeklyResetAt = user.weeklyResetAt;
    if (!isPro) {
      const r = await maybeResetWeeklyUsage(email, user);
      analysesUsed = r.analysesUsed;
      weeklyResetAt = r.weeklyResetAt;
    }

    const activeSub = user.subscriptions.find((s: any) => s.status === "active");

    return NextResponse.json({
      plan: user.plan,
      analysesUsed,
      analysesLimit: user.analysesLimit === -1 ? "unlimited" : user.analysesLimit,
      weeklyWindowMs: WEEK_MS,
      weeklyResetAt: weeklyResetAt ? new Date(weeklyResetAt).toISOString() : null,
      subscription: activeSub ? {
        id: activeSub.id,
        plan: activeSub.plan,
        status: activeSub.status,
        method: activeSub.method,
        startDate: activeSub.startDate,
        endDate: activeSub.endDate,
        amount: activeSub.amount,
      } : null,
    });
  } catch (error) {
    console.error("Subscription check error:", error);
    return NextResponse.json(
      { error: `Failed to check subscription: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (user) {
      await db.user.update({
        where: { id: user.id },
        data: { plan: "free", analysesLimit: FREE_WEEKLY_LIMIT },
      });
      await db.subscription.updateMany({
        where: { userId: user.id, status: "active" },
        data: { status: "cancelled", endDate: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Subscription cancelled. You are now on the Free plan.",
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json(
      { error: `Failed to cancel subscription: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
