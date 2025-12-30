import Stripe from "stripe";

// Lazy initialization to avoid build-time errors when env vars aren't set
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

// Re-export Stripe types for use in other files
export type { Stripe };

// Pricing configuration
export const PRICING = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    price: 4.99,
    interval: "month" as const,
    label: "Monthly",
    description: "$4.99/month",
  },
  annual: {
    priceId: process.env.STRIPE_ANNUAL_PRICE_ID!,
    price: 39.99,
    interval: "year" as const,
    label: "Annual",
    description: "$39.99/year",
    savings: "Save 33%",
  },
} as const;

export type PlanType = keyof typeof PRICING;

// Trial configuration
export const TRIAL_DAYS = 7;
export const TRIAL_CONTENT_LIMIT = 7; // First 7 days accessible during trial
