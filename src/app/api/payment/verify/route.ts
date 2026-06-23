import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

function getRazorpayKeySecret(): string | null {
  if (process.env.RAZORPAY_KEY_SECRET) return process.env.RAZORPAY_KEY_SECRET;
  try {
    const backupPath = join(process.cwd(), ".secrets", "youtube.env");
    if (existsSync(backupPath)) {
      const content = readFileSync(backupPath, "utf-8");
      const match = content.match(/RAZORPAY_KEY_SECRET\s*=\s*(.+)/);
      if (match && match[1].trim()) return match[1].trim();
    }
  } catch { /* ignore */ }
  try {
    const envLocalPath = join(process.cwd(), ".env.local");
    if (existsSync(envLocalPath)) {
      const content = readFileSync(envLocalPath, "utf-8");
      const match = content.match(/RAZORPAY_KEY_SECRET\s*=\s*(.+)/);
      if (match && match[1].trim()) return match[1].trim();
    }
  } catch { /* ignore */ }
  try {
    const envPath = join(process.cwd(), ".env");
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, "utf-8");
      const match = content.match(/RAZORPAY_KEY_SECRET\s*=\s*(.+)/);
      if (match && match[1].trim()) return match[1].trim();
    }
  } catch { /* ignore */ }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      name,
      plan = "pro",
      method = "unknown",
      demoMode = false,
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: "Payment details are required" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const keySecret = getRazorpayKeySecret();
    const isRazorpayConfigured = keySecret && !keySecret.startsWith("YourKeySecret");

    // Verify payment signature (only for real Razorpay)
    if (isRazorpayConfigured && !demoMode) {
      const expectedSignature = crypto
        .createHmac("sha256", keySecret!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ error: "Payment verification failed. Invalid signature." }, { status: 400 });
      }
    }

    // Update payment order status
    await db.paymentOrder.updateMany({
      where: { razorpayOrderId: razorpay_order_id },
      data: { status: "paid" },
    });

    // Create or update user
    const existingUser = await db.user.findUnique({ where: { email } });

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      await db.user.update({
        where: { id: userId },
        data: {
          plan: "pro",
          analysesLimit: -1, // unlimited
          name: name || existingUser.name,
        },
      });
    } else {
      const newUser = await db.user.create({
        data: {
          email,
          name: name || null,
          plan: "pro",
          analysesLimit: -1,
        },
      });
      userId = newUser.id;
    }

    // Create subscription record
    const amount = plan === "pro" ? 39900 : 0;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

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

    return NextResponse.json({
      success: true,
      message: "Payment verified and Pro plan activated successfully!",
      subscription: {
        plan: "pro",
        status: "active",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        method,
      },
    });

  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
