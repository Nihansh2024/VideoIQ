import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
      include: {
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        plan: "free",
        analysesUsed: 0,
        analysesLimit: 1,
        subscription: null,
      });
    }

    const activeSub = user.subscriptions.find(s => s.status === "active");

    return NextResponse.json({
      plan: user.plan,
      analysesUsed: user.analysesUsed,
      analysesLimit: user.analysesLimit === -1 ? "unlimited" : user.analysesLimit,
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
    return NextResponse.json({ error: "Failed to check subscription" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Downgrade user to free
    const user = await db.user.findUnique({ where: { email } });
    if (user) {
      await db.user.update({
        where: { id: user.id },
        data: {
          plan: "free",
          analysesLimit: 1,
        },
      });

      // Cancel active subscriptions
      await db.subscription.updateMany({
        where: { userId: user.id, status: "active" },
        data: { status: "cancelled", endDate: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Subscription cancelled successfully. You are now on the Free plan.",
    });

  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}
