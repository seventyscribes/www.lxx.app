"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-[10px] font-bold text-navy/60 uppercase tracking-[0.2em] mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-parchment/40 border border-gray-100/80 rounded-2xl px-4 py-3",
            "text-[14px] font-sans text-charcoal placeholder:text-gray-300",
            "focus:outline-none focus:ring-4 focus:ring-gold/5 focus:border-gold/30",
            "transition-all",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-[10px] font-bold text-navy/60 uppercase tracking-[0.2em] mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full min-h-[100px] bg-parchment/40 border border-gray-100/80 rounded-2xl p-4",
            "text-[14px] font-sans text-charcoal placeholder:text-gray-300",
            "focus:outline-none focus:ring-4 focus:ring-gold/5 focus:border-gold/30",
            "transition-all resize-none leading-relaxed",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
