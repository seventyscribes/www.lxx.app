"use client";

import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useProgress } from "@/lib/context";
import { Toggle, Paywall } from "@/components/ui";
import { cn } from "@/lib/utils";

interface SubscriptionInfo {
  status: string;
  hasAccess: boolean;
  isTrialing: boolean;
  trialDaysRemaining: number | null;
  planType: string | null;
  currentPeriodEnd: string | null;
  subscription: {
    stripeCustomerId: string;
    status: string;
    planType: string;
  } | null;
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 6l4 6 5-4-2 10H5L3 8l5 4 4-6z" />
    </svg>
  );
}

const FONT_SIZES = ["sm", "base", "lg", "xl"] as const;

export default function AccountPage() {
  const { progress, updateSettings } = useProgress();
  const searchParams = useSearchParams();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  // Check for success/canceled query params
  const checkoutSuccess = searchParams.get("success") === "true";
  const checkoutCanceled = searchParams.get("canceled") === "true";

  useEffect(() => {
    async function fetchSubscriptionStatus() {
      try {
        const response = await fetch("/api/subscription");
        if (response.ok) {
          const data = await response.json();
          setSubscriptionInfo(data);
        }
      } catch (error) {
        console.error("Failed to fetch subscription status:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptionStatus();
  }, [checkoutSuccess]);

  const handleManageSubscription = async () => {
    if (!subscriptionInfo?.subscription?.stripeCustomerId) {
      // No subscription yet, show paywall
      setShowPaywall(true);
      return;
    }

    setPortalLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to open customer portal:", error);
    } finally {
      setPortalLoading(false);
    }
  };

  const getStatusLabel = () => {
    if (!subscriptionInfo) return { label: "Loading...", color: "text-gray-400" };

    switch (subscriptionInfo.status) {
      case "active":
        return { label: "LXX Premium", color: "text-gold" };
      case "trialing":
        return {
          label: `Free Trial (${subscriptionInfo.trialDaysRemaining} day${subscriptionInfo.trialDaysRemaining !== 1 ? "s" : ""} left)`,
          color: "text-gold"
        };
      case "trial_expired":
        return { label: "Trial Expired", color: "text-red-400" };
      case "canceled":
        return { label: "Canceled", color: "text-orange-400" };
      case "past_due":
        return { label: "Payment Past Due", color: "text-red-400" };
      default:
        return { label: "Free Account", color: "text-gray-400" };
    }
  };

  const statusInfo = getStatusLabel();
  const isSubscribed = subscriptionInfo?.status === "active";
  const isTrialing = subscriptionInfo?.isTrialing;
  const showUpgradeButton = !isSubscribed;

  return (
    <div className="bg-parchment min-h-screen p-6 pb-24 max-w-2xl mx-auto">
      {/* Success/Canceled Messages */}
      {checkoutSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-[16px] text-sm">
          Welcome to LXX Premium! Your subscription is now active.
        </div>
      )}
      {checkoutCanceled && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-[16px] text-sm">
          Checkout was canceled. You can try again anytime.
        </div>
      )}

      <header className="mb-10 mt-6 text-center">
        <div className="w-20 h-20 bg-navy rounded-[28px] flex items-center justify-center text-gold mx-auto mb-5 shadow-paper-xl border border-gold/10 relative">
          <UserIcon />
          {isSubscribed && (
            <div className="absolute -bottom-1 -right-1 bg-gold w-6 h-6 rounded-full border-4 border-parchment shadow-sm flex items-center justify-center">
              <CrownIcon />
            </div>
          )}
          {!isSubscribed && (
            <div className="absolute -bottom-1 -right-1 bg-gold w-6 h-6 rounded-full border-4 border-parchment shadow-sm" />
          )}
        </div>
        <h2 className="text-2xl font-serif font-bold text-navy">
          Reflective Heart
        </h2>
        <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] mt-2 font-bold opacity-60">
          Private Study Account
        </p>
      </header>

      <div className="space-y-8">
        {/* Subscription Status Card */}
        <div className="bg-navy text-white rounded-[32px] p-7 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full -mr-24 -mt-24 transition-transform group-hover:scale-125 duration-1000" />
          <div className="relative z-10">
            <h4 className="text-gold text-[10px] uppercase tracking-widest font-bold mb-2 opacity-80">
              Membership
            </h4>
            <p className={cn("text-2xl font-serif font-bold", statusInfo.color)}>
              {loading ? "Loading..." : statusInfo.label}
            </p>
            <div className="h-px w-8 bg-gold/40 my-4" />
            {isSubscribed ? (
              <p className="text-sm text-gray-300 leading-relaxed opacity-70">
                365 days of sacred guidance.
                <br />
                {subscriptionInfo?.planType === "annual" ? "Annual" : "Monthly"} plan
                {subscriptionInfo?.currentPeriodEnd && (
                  <> &bull; Renews {new Date(subscriptionInfo.currentPeriodEnd).toLocaleDateString()}</>
                )}
              </p>
            ) : isTrialing ? (
              <p className="text-sm text-gray-300 leading-relaxed opacity-70">
                Explore the first 7 days free.
                <br />
                Upgrade to unlock all 365 days.
              </p>
            ) : (
              <p className="text-sm text-gray-300 leading-relaxed opacity-70">
                Subscribe to unlock the full
                <br />
                365-day Bible study journey.
              </p>
            )}

            {/* Upgrade Button */}
            {showUpgradeButton && !loading && (
              <button
                onClick={() => setShowPaywall(true)}
                className="mt-5 bg-gold text-navy px-6 py-3 rounded-[16px] font-bold text-xs uppercase tracking-widest hover:bg-gold/90 transition-colors"
              >
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>

        {/* Reading Preferences */}
        <section>
          <h3 className="text-navy text-[11px] uppercase tracking-widest font-bold mb-4 ml-1 opacity-50">
            Reading Preferences
          </h3>
          <div className="bg-white rounded-[28px] p-2 overflow-hidden border border-gray-100 shadow-paper">
            {/* Font Family */}
            <div className="px-5 py-5 flex items-center justify-between border-b border-gray-50">
              <span className="text-sm font-semibold text-navy">
                Typography Style
              </span>
              <div className="flex bg-parchment p-1 rounded-xl gap-1">
                <button
                  onClick={() => updateSettings({ fontFamily: "serif" })}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-serif transition-all",
                    progress.settings.fontFamily === "serif"
                      ? "bg-white shadow-sm text-gold font-bold"
                      : "text-gray-400"
                  )}
                >
                  Serif
                </button>
                <button
                  onClick={() => updateSettings({ fontFamily: "sans" })}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-sans transition-all",
                    progress.settings.fontFamily === "sans"
                      ? "bg-white shadow-sm text-gold font-bold"
                      : "text-gray-400"
                  )}
                >
                  Sans
                </button>
              </div>
            </div>

            {/* Font Size */}
            <div className="px-5 py-5 flex items-center justify-between border-b border-gray-50">
              <span className="text-sm font-semibold text-navy">Text Size</span>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-gray-300">A</span>
                <div className="flex gap-1.5">
                  {FONT_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSettings({ fontSize: size })}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center",
                        progress.settings.fontSize === size
                          ? "border-gold bg-gold/5 scale-110"
                          : "border-gray-100"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-full bg-gold",
                          progress.settings.fontSize === size
                            ? "w-2 h-2"
                            : "w-0 h-0 opacity-0"
                        )}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-300">A</span>
              </div>
            </div>

            {/* Toggle Preferences */}
            <Toggle
              label="Modern Summaries"
              description="Explain KJV passages"
              checked={progress.settings.showSummaries}
              onChange={(checked) => updateSettings({ showSummaries: checked })}
            />
          </div>
        </section>

        {/* Actions */}
        <section>
          <h3 className="text-navy text-[11px] uppercase tracking-widest font-bold mb-4 ml-1 opacity-50">
            Journey Management
          </h3>
          <div className="bg-white rounded-[28px] overflow-hidden border border-gray-100 shadow-paper">
            <button
              onClick={handleManageSubscription}
              disabled={portalLoading}
              className="w-full px-5 py-5 border-b border-gray-50 flex items-center justify-between active:bg-gray-50 transition-colors group disabled:opacity-50"
            >
              <span className="text-sm font-semibold text-navy">
                {subscriptionInfo?.subscription ? "Manage Subscription" : "Subscribe"}
              </span>
              <div className="text-gold transition-transform group-hover:translate-x-1">
                {portalLoading ? (
                  <span className="text-xs text-gray-400">Loading...</span>
                ) : (
                  <ChevronRight />
                )}
              </div>
            </button>
            <button className="w-full px-5 py-5 border-b border-gray-50 flex items-center justify-between active:bg-gray-50 transition-colors group">
              <span className="text-sm font-semibold text-navy">
                Export Sacred Reflections
              </span>
              <div className="text-gold transition-transform group-hover:translate-x-1">
                <ChevronRight />
              </div>
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full px-5 py-5 flex items-center justify-between text-red-500 active:bg-red-50 transition-colors group"
            >
              <span className="text-sm font-bold uppercase tracking-widest text-[11px]">
                Sign Out
              </span>
              <LogOutIcon />
            </button>
          </div>
        </section>

        <footer className="pt-12 pb-16 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 opacity-20">
            <div className="w-1 h-1 bg-navy rounded-full" />
            <div className="w-1 h-1 bg-navy rounded-full" />
            <div className="w-1 h-1 bg-navy rounded-full" />
          </div>
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em]">
            LXX Bible Study &copy; MMXXV
          </p>
          <p className="text-[9px] text-gray-300 uppercase tracking-widest">
            Build 0.0.4-alpha &bull; Made with reverence
          </p>
        </footer>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <Paywall
          trialDaysRemaining={subscriptionInfo?.trialDaysRemaining ?? undefined}
          isTrialExpired={subscriptionInfo?.status === "trial_expired"}
          onClose={() => setShowPaywall(false)}
        />
      )}
    </div>
  );
}
