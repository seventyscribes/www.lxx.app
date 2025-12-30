import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/journal/[day] - Fetch journal entry for a specific day
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ day: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { day } = await params;
    const dayNumber = parseInt(day, 10);

    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 365) {
      return NextResponse.json(
        { error: "Invalid day number" },
        { status: 400 }
      );
    }

    const entry = await prisma.journalEntry.findUnique({
      where: {
        userId_dayNumber: {
          userId: session.user.id,
          dayNumber,
        },
      },
    });

    return NextResponse.json({
      dayNumber,
      content: entry?.content || "",
      reflectionAnswers: entry?.reflectionAnswers || {},
      updatedAt: entry?.updatedAt || null,
    });
  } catch (error) {
    console.error("Error fetching journal entry:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal entry" },
      { status: 500 }
    );
  }
}

// PUT /api/journal/[day] - Save/update journal entry for a specific day
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ day: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { day } = await params;
    const dayNumber = parseInt(day, 10);

    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 365) {
      return NextResponse.json(
        { error: "Invalid day number" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content, reflectionAnswers } = body;

    // Upsert the journal entry
    const entry = await prisma.journalEntry.upsert({
      where: {
        userId_dayNumber: {
          userId: session.user.id,
          dayNumber,
        },
      },
      update: {
        content: content ?? undefined,
        reflectionAnswers: reflectionAnswers ?? undefined,
      },
      create: {
        userId: session.user.id,
        dayNumber,
        content: content || null,
        reflectionAnswers: reflectionAnswers || {},
      },
    });

    return NextResponse.json({
      dayNumber: entry.dayNumber,
      content: entry.content,
      reflectionAnswers: entry.reflectionAnswers,
      updatedAt: entry.updatedAt,
    });
  } catch (error) {
    console.error("Error saving journal entry:", error);
    return NextResponse.json(
      { error: "Failed to save journal entry" },
      { status: 500 }
    );
  }
}
