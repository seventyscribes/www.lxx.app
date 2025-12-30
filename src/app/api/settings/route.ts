import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/settings - Get user preferences
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let settings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id },
    });

    // Create default settings if they don't exist
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId: session.user.id,
          fontSize: "base",
          fontFamily: "serif",
          showSummaries: true,
        },
      });
    }

    return NextResponse.json({
      fontSize: settings.fontSize,
      fontFamily: settings.fontFamily,
      showSummaries: settings.showSummaries,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PATCH /api/settings - Update user preferences
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fontSize, fontFamily, showSummaries } = body;

    // Validate inputs
    const validFontSizes = ["sm", "base", "lg", "xl"];
    const validFontFamilies = ["serif", "sans"];

    if (fontSize !== undefined && !validFontSizes.includes(fontSize)) {
      return NextResponse.json(
        { error: "Invalid font size" },
        { status: 400 }
      );
    }

    if (fontFamily !== undefined && !validFontFamilies.includes(fontFamily)) {
      return NextResponse.json(
        { error: "Invalid font family" },
        { status: 400 }
      );
    }

    // Upsert settings
    const settings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        ...(fontSize !== undefined && { fontSize }),
        ...(fontFamily !== undefined && { fontFamily }),
        ...(showSummaries !== undefined && { showSummaries }),
      },
      create: {
        userId: session.user.id,
        fontSize: fontSize || "base",
        fontFamily: fontFamily || "serif",
        showSummaries: showSummaries ?? true,
      },
    });

    return NextResponse.json({
      fontSize: settings.fontSize,
      fontFamily: settings.fontFamily,
      showSummaries: settings.showSummaries,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
