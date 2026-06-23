import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const PRO_PLAN_AMOUNT = 39900; // ₹399 in paise

function getEnvVar(name: string): string | null {
  if (process.env[name]) return process.env[name]!;
  // Backup secrets file (.secrets/youtube.env) — never touched by Prisma
  try {
    const backupPath = join(process.cwd(), ".secrets", "youtube.env");
    if (existsSync(backupPath)) {
      const content = readFileSync(backupPath, "utf-8");
      const match = content.match(new RegExp(`${name}\\s*=\\s*(.+)`));
      if (match && match[1].trim()) return match[1].trim();
    }
  } catch { /* ignore */ }
  try {
    const envLocalPath = join(process.cwd(), ".env.local");
    if (existsSync(envLocalPath)) {
      const content = readFileSync(envLocalPath, "utf-8");
      const match = content.match(new RegExp(`${name}\\s*=\\s*(.+)`));
      if (match && match[1].trim()) return match[1].trim();
    }
  } catch { /* ignore */ }
  try {
    const envPath = join(process.cwd(), ".env");
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, "utf-8");
      const match = content.match(new RegExp(`${name}\\s*=\\s*(.+)`));
      if (match && match[1].trim()) return match[1].trim();
    }
  } catch { /* ignore */ }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, plan = "pro" } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const amount = plan === "pro" ? PRO_PLAN_AMOUNT : 0;

    if (amount === 0) {
      return NextResponse.json({ error: "Free plan does not require payment" }, { status: 400 });
    }

    const keyId = getEnvVar("RAZORPAY_KEY_ID");
    const keySecret = getEnvVar("RAZORPAY_KEY_SECRET");
    const isRazorpayConfigured = keyId && keySecret && !keyId.startsWith("rzp_test_YourKey");

    if (isRazorpayConfigured) {
      const Razorpay = (await import("razorpay")).default;
      const razorpay = new Razorpay({ key_id: keyId!, key_secret: keySecret! });

      const receipt = `rcpt_${Date.now()}_${email.replace(/[@.]/g, "_")}`;

      const order = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt,
        notes: { email, name: name || "", plan },
      });

      await db.paymentOrder.create({
        data: {
          razorpayOrderId: order.id,
          amount,
          currency: "INR",
          receipt,
          status: "created",
          plan,
          userEmail: email,
        },
      });

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: keyId,
        receipt: order.receipt,
        isLive: true,
      });
    }

    // Demo mode - simulate order creation
    const demoOrderId = `order_demo_${Date.now()}`;
    const receipt = `rcpt_demo_${Date.now()}`;

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

    return NextResponse.json({
      orderId: demoOrderId,
      amount,
      currency: "INR",
      keyId: "rzp_test_DemoKey",
      receipt,
      isLive: false,
      demoMode: true,
    });

  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
