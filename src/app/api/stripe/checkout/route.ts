import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe, PRICING, type PlanType } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const planType = body.planType as PlanType;

    if (!planType || !PRICING[planType]) {
      return NextResponse.json(
        { error: "Invalid plan type. Use 'monthly' or 'annual'" },
        { status: 400 }
      );
    }

    const plan = PRICING[planType];
    const stripe = getStripe();

    // Get or create Stripe customer
    let stripeCustomerId: string;

    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (existingSubscription?.stripeCustomerId) {
      stripeCustomerId = existingSubscription.stripeCustomerId;
    } else {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          userId: session.user.id,
        },
      });
      stripeCustomerId = customer.id;

      // Save the customer ID (create or update subscription record)
      await prisma.subscription.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          stripeCustomerId,
          status: "incomplete",
          planType,
        },
        update: {
          stripeCustomerId,
        },
      });
    }

    // Create Stripe checkout session
    const origin = request.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          userId: session.user.id,
          planType,
        },
      },
      success_url: `${origin}/account?success=true`,
      cancel_url: `${origin}/account?canceled=true`,
      metadata: {
        userId: session.user.id,
        planType,
      },
    });

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
