import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind merge for proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Check if a trial has expired
 */
export function isTrialExpired(trialEndDate: Date): boolean {
  return new Date() > trialEndDate;
}

/**
 * Calculate days remaining in trial
 */
export function getDaysRemaining(trialEndDate: Date): number {
  const now = new Date();
  const diff = trialEndDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Calculate reading progress percentage
 */
export function getProgressPercentage(completedDays: number[], totalDays: number = 365): number {
  return Math.round((completedDays.length / totalDays) * 100);
}
