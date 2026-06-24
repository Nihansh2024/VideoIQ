import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

// Pro plan = ₹399 = 39900 paise
const PRO_PLAN_AMOUNT = 39900;
const PRO_PLAN_CURRENCY = "INR";

/**
 * Multi-layer env var reader.
 * Order: process.env → .secrets/youtube.env → .env.local → .env
 * (Prisma's `db:push` was wiping .env in earlier sessions, so we keep a
 *  read-only secrets file as the source of truth.)
 */
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
      // Match NAME=VALUE (strip surrounding quotes, ignore commented lines)
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
      /* ignore file read errors */
    }
  }
  return null;
}

/**
 * Convert any Razorpay SDK error into a short, user-displayable string.
 * Razorpay errors typically look like:
 *   { statusCode: 400, error: { code, description, reason, source, step } }
 */
function describeError(err: unknown): string {
  if (!err) return "Unknown error";
  const e = err as any;
  // Razorpay-shaped error
  if (e?.error?.description) {
    const parts = [e.error.code, e.error.description].filter(Boolean);
    return `Razorpay: ${parts.join(" — ")}`;
  }
  if (typeof e?.message === "string" && e.message.length > 0) {
    return e.message;
  }
  try {
    return JSON.stringify(err);
  } catch {
    return "Unknown error";
  }
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const reqId = `co_${startedAt}_${Math.random().toString(36).slice(2, 8)}`;
  console.log(`[${reqId}] POST /api/payment/create-order — start`);

  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const plan = typeof body.plan === "string" ? body.plan : "pro";

    console.log(`[${reqId}] Request body:`, { email, name, plan });

    if (!email || !email.includes("@")) {
      console.warn(`[${reqId}] 400 — missing/invalid email`);
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (plan !== "pro") {
      console.warn(`[${reqId}] 400 — unsupported plan: ${plan}`);
      return NextResponse.json(
        { error: `Unsupported plan: ${plan}. Only "pro" is supported.` },
        { status: 400 }
      );
    }

    // --- Load Razorpay credentials ---
    const keyId = getEnvVar("RAZORPAY_KEY_ID");
    const keySecret = getEnvVar("RAZORPAY_KEY_SECRET");

    if (!keyId || !keySecret) {
      console.error(`[${reqId}] Missing Razorpay env vars`, {
        hasKeyId: Boolean(keyId),
        hasKeySecret: Boolean(keySecret),
      });
      return NextResponse.json(
        {
          error:
            "Razorpay credentials are not configured on the server. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
        },
        { status: 500 }
      );
    }

    console.log(`[${reqId}] Using Razorpay key: ${keyId.slice(0, 12)}***`);

    // --- Build receipt (Razorpay: max 40 chars, alphanumeric + _ only) ---
    // User spec: receipt prefix is "uploadiq_pro". Append a short unique suffix.
    const ts = Date.now().toString(36); // ~8 chars
    const rand = Math.random().toString(36).slice(2, 6); // 4 chars
    const receipt = `uploadiq_pro_${ts}${rand}`; // 21 chars, well under 40
    console.log(`[${reqId}] Receipt: ${receipt} (len=${receipt.length})`);

    // --- Create order via Razorpay SDK ---
    let order: any;
    try {
      const RazorpayModule = await import("razorpay");
      const Razorpay = (RazorpayModule as any).default || RazorpayModule;
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      console.log(`[${reqId}] Calling razorpay.orders.create...`);
      order = await razorpay.orders.create({
        amount: PRO_PLAN_AMOUNT,
        currency: PRO_PLAN_CURRENCY,
        receipt,
        notes: {
          email,
          name: name || "",
          plan,
          app: "videoiq",
        },
      });
      console.log(`[${reqId}] Razorpay order created:`, {
        id: order?.id,
        amount: order?.amount,
        currency: order?.currency,
        status: order?.status,
        receipt: order?.receipt,
      });
    } catch (rpErr) {
      const msg = describeError(rpErr);
      console.error(`[${reqId}] Razorpay order creation failed:`, rpErr);
      return NextResponse.json(
        {
          error: `Failed to create Razorpay order: ${msg}`,
          razorpayError: true,
        },
        { status: 502 }
      );
    }

    if (!order || !order.id) {
      console.error(`[${reqId}] Razorpay returned no order id`, order);
      return NextResponse.json(
        { error: "Razorpay returned an empty order. Please try again." },
        { status: 502 }
      );
    }

    // --- Persist order row in DB (acts as our local ledger / Supabase replacement) ---
    try {
      await db.paymentOrder.create({
        data: {
          razorpayOrderId: order.id,
          amount: order.amount ?? PRO_PLAN_AMOUNT,
          currency: order.currency ?? PRO_PLAN_CURRENCY,
          receipt: order.receipt ?? receipt,
          status: order.status ?? "created",
          plan,
          userEmail: email,
        },
      });
      console.log(`[${reqId}] PaymentOrder row created in DB`);
    } catch (dbErr) {
      // Non-fatal: payment can still proceed; we just lose local ledger.
      console.error(`[${reqId}] DB insert failed (non-fatal):`, dbErr);
    }

    console.log(`[${reqId}] 200 — order ready in ${Date.now() - startedAt}ms`);

    // --- Respond. Frontend needs: order_id, amount, currency, key_id ---
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount ?? PRO_PLAN_AMOUNT,
      currency: order.currency ?? PRO_PLAN_CURRENCY,
      keyId, // server returns the key_id so the frontend doesn't need NEXT_PUBLIC_*
      receipt: order.receipt ?? receipt,
      isLive: true,
    });
  } catch (error) {
    const msg = describeError(error);
    console.error(`[${reqId}] Unhandled error in create-order:`, error);
    return NextResponse.json(
      { error: `Failed to create payment order: ${msg}` },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
