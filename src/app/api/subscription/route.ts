import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSubscriptionDetails } from "@/lib/subscription";

// GET /api/subscription - Get current user's subscription status
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const details = await getSubscriptionDetails(session.user.id);

    if (!details) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(details);
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription status" },
      { status: 500 }
    );
  }
}
