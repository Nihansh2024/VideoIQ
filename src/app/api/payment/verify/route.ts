import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const PRO_PLAN_AMOUNT = 39900;
const PRO_PLAN_CURRENCY = "INR";

/** Multi-layer env reader (same as create-order). */
function getEnvVar(name: string): string | null {
  if (process.env[name] && process.env[name]!.trim()) {
    return process.env[name]!.trim();
  }
  const candidates = [
    join(process.cwd(), ".secrets", "youtube.env"),
    join(process.cwd(), ".env.local"),
    join(process.cwd(), ".env"),
  ];
  for (const path of candidates) {
    try {
      if (!existsSync(path)) continue;
      const content = readFileSync(path, "utf-8");
      const lines = content.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        if (key !== name) continue;
        let value = trimmed.slice(eqIdx + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        if (value) return value;
      }
    } catch {
      /* ignore */
    }
  }
  return null;
}

function describeError(err: unknown): string {
  if (!err) return "Unknown error";
  const e = err as any;
  if (typeof e?.message === "string" && e.message.length > 0) return e.message;
  try {
    return JSON.stringify(err);
  } catch {
    return "Unknown error";
  }
}

/**
 * Verify Razorpay signature using HMAC-SHA256 + timing-safe comparison.
 * Expected signature = HMAC_SHA256(key_secret, `${order_id}|${payment_id}`)
 *
 * Razorpay sends the signature as a lowercase hex string. We compare in
 * constant time to avoid timing-side-channel attacks. Any malformed input
 * (wrong length, non-hex) simply returns false.
 */
function verifyRazorpaySignature(
  keySecret: string,
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    if (!signature || typeof signature !== "string") return false;

    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex"); // lowercase hex

    // Fast path: lengths differ → definitely not equal.
    if (expected.length !== signature.length) return false;

    // Constant-time compare on equal-length buffers.
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signature, "utf8");
    return crypto.timingSafeEqual(a, b);
  } catch (err) {
    console.error("Signature verification threw:", err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const reqId = `vp_${startedAt}_${Math.random().toString(36).slice(2, 8)}`;
  console.log(`[${reqId}] POST /api/payment/verify — start`);

  try {
    const body = await request.json().catch(() => ({}));
    const razorpay_order_id = body.razorpay_order_id;
    const razorpay_payment_id = body.razorpay_payment_id;
    const razorpay_signature = body.razorpay_signature;
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const plan = typeof body.plan === "string" ? body.plan : "pro";
    const method = typeof body.method === "string" ? body.method : "unknown";
    const demoMode = Boolean(body.demoMode);

    console.log(`[${reqId}] Request:`, {
      razorpay_order_id,
      razorpay_payment_id,
      hasSignature: Boolean(razorpay_signature),
      email,
      plan,
      method,
      demoMode,
    });

    if (!razorpay_order_id || !razorpay_payment_id) {
      console.warn(`[${reqId}] 400 — missing order/payment id`);
      return NextResponse.json(
        { error: "razorpay_order_id and razorpay_payment_id are required." },
        { status: 400 }
      );
    }
    if (!email) {
      console.warn(`[${reqId}] 400 — missing email`);
      return NextResponse.json(
        { error: "Email is required to activate the subscription." },
        { status: 400 }
      );
    }

    // --- Signature verification (skip only in explicit demo mode) ---
    if (!demoMode) {
      const keySecret = getEnvVar("RAZORPAY_KEY_SECRET");
      if (!keySecret) {
        console.error(`[${reqId}] RAZORPAY_KEY_SECRET not configured`);
        return NextResponse.json(
          { error: "Server is missing RAZORPAY_KEY_SECRET — cannot verify payment." },
          { status: 500 }
        );
      }
      if (!razorpay_signature) {
        console.warn(`[${reqId}] 400 — missing razorpay_signature`);
        return NextResponse.json(
          { error: "razorpay_signature is required for verification." },
          { status: 400 }
        );
      }

      const ok = verifyRazorpaySignature(
        keySecret,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );
      console.log(`[${reqId}] Signature verification result: ${ok ? "PASS" : "FAIL"}`);

      if (!ok) {
        return NextResponse.json(
          { error: "Payment signature verification failed. The payment may have been tampered with." },
          { status: 400 }
        );
      }
    } else {
      console.log(`[${reqId}] Skipping signature verification (demoMode=true)`);
    }

    // --- Mark PaymentOrder as paid ---
    try {
      const updated = await db.paymentOrder.updateMany({
        where: { razorpayOrderId: razorpay_order_id },
        data: { status: "paid" },
      });
      console.log(`[${reqId}] PaymentOrder updateMany matched ${updated.count} row(s)`);
    } catch (dbErr) {
      console.error(`[${reqId}] PaymentOrder update failed (non-fatal):`, dbErr);
    }

    // --- Upsert user & activate Pro ---
    let userId: string;
    try {
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) {
        userId = existing.id;
        await db.user.update({
          where: { id: userId },
          data: {
            plan: "pro",
            analysesLimit: -1, // -1 = unlimited
            name: name || existing.name || null,
          },
        });
        console.log(`[${reqId}] Updated existing user ${userId} → pro`);
      } else {
        const created = await db.user.create({
          data: {
            email,
            name: name || null,
            plan: "pro",
            analysesLimit: -1,
          },
        });
        userId = created.id;
        console.log(`[${reqId}] Created new user ${userId} → pro`);
      }
    } catch (dbErr) {
      console.error(`[${reqId}] User upsert failed:`, dbErr);
      return NextResponse.json(
        { error: "Failed to activate user account. Please contact support with your payment ID: " + razorpay_payment_id },
        { status: 500 }
      );
    }

    // --- Create subscription row ---
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1-month subscription
    const amount = plan === "pro" ? PRO_PLAN_AMOUNT : 0;

    try {
      await db.subscription.create({
        data: {
          userId,
          userEmail: email,
          plan,
          status: "active",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          amount,
          currency: PRO_PLAN_CURRENCY,
          method,
          startDate,
          endDate,
        },
      });
      console.log(`[${reqId}] Subscription row created for user ${userId}`);
    } catch (dbErr) {
      console.error(`[${reqId}] Subscription insert failed (non-fatal):`, dbErr);
    }

    console.log(`[${reqId}] 200 — Pro activated in ${Date.now() - startedAt}ms`);

    return NextResponse.json({
      success: true,
      message: "Payment verified and Pro plan activated successfully!",
      subscription: {
        plan: "pro",
        status: "active",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        method,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        amount,
        currency: PRO_PLAN_CURRENCY,
      },
    });
  } catch (error) {
    const msg = describeError(error);
    console.error(`[${reqId}] Unhandled error in verify-payment:`, error);
    return NextResponse.json(
      { error: `Payment verification failed: ${msg}` },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
