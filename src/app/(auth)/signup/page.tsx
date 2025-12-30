"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@/components/ui";

function BookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M8 7h6" />
      <path d="M8 11h8" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An error occurred");
        return;
      }

      // Sign in the user after successful signup
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but could not sign in. Please try logging in.");
      } else {
        router.push("/today");
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    signIn("google", { callbackUrl: "/today" });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      {/* Logo & Title */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-navy rounded-[28px] flex items-center justify-center text-gold mx-auto mb-6 shadow-paper-xl border border-gold/10">
          <BookIcon />
        </div>
        <h1 className="text-3xl font-serif font-bold text-navy mb-2">
          Begin Your Journey
        </h1>
        <p className="text-gray-400 text-sm font-sans">
          365 days through Scripture awaits
        </p>
      </div>

      {/* Trial Info Card */}
      <div className="w-full max-w-sm mb-8 bg-gold/5 border border-gold/20 rounded-[20px] p-5">
        <h3 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-3">
          7-Day Free Trial Includes
        </h3>
        <ul className="space-y-2.5">
          {[
            "Full access to daily readings",
            "Guided reflection prompts",
            "Private journal with auto-save",
            "Progress tracking & streaks",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-charcoal/80">
              <span className="text-gold">
                <CheckIcon />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Error Display */}
      {error && (
        <div className="w-full max-w-sm mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
        <Input
          type="text"
          label="Name (optional)"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />

        <Input
          type="email"
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Input
          type="password"
          label="Password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />

        <div className="pt-4">
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Start Free Trial"}
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div className="w-full max-w-sm flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          or
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google Sign Up */}
      <button
        onClick={handleGoogleSignup}
        className="w-full max-w-sm flex items-center justify-center gap-3 py-4 px-6 bg-white border border-gray-200 rounded-[28px] shadow-paper hover:border-gray-300 transition-all active:scale-[0.98]"
      >
        <GoogleIcon />
        <span className="font-semibold text-gray-700 text-sm">
          Continue with Google
        </span>
      </button>

      {/* Login Link */}
      <p className="mt-10 text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-navy font-semibold hover:text-gold transition-colors"
        >
          Sign in
        </Link>
      </p>

      {/* Footer */}
      <footer className="mt-auto pt-12 text-center">
        <p className="text-[9px] text-gray-300 uppercase tracking-widest">
          No credit card required for trial
        </p>
      </footer>
    </div>
  );
}
