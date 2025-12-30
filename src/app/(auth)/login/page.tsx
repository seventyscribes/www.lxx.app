"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/today";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setFormError("Invalid email or password");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setFormError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      {/* Logo & Title */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-navy rounded-[28px] flex items-center justify-center text-gold mx-auto mb-6 shadow-paper-xl border border-gold/10">
          <BookIcon />
        </div>
        <h1 className="text-3xl font-serif font-bold text-navy mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-sm font-sans">
          Continue your journey through Scripture
        </p>
      </div>

      {/* Error Display */}
      {(error || formError) && (
        <div className="w-full max-w-sm mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-red-600 text-sm text-center">
            {formError || "An error occurred. Please try again."}
          </p>
        </div>
      )}

      {/* Login Form */}
      <form
        onSubmit={handleCredentialsLogin}
        className="w-full max-w-sm space-y-4"
      >
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
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <div className="pt-4">
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
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

      {/* Google Sign In */}
      <button
        onClick={handleGoogleLogin}
        className="w-full max-w-sm flex items-center justify-center gap-3 py-4 px-6 bg-white border border-gray-200 rounded-[28px] shadow-paper hover:border-gray-300 transition-all active:scale-[0.98]"
      >
        <GoogleIcon />
        <span className="font-semibold text-gray-700 text-sm">
          Continue with Google
        </span>
      </button>

      {/* Sign Up Link */}
      <p className="mt-10 text-sm text-gray-500">
        New to LXX?{" "}
        <Link
          href="/signup"
          className="text-navy font-semibold hover:text-gold transition-colors"
        >
          Start your journey
        </Link>
      </p>

      {/* Footer */}
      <footer className="mt-auto pt-12 text-center">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em]">
          LXX Bible Study
        </p>
      </footer>
    </div>
  );
}
