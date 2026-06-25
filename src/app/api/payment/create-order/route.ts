import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { randomBytes } from "crypto";

const PRO_PLAN_AMOUNT = 39900; // ₹399 in paise

/**
 * Multi-layer env var loader.
 * Order: process.env → .secrets/youtube.env → .env.local → .env
 * (Prisma `db:push` nukes .env, so .secrets/ is the durable source of truth.)
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
        // strip surrounding quotes if any
        return match[1].trim().replace(/^["']|["']$/g, "");
      }
    } catch { /* ignore */ }
  }
  return null;
}

/** Extract a human-readable error message from a Razorpay SDK error. */
function describeError(err: any): string {
  if (!err) return "Unknown error";
  // Razorpay error shape: { statusCode, error: { code, description, ... } }
  if (err?.error?.description) return err.error.description;
  if (err?.error?.code) return `${err.error.code}: ${err.error.description || ""}`;
  if (typeof err === "string") return err;
  if (err?.message) return err.message;
  try { return JSON.stringify(err); } catch { return String(err); }
}

export async function POST(request: NextRequest) {
  const reqId = `co_${Date.now()}_${randomBytes(3).toString("hex")}`;
  console.log(`[create-order][${reqId}] POST /api/payment/create-order`);

  try {
    const body = await request.json();
    const { email, name, plan = "pro" } = body;
    console.log(`[create-order][${reqId}] payload:`, { email, name, plan });

    if (!email || typeof email !== "string" || !email.includes("@")) {
      console.warn(`[create-order][${reqId}] invalid email: ${email}`);
      return NextResponse.json(
        { error: "A valid email is required", reqId },
        { status: 400 }
      );
    }

    const amount = plan === "pro" ? PRO_PLAN_AMOUNT : 0;
    if (amount === 0) {
      return NextResponse.json(
        { error: "Free plan does not require payment", reqId },
        { status: 400 }
      );
    }

    const keyId = getEnvVar("RAZORPAY_KEY_ID");
    const keySecret = getEnvVar("RAZORPAY_KEY_SECRET");
    const isRazorpayConfigured = !!(keyId && keySecret && !keyId.startsWith("rzp_test_YourKey"));

    console.log(`[create-order][${reqId}] razorpay configured: ${isRazorpayConfigured}`);

    // ── LIVE RAZORPAY ORDER ────────────────────────────────────────────────
    if (isRazorpayConfigured) {
      try {
        const Razorpay = (await import("razorpay")).default;
        const razorpay = new Razorpay({ key_id: keyId!, key_secret: keySecret! });

        // Razorpay receipt limit = 40 chars. Use a short, unique, sanitized id.
        // `viq_<base36-ts>_<6hex>` ≈ 20 chars — well under the limit.
        const ts = Date.now().toString(36);
        const rand = randomBytes(3).toString("hex");
        const receipt = `viq_${ts}_${rand}`;
        console.log(`[create-order][${reqId}] receipt length=${receipt.length} value=${receipt}`);

        const order = await razorpay.orders.create({
          amount,
          currency: "INR",
          receipt,
          notes: { email, name: name || "", plan, reqId },
        });

        console.log(`[create-order][${reqId}] razorpay order created:`, order.id);

        // Persist locally
        try {
          await db.paymentOrder.create({
            data: {
              razorpayOrderId: order.id,
              amount: order.amount,
              currency: order.currency,
              receipt,
              status: "created",
              plan,
              userEmail: email,
            },
          });
          console.log(`[create-order][${reqId}] PaymentOrder row created`);
        } catch (dbErr) {
          console.error(`[create-order][${reqId}] PaymentOrder.create failed:`, dbErr);
          // Non-fatal — the order exists in Razorpay, we can still proceed.
        }

        return NextResponse.json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId,
          receipt: order.receipt,
          isLive: true,
          reqId,
        });
      } catch (rzpErr) {
        console.error(`[create-order][${reqId}] razorpay.orders.create failed:`, rzpErr);
        return NextResponse.json(
          {
            error: `Razorpay rejected order creation: ${describeError(rzpErr)}`,
            reqId,
          },
          { status: 502 }
        );
      }
    }

    // ── DEMO MODE (Razorpay not configured) ────────────────────────────────
    const demoOrderId = `order_demo_${Date.now()}`;
    const receipt = `viqdemo_${Date.now().toString(36)}`;

    try {
      await db.paymentOrder.create({
        data: {
          razorpayOrderId: demoOrderId,
          amount,
          currency: "INR",
          receipt,
          status: "created",
          plan,
          userEmail: email,
        },
      });
    } catch (dbErr) {
      console.error(`[create-order][${reqId}] demo PaymentOrder.create failed:`, dbErr);
    }

    console.log(`[create-order][${reqId}] demo order created: ${demoOrderId}`);

    return NextResponse.json({
      orderId: demoOrderId,
      amount,
      currency: "INR",
      keyId: "rzp_test_DemoKey",
      receipt,
      isLive: false,
      demoMode: true,
      reqId,
    });
  } catch (error) {
    console.error(`[create-order][${reqId}] fatal:`, error);
    return NextResponse.json(
      {
        error: `Failed to create payment order: ${describeError(error)}`,
        reqId,
      },
      { status: 500 }
    );
  }
}
