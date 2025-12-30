import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

// Disable body parsing, we need the raw body for webhook signature verification
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("Missing Stripe signature");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error handling ${event.type}:`, error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const planType = session.metadata?.planType || "monthly";
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error("No userId in checkout session metadata");
    return;
  }

  // Fetch the subscription to get current period end
  const stripeInstance = getStripe();
  const stripeSubscription = await stripeInstance.subscriptions.retrieve(subscriptionId);
  // Access the raw response data which has current_period_end
  const currentPeriodEnd = new Date((stripeSubscription as unknown as { current_period_end: number }).current_period_end * 1000);

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      status: "active",
      planType,
      currentPeriodEnd,
    },
    update: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      status: "active",
      planType,
      currentPeriodEnd,
      canceledAt: null,
    },
  });

  console.log(`Checkout completed for user ${userId}, subscription ${subscriptionId}`);
}

async function handleSubscriptionUpdate(stripeSubscription: Stripe.Subscription) {
  const customerId = stripeSubscription.customer as string;
  // Cast to access raw properties
  const subData = stripeSubscription as unknown as {
    id: string;
    status: string;
    cancel_at_period_end: boolean;
    current_period_end: number;
    canceled_at: number | null;
  };

  // Find user by Stripe customer ID
  const existingSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!existingSubscription) {
    console.error(`No subscription found for customer ${customerId}`);
    return;
  }

  // Map Stripe status to our status
  let status = subData.status;
  if (subData.cancel_at_period_end) {
    status = "canceled"; // Will cancel at period end
  }

  await prisma.subscription.update({
    where: { stripeCustomerId: customerId },
    data: {
      stripeSubscriptionId: subData.id,
      status,
      currentPeriodEnd: new Date(subData.current_period_end * 1000),
      canceledAt: subData.canceled_at
        ? new Date(subData.canceled_at * 1000)
        : null,
    },
  });

  console.log(`Subscription ${subData.id} updated to status: ${status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const existingSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!existingSubscription) {
    console.error(`No subscription found for customer ${customerId}`);
    return;
  }

  await prisma.subscription.update({
    where: { stripeCustomerId: customerId },
    data: {
      status: "canceled",
      stripeSubscriptionId: null,
      canceledAt: new Date(),
    },
  });

  console.log(`Subscription ${subscription.id} deleted for customer ${customerId}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const existingSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!existingSubscription) {
    console.error(`No subscription found for customer ${customerId}`);
    return;
  }

  await prisma.subscription.update({
    where: { stripeCustomerId: customerId },
    data: {
      status: "past_due",
    },
  });

  console.log(`Payment failed for customer ${customerId}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const existingSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!existingSubscription) {
    // Might be a new subscription, handled by checkout.session.completed
    return;
  }

  // Only update if currently past_due
  if (existingSubscription.status === "past_due") {
    await prisma.subscription.update({
      where: { stripeCustomerId: customerId },
      data: {
        status: "active",
      },
    });

    console.log(`Payment succeeded, subscription reactivated for customer ${customerId}`);
  }
}
