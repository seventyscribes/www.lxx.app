"use client";

import React, { useState } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface PaywallProps {
  trialDaysRemaining?: number;
  isTrialExpired?: boolean;
  onClose?: () => void;
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const FEATURES = [
  "Full 365-day reading plan",
  "Daily reflection prompts",
  "Private journaling space",
  "Progress tracking & streaks",
  "Modern scripture summaries",
];

export function Paywall({
  trialDaysRemaining,
  isTrialExpired = false,
  onClose,
}: PaywallProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType: selectedPlan }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Failed to create checkout session:", data.error);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-parchment rounded-[32px] max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-navy text-center p-8 rounded-t-[32px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full -mr-24 -mt-24" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-gold">
                <LockIcon />
              </div>
            </div>
            <h2 className="text-white text-2xl font-serif font-bold mb-2">
              {isTrialExpired ? "Your Trial Has Ended" : "Continue Your Journey"}
            </h2>
            <p className="text-gray-300 text-sm">
              {isTrialExpired
                ? "Subscribe to unlock all 365 days of sacred guidance"
                : trialDaysRemaining
                  ? `${trialDaysRemaining} day${trialDaysRemaining !== 1 ? "s" : ""} remaining in your trial`
                  : "Unlock the full Bible study experience"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Plan Selection */}
          <div className="space-y-3">
            {/* Annual Plan */}
            <button
              onClick={() => setSelectedPlan("annual")}
              className={cn(
                "w-full p-4 rounded-[20px] border-2 transition-all text-left relative",
                selectedPlan === "annual"
                  ? "border-gold bg-gold/5"
                  : "border-gray-200 bg-white hover:border-gold/30"
              )}
            >
              <div className="absolute -top-2.5 right-4 bg-gold text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Best Value
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-navy">Annual</p>
                  <p className="text-gray-400 text-sm">Save 33% ($3.33/month)</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-navy">$39.99</p>
                  <p className="text-gray-400 text-xs">/year</p>
                </div>
              </div>
              <div
                className={cn(
                  "absolute top-4 left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  selectedPlan === "annual"
                    ? "border-gold bg-gold text-white"
                    : "border-gray-300"
                )}
              >
                {selectedPlan === "annual" && <CheckIcon />}
              </div>
            </button>

            {/* Monthly Plan */}
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={cn(
                "w-full p-4 rounded-[20px] border-2 transition-all text-left relative",
                selectedPlan === "monthly"
                  ? "border-gold bg-gold/5"
                  : "border-gray-200 bg-white hover:border-gold/30"
              )}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-navy">Monthly</p>
                  <p className="text-gray-400 text-sm">Flexible billing</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-navy">$4.99</p>
                  <p className="text-gray-400 text-xs">/month</p>
                </div>
              </div>
              <div
                className={cn(
                  "absolute top-4 left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  selectedPlan === "monthly"
                    ? "border-gold bg-gold text-white"
                    : "border-gray-300"
                )}
              >
                {selectedPlan === "monthly" && <CheckIcon />}
              </div>
            </button>
          </div>

          {/* Features */}
          <div className="bg-white rounded-[20px] p-5 border border-gray-100">
            <p className="text-[10px] text-navy font-bold uppercase tracking-widest mb-4 opacity-50">
              What You Get
            </p>
            <ul className="space-y-3">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <div className="text-gold">
                      <CheckIcon />
                    </div>
                  </div>
                  <span className="text-sm text-charcoal">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            onClick={handleSubscribe}
            disabled={loading}
            className="mt-4"
          >
            {loading
              ? "Loading..."
              : `Subscribe ${selectedPlan === "annual" ? "Annually" : "Monthly"}`}
          </Button>

          {/* Close button for non-expired trials */}
          {!isTrialExpired && onClose && (
            <button
              onClick={onClose}
              className="w-full text-center text-gray-400 text-sm hover:text-gray-600 transition-colors"
            >
              Continue with trial
            </button>
          )}

          {/* Legal text */}
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            Cancel anytime. Secure payment via Stripe.
            <br />
            By subscribing, you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
