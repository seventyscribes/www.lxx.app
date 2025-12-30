import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper to check if two dates are on the same calendar day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Helper to check if date1 is the day before date2
function isConsecutiveDay(date1: Date, date2: Date): boolean {
  const dayBefore = new Date(date2);
  dayBefore.setDate(dayBefore.getDate() - 1);
  return isSameDay(date1, dayBefore);
}

// POST /api/progress/complete - Mark a day as complete
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { dayNumber } = body;

    if (
      typeof dayNumber !== "number" ||
      dayNumber < 1 ||
      dayNumber > 365
    ) {
      return NextResponse.json(
        { error: "Invalid day number" },
        { status: 400 }
      );
    }

    // Get current progress
    let progress = await prisma.userProgress.findUnique({
      where: { userId: session.user.id },
    });

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

    // Check if day is already completed
    if (progress.completedDayIds.includes(dayNumber)) {
      return NextResponse.json({
        message: "Day already completed",
        currentDay: progress.currentDay,
        completedDayIds: progress.completedDayIds,
        streakCount: progress.streakCount,
        longestStreak: progress.longestStreak,
      });
    }

    // Calculate streak
    const today = new Date();
    let newStreakCount = progress.streakCount;
    let newLongestStreak = progress.longestStreak;

    if (progress.lastActiveDate) {
      if (isSameDay(progress.lastActiveDate, today)) {
        // Already active today, just add the completed day
        // Streak stays the same
      } else if (isConsecutiveDay(progress.lastActiveDate, today)) {
        // Consecutive day, increment streak
        newStreakCount = progress.streakCount + 1;
      } else {
        // Streak broken, reset to 1
        newStreakCount = 1;
      }
    } else {
      // First activity, start streak at 1
      newStreakCount = 1;
    }

    // Update longest streak if current streak is higher
    if (newStreakCount > newLongestStreak) {
      newLongestStreak = newStreakCount;
    }

    // Update progress
    const updatedProgress = await prisma.userProgress.update({
      where: { userId: session.user.id },
      data: {
        completedDayIds: [...progress.completedDayIds, dayNumber],
        lastActiveDate: today,
        streakCount: newStreakCount,
        longestStreak: newLongestStreak,
        // Optionally advance currentDay if completing the current day
        currentDay:
          dayNumber === progress.currentDay
            ? Math.min(progress.currentDay + 1, 365)
            : progress.currentDay,
      },
    });

    return NextResponse.json({
      message: "Day marked as complete",
      currentDay: updatedProgress.currentDay,
      completedDayIds: updatedProgress.completedDayIds,
      streakCount: updatedProgress.streakCount,
      longestStreak: updatedProgress.longestStreak,
    });
  } catch (error) {
    console.error("Error marking day complete:", error);
    return NextResponse.json(
      { error: "Failed to mark day as complete" },
      { status: 500 }
    );
  }
}
