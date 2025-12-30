import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessContent, getSubscriptionStatus } from "@/lib/subscription";
import { TRIAL_CONTENT_LIMIT } from "@/lib/stripe";

// GET /api/days/[dayNumber] - Fetch Bible day content
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dayNumber: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dayNumber: dayParam } = await params;
    const dayNumber = parseInt(dayParam, 10);

    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 365) {
      return NextResponse.json(
        { error: "Invalid day number" },
        { status: 400 }
      );
    }

    // Check content access using subscription status
    if (dayNumber > TRIAL_CONTENT_LIMIT) {
      const access = await canAccessContent(session.user.id, dayNumber);
      if (!access.canAccess) {
        // Get subscription status for paywall display
        const subscriptionStatus = await getSubscriptionStatus(session.user.id);
        return NextResponse.json(
          {
            error: "Subscription required",
            reason: access.reason,
            subscriptionStatus: subscriptionStatus.status,
            trialDaysRemaining: subscriptionStatus.trialDaysRemaining,
            isTrialExpired: subscriptionStatus.status === "trial_expired",
          },
          { status: 403 }
        );
      }
    }

    const bibleDay = await prisma.bibleDay.findUnique({
      where: { dayNumber },
    });

    if (!bibleDay) {
      return NextResponse.json(
        { error: "Day content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      dayNumber: bibleDay.dayNumber,
      title: bibleDay.title,
      passageReference: bibleDay.passageReference,
      verses: bibleDay.verses,
      modernSummary: bibleDay.modernSummary,
      reflectionPrompts: bibleDay.reflectionPrompts,
    });
  } catch (error) {
    console.error("Error fetching Bible day:", error);
    return NextResponse.json(
      { error: "Failed to fetch day content" },
      { status: 500 }
    );
  }
}
