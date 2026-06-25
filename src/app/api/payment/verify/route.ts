import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto, { timingSafeEqual, randomBytes } from "crypto";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

/**
 * Multi-layer env var loader (same as create-order).
 * Order: process.env → .secrets/youtube.env → .env.local → .env
 */
function getEnvVar(name: string): string | null {
  if (process.env[name]) return process.env[name]!;
  const candidates = [
    join(process.cwd(), ".secrets", "youtube.env"),
    join(process.cwd(), ".env.local"),
    join(process.cwd(), ".env"),
  ];
  for (const p of candidates) {
    try {
      if (!existsSync(p)) continue;
      const content = readFileSync(p, "utf-8");
      const match = content.match(new RegExp(`^\\s*${name}\\s*=\\s*(.+?)\\s*$`, "m"));
      if (match && match[1].trim()) {
        return match[1].trim().replace(/^["']|["']$/g, "");
      }
    } catch { /* ignore */ }
  }
  return null;
}

function describeError(err: any): string {
  if (!err) return "Unknown error";
  if (err?.error?.description) return err.error.description;
  if (err?.error?.code) return `${err.error.code}: ${err.error.description || ""}`;
  if (typeof err === "string") return err;
  if (err?.message) return err.message;
  try { return JSON.stringify(err); } catch { return String(err); }
}

/** Constant-time signature comparison. Returns false on length mismatch. */
function safeSigCompare(a: string, b: string): boolean {
  const ab = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  if (ab.length !== bb.length || ab.length === 0) return false;
  return timingSafeEqual(ab, bb);
}

/**
 * Idempotent activation flow:
 *   1. Verify signature (skip in demo mode)
 *   2. Mark PaymentOrder as paid
 *   3. Upsert User (plan=pro, analysesLimit=-1, reset weekly usage)
 *   4. Upsert Subscription (status=active, 30-day window) keyed by razorpayOrderId
 *   5. Return success
 *
 * Every DB write is wrapped in its own try/catch so we can identify exactly
 * which step failed and surface the real error to the frontend.
 */
export async function POST(request: NextRequest) {
  const reqId = `pv_${Date.now()}_${randomBytes(3).toString("hex")}`;
  console.log(`[verify][${reqId}] POST /api/payment/verify`);

  let body: any;
  try {
    body = await request.json();
  } catch (parseErr) {
    console.error(`[verify][${reqId}] JSON parse failed:`, parseErr);
    return NextResponse.json(
      { error: "Invalid JSON body", reqId },
      { status: 400 }
    );
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    email,
    name,
    plan = "pro",
    method = "unknown",
    demoMode = false,
  } = body;

  console.log(`[verify][${reqId}] payload:`, {
    razorpay_order_id,
    razorpay_payment_id: razorpay_payment_id ? `${razorpay_payment_id.slice(0, 8)}…` : null,
    has_signature: !!razorpay_signature,
    email,
    name,
    plan,
    method,
    demoMode,
  });

  // ── Validate required fields ─────────────────────────────────────────────
  if (!razorpay_order_id || !razorpay_payment_id) {
    console.warn(`[verify][${reqId}] missing order_id or payment_id`);
    return NextResponse.json(
      { error: "razorpay_order_id and razorpay_payment_id are required", reqId },
      { status: 400 }
    );
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    console.warn(`[verify][${reqId}] invalid email: ${email}`);
    return NextResponse.json(
      { error: "A valid email is required", reqId },
      { status: 400 }
    );
  }

  // ── 1. Signature verification ────────────────────────────────────────────
  const keySecret = getEnvVar("RAZORPAY_KEY_SECRET");
  const isRazorpayConfigured = !!(keySecret && !keySecret.startsWith("YourKeySecret"));

  if (isRazorpayConfigured && !demoMode) {
    if (!razorpay_signature) {
      console.warn(`[verify][${reqId}] missing signature in live mode`);
      return NextResponse.json(
        { error: "razorpay_signature is required in live mode", reqId },
        { status: 400 }
      );
    }
    const expected = crypto
      .createHmac("sha256", keySecret!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (!safeSigCompare(expected, razorpay_signature)) {
      console.error(`[verify][${reqId}] signature mismatch`);
      console.error(`[verify][${reqId}]   expected: ${expected}`);
      console.error(`[verify][${reqId}]   received: ${razorpay_signature}`);
      return NextResponse.json(
        { error: "Payment signature verification failed. Possible tampering — contact support.", reqId },
        { status: 400 }
      );
    }
    console.log(`[verify][${reqId}] signature OK`);
  } else {
    console.log(`[verify][${reqId}] signature check skipped (demoMode=${demoMode}, configured=${isRazorpayConfigured})`);
  }

  // ── 2. Mark PaymentOrder as paid ─────────────────────────────────────────
  try {
    const upd = await db.paymentOrder.updateMany({
      where: { razorpayOrderId: razorpay_order_id },
      data: { status: "paid" },
    });
    console.log(`[verify][${reqId}] PaymentOrder.updateMany matched=${upd.count} updated=${upd.count}`);
    if (upd.count === 0) {
      console.warn(`[verify][${reqId}] no PaymentOrder row for ${razorpay_order_id} — continuing anyway`);
    }
  } catch (dbErr) {
    console.error(`[verify][${reqId}] PaymentOrder.updateMany FAILED:`, dbErr);
    return NextResponse.json(
      {
        error: `DB error marking order paid: ${describeError(dbErr)}`,
        step: "paymentOrder.update",
        reqId,
      },
      { status: 500 }
    );
  }

  // ── 3. Upsert User (plan=pro, reset weekly usage) ───────────────────────
  let userId: string;
  try {
    const up = await db.user.upsert({
      where: { email },
      update: {
        plan: "pro",
        analysesLimit: -1, // unlimited
        analysesUsed: 0,   // reset weekly count
        ...(name ? { name } : {}),
      },
      create: {
        email,
        name: name || null,
        plan: "pro",
        analysesLimit: -1,
        analysesUsed: 0,
      },
    });
    userId = up.id;
    console.log(`[verify][${reqId}] User upserted: id=${userId} plan=pro analysesUsed=0`);
  } catch (dbErr) {
    console.error(`[verify][${reqId}] User.upsert FAILED:`, dbErr);
    return NextResponse.json(
      {
        error: `DB error upserting user: ${describeError(dbErr)}`,
        step: "user.upsert",
        reqId,
      },
      { status: 500 }
    );
  }

  // ── 4. Upsert Subscription (idempotent on razorpayOrderId) ───────────────
  const amount = plan === "pro" ? 39900 : 0;
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days

  try {
    // Check if a subscription row already exists for this order (idempotency).
    const existing = await db.subscription.findFirst({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (existing) {
      // Re-activate / refresh the existing row (e.g. user retried after a timeout)
      await db.subscription.update({
        where: { id: existing.id },
        data: {
          userId,
          userEmail: email,
          plan,
          status: "active",
          razorpayPaymentId: razorpay_payment_id,
          amount,
          currency: "INR",
          method,
          startDate,
          endDate,
        },
      });
      console.log(`[verify][${reqId}] Subscription refreshed: id=${existing.id}`);
    } else {
      await db.subscription.create({
        data: {
          userId,
          userEmail: email,
          plan,
          status: "active",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          amount,
          currency: "INR",
          method,
          startDate,
          endDate,
        },
      });
      console.log(`[verify][${reqId}] Subscription created for user=${userId}`);
    }
  } catch (dbErr) {
    console.error(`[verify][${reqId}] Subscription.upsert FAILED:`, dbErr);
    return NextResponse.json(
      {
        error: `DB error activating subscription: ${describeError(dbErr)}`,
        step: "subscription.upsert",
        reqId,
      },
      { status: 500 }
    );
  }

  // ── 5. Done ──────────────────────────────────────────────────────────────
  console.log(`[verify][${reqId}] SUCCESS — Pro activated for ${email}`);

  return NextResponse.json({
    success: true,
    message: "Welcome to VideoIQ Pro",
    subscription: {
      plan: "pro",
      status: "active",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      method,
      amount,
      currency: "INR",
    },
    user: {
      id: userId,
      email,
      plan: "pro",
      analysesUsed: 0,
      analysesLimit: "unlimited",
    },
    reqId,
  });
}
