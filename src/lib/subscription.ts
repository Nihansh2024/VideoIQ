import { db } from "@/lib/db";

export const FREE_WEEKLY_LIMIT = 1;
export const PRO_PLAN_AMOUNT = 39900;
export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export type Plan = "free" | "pro";

export interface SubscriptionCheckResult {
  ok: boolean;
  plan: Plan;
  anonymous: boolean;
  email?: string;
  userId?: string;
  anonymousId?: string;
  analysesUsed: number;
  analysesLimit: number | "unlimited";
  weeklyResetAt?: Date | null;
  /** Populated only when ok=false due to limit exceeded. */
  error?: {
    code: "FREE_WEEKLY_LIMIT_REACHED" | "USER_NOT_FOUND" | "DB_ERROR";
    message: string;
    httpStatus: number;
  };
}

/**
 * Auto-expire any Pro subscription whose endDate has passed.
 * Idempotent — safe to call on every check.
 */
async function autoExpire(email: string): Promise<void> {
  try {
    const now = new Date();
    const expired = await db.subscription.findMany({
      where: { userEmail: email, status: "active", endDate: { lt: now } },
    });
    if (expired.length === 0) return;
    for (const sub of expired) {
      await db.subscription.update({
        where: { id: sub.id },
        data: { status: "expired", endDate: now },
      });
    }
    await db.user.update({
      where: { email },
      data: { plan: "free", analysesLimit: FREE_WEEKLY_LIMIT },
    });
    console.log(`[sub-check] auto-expired ${expired.length} subs for ${email}`);
  } catch (err) {
    console.error(`[sub-check] auto-expire failed for ${email}:`, err);
  }
}

/**
 * Get-or-create a Free User row for an email. Idempotent.
 * Use this whenever an email is supplied but the user may not exist yet
 * (e.g., Free user just entering their email for the first time).
 */
export async function getOrCreateFreeUser(email: string) {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return existing;
  try {
    return await db.user.create({
      data: {
        email,
        plan: "free",
        analysesUsed: 0,
        analysesLimit: FREE_WEEKLY_LIMIT,
      },
    });
  } catch (err) {
    // Race condition — another request created it. Re-fetch.
    console.warn(`[sub-check] getOrCreateFreeUser race for ${email}:`, err);
    return await db.user.findUnique({ where: { email } });
  }
}

/**
 * Reset weekly usage counter if the rolling 7-day window has elapsed.
 */
async function maybeResetWeekly(email: string, user: any) {
  const now = new Date();
  const resetAt = user.weeklyResetAt ? new Date(user.weeklyResetAt) : null;
  if (!resetAt || now.getTime() - resetAt.getTime() >= WEEK_MS) {
    try {
      await db.user.update({
        where: { email },
        data: { analysesUsed: 0, weeklyResetAt: now },
      });
      return { analysesUsed: 0, weeklyResetAt: now };
    } catch (err) {
      console.error(`[sub-check] weekly reset failed for ${email}:`, err);
    }
  }
  return { analysesUsed: user.analysesUsed, weeklyResetAt: resetAt };
}

/**
 * Check subscription + usage state for an incoming analysis request.
 * Never trusts the client — always re-reads from the DB.
 *
 * @param email       Logged-in user email (optional)
 * @param anonymousId Anonymous user ID from cookie/localStorage (optional)
 */
export async function checkSubscription(
  email?: string | null,
  anonymousId?: string | null
): Promise<SubscriptionCheckResult> {
  // ── Anonymous user ───────────────────────────────────────────────────────
  if (!email) {
    if (!anonymousId) {
      // Treat as a fresh anonymous user — allowed to analyze once.
      return {
        ok: true,
        plan: "free",
        anonymous: true,
        analysesUsed: 0,
        analysesLimit: FREE_WEEKLY_LIMIT,
      };
    }
    try {
      const since = new Date(Date.now() - WEEK_MS);
      const used = await db.usageLog.count({
        where: { anonymous: true, anonymousId, createdAt: { gte: since } },
      });
      if (used >= FREE_WEEKLY_LIMIT) {
        return {
          ok: false,
          plan: "free",
          anonymous: true,
          anonymousId,
          analysesUsed: used,
          analysesLimit: FREE_WEEKLY_LIMIT,
          error: {
            code: "FREE_WEEKLY_LIMIT_REACHED",
            message:
              "Free weekly limit reached. Upgrade to Pro for unlimited analyses.",
            httpStatus: 403,
          },
        };
      }
      return {
        ok: true,
        plan: "free",
        anonymous: true,
        anonymousId,
        analysesUsed: used,
        analysesLimit: FREE_WEEKLY_LIMIT,
      };
    } catch (err) {
      console.error("[sub-check] anonymous count failed:", err);
      return {
        ok: false,
        plan: "free",
        anonymous: true,
        anonymousId,
        analysesUsed: 0,
        analysesLimit: FREE_WEEKLY_LIMIT,
        error: {
          code: "DB_ERROR",
          message: `Failed to verify anonymous usage: ${err instanceof Error ? err.message : String(err)}`,
          httpStatus: 500,
        },
      };
    }
  }

  // ── Logged-in user ──────────────────────────────────────────────────────
  try {
    await autoExpire(email);
    let user = await db.user.findUnique({ where: { email } });
    if (!user) {
      // Auto-create a Free user row so their usage is tracked persistently.
      // (Previously this returned 404 — but Free users should be allowed to
      // sign in with just an email, no payment required.)
      console.log(`[sub-check] auto-creating Free user for ${email}`);
      user = await getOrCreateFreeUser(email);
      if (!user) {
        return {
          ok: false,
          plan: "free",
          anonymous: false,
          email,
          analysesUsed: 0,
          analysesLimit: FREE_WEEKLY_LIMIT,
          error: {
            code: "DB_ERROR",
            message: "Failed to create user account. Please try again.",
            httpStatus: 500,
          },
        };
      }
    }

    if (user.plan === "pro" || user.analysesLimit === -1) {
      return {
        ok: true,
        plan: "pro",
        anonymous: false,
        email,
        userId: user.id,
        analysesUsed: 0,
        analysesLimit: "unlimited",
      };
    }

    // Free user — check weekly limit.
    const r = await maybeResetWeekly(email, user);
    if (r.analysesUsed >= FREE_WEEKLY_LIMIT) {
      return {
        ok: false,
        plan: "free",
        anonymous: false,
        email,
        userId: user.id,
        analysesUsed: r.analysesUsed,
        analysesLimit: FREE_WEEKLY_LIMIT,
        weeklyResetAt: r.weeklyResetAt,
        error: {
          code: "FREE_WEEKLY_LIMIT_REACHED",
          message:
            "Free weekly limit reached. Upgrade to Pro for unlimited analyses.",
          httpStatus: 403,
        },
      };
    }
    return {
      ok: true,
      plan: "free",
      anonymous: false,
      email,
      userId: user.id,
      analysesUsed: r.analysesUsed,
      analysesLimit: FREE_WEEKLY_LIMIT,
      weeklyResetAt: r.weeklyResetAt,
    };
  } catch (err) {
    console.error("[sub-check] logged-in check failed:", err);
    return {
      ok: false,
      plan: "free",
      anonymous: false,
      email,
      analysesUsed: 0,
      analysesLimit: FREE_WEEKLY_LIMIT,
      error: {
        code: "DB_ERROR",
        message: `Subscription check failed: ${err instanceof Error ? err.message : String(err)}`,
        httpStatus: 500,
      },
    };
  }
}

/**
 * Record one analysis usage. Call AFTER the analysis succeeds.
 */
export async function recordUsage(
  check: SubscriptionCheckResult,
  videoUrl: string,
  videoId: string
): Promise<void> {
  try {
    await db.usageLog.create({
      data: {
        userId: check.userId ?? null,
        email: check.email ?? null,
        videoUrl,
        videoId,
        plan: check.plan,
        anonymous: check.anonymous,
        anonymousId: check.anonymousId ?? null,
      },
    });
    if (check.userId && check.plan === "free") {
      await db.user.update({
        where: { id: check.userId },
        data: {
          analysesUsed: { increment: 1 },
          lastAnalysisDate: new Date(),
        },
      });
    }
  } catch (err) {
    console.error("[sub-check] recordUsage failed:", err);
    // Non-fatal — analysis already succeeded.
  }
}
