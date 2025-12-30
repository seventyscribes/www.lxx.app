import { NextRequest, NextResponse } from "next/server";
import { auth, checkUserAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // Check access for days beyond trial (day 7)
    if (dayNumber > 7) {
      const access = await checkUserAccess(session.user.id);
      if (!access.hasAccess) {
        return NextResponse.json(
          { error: "Subscription required", reason: access.reason },
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
