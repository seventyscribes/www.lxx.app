"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-navy text-white shadow-xl hover:shadow-gold/10 rounded-[28px]",
    secondary:
      "bg-white text-navy border border-gray-100 shadow-paper hover:border-gold/30 rounded-[28px]",
    outline:
      "bg-transparent text-navy border-2 border-navy hover:bg-navy hover:text-white rounded-[28px]",
  };

  const sizes = {
    sm: "px-6 py-3 text-[10px]",
    md: "px-10 py-4 text-[11px]",
    lg: "w-full py-6 text-[12px]",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
