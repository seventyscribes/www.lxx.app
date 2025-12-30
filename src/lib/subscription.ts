import { prisma } from "./prisma";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "trial_expired"
  | "canceled"
  | "past_due"
  | "no_subscription";

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  hasAccess: boolean;
  isTrialing: boolean;
  trialDaysRemaining: number | null;
  planType: string | null;
  currentPeriodEnd: Date | null;
  canAccessDay: (dayNumber: number) => boolean;
}

/**
 * Get comprehensive subscription status for a user
 */
export async function getSubscriptionStatus(userId: string): Promise<SubscriptionInfo> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) {
    return {
      status: "no_subscription",
      hasAccess: false,
      isTrialing: false,
      trialDaysRemaining: null,
      planType: null,
      currentPeriodEnd: null,
      canAccessDay: () => false,
    };
  }

  // Check for active subscription
  const subscription = user.subscription;
  if (subscription) {
    const isActive = subscription.status === "active" || subscription.status === "trialing";

    if (isActive) {
      return {
        status: subscription.status as SubscriptionStatus,
        hasAccess: true,
        isTrialing: false,
        trialDaysRemaining: null,
        planType: subscription.planType,
        currentPeriodEnd: subscription.currentPeriodEnd,
        canAccessDay: () => true, // Full access for subscribers
      };
    }

    // Handle past_due or canceled subscriptions
    if (subscription.status === "past_due") {
      return {
        status: "past_due",
        hasAccess: false,
        isTrialing: false,
        trialDaysRemaining: null,
        planType: subscription.planType,
        currentPeriodEnd: subscription.currentPeriodEnd,
        canAccessDay: (day) => day <= 7, // Limited to trial content
      };
    }

    if (subscription.status === "canceled") {
      return {
        status: "canceled",
        hasAccess: false,
        isTrialing: false,
        trialDaysRemaining: null,
        planType: subscription.planType,
        currentPeriodEnd: subscription.currentPeriodEnd,
        canAccessDay: (day) => day <= 7,
      };
    }
  }

  // Check trial period
  if (user.trialEndDate) {
    const now = new Date();
    const trialEnd = new Date(user.trialEndDate);

    if (now < trialEnd) {
      const daysRemaining = Math.ceil(
        (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        status: "trialing",
        hasAccess: true,
        isTrialing: true,
        trialDaysRemaining: daysRemaining,
        planType: null,
        currentPeriodEnd: null,
        canAccessDay: (day) => day <= 7, // Trial users can only access first 7 days
      };
    }
  }

  // Trial expired, no subscription
  return {
    status: "trial_expired",
    hasAccess: false,
    isTrialing: false,
    trialDaysRemaining: 0,
    planType: null,
    currentPeriodEnd: null,
    canAccessDay: (day) => day <= 7, // Can still access completed trial days
  };
}

/**
 * Check if a user can access a specific day's content
 */
export async function canAccessContent(userId: string, dayNumber: number): Promise<{
  canAccess: boolean;
  reason: string;
}> {
  const status = await getSubscriptionStatus(userId);

  // First 7 days are always accessible
  if (dayNumber <= 7) {
    return { canAccess: true, reason: "Trial content" };
  }

  // Check subscription status for days 8+
  if (status.canAccessDay(dayNumber)) {
    return { canAccess: true, reason: status.status };
  }

  // Determine the appropriate reason
  switch (status.status) {
    case "trial_expired":
      return { canAccess: false, reason: "Trial expired - subscription required" };
    case "canceled":
      return { canAccess: false, reason: "Subscription canceled" };
    case "past_due":
      return { canAccess: false, reason: "Payment past due" };
    default:
      return { canAccess: false, reason: "Subscription required" };
  }
}

/**
 * Get subscription details for display on Account page
 */
export async function getSubscriptionDetails(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) return null;

  const status = await getSubscriptionStatus(userId);

  return {
    ...status,
    email: user.email,
    trialEndDate: user.trialEndDate,
    subscription: user.subscription ? {
      stripeCustomerId: user.subscription.stripeCustomerId,
      stripeSubscriptionId: user.subscription.stripeSubscriptionId,
      planType: user.subscription.planType,
      status: user.subscription.status,
      currentPeriodEnd: user.subscription.currentPeriodEnd,
      canceledAt: user.subscription.canceledAt,
    } : null,
  };
}
