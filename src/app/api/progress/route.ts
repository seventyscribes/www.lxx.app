import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/progress - Get user's progress
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let progress = await prisma.userProgress.findUnique({
      where: { userId: session.user.id },
    });

    // Create progress record if it doesn't exist
    if (!progress) {
      progress = await prisma.userProgress.create({
        data: {
          userId: session.user.id,
          currentDay: 1,
          completedDayIds: [],
          streakCount: 0,
          longestStreak: 0,
        },
      });
    }

    // Get journal entries for notes info
    const entries = await prisma.journalEntry.findMany({
      where: { userId: session.user.id },
      select: { dayNumber: true, content: true, reflectionAnswers: true },
    });

    // Build notes map
    const notes: Record<number, string> = {};
    const reflectionAnswers: Record<number, Record<string, string>> = {};

    for (const entry of entries) {
      if (entry.content) {
        notes[entry.dayNumber] = entry.content;
      }
      if (entry.reflectionAnswers) {
        reflectionAnswers[entry.dayNumber] = entry.reflectionAnswers as Record<
          string,
          string
        >;
      }
    }

    return NextResponse.json({
      currentDay: progress.currentDay,
      completedDayIds: progress.completedDayIds,
      streakCount: progress.streakCount,
      longestStreak: progress.longestStreak,
      lastActiveDate: progress.lastActiveDate,
      notes,
      reflectionAnswers,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

// PATCH /api/progress - Update current day
export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentDay } = body;

    if (
      typeof currentDay !== "number" ||
      currentDay < 1 ||
      currentDay > 365
    ) {
      return NextResponse.json(
        { error: "Invalid current day" },
        { status: 400 }
      );
    }

    const progress = await prisma.userProgress.update({
      where: { userId: session.user.id },
      data: { currentDay },
    });

    return NextResponse.json({
      currentDay: progress.currentDay,
      completedDayIds: progress.completedDayIds,
      streakCount: progress.streakCount,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
