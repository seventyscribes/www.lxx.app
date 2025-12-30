"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  title?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({
  title,
  helperText,
  children,
  className,
  onClick,
}: CardProps) {
  return (
    <div className="relative mb-8 group">
      {/* Decorative 'stacked paper' background layer */}
      <div className="absolute inset-0 bg-white border border-gray-100 rounded-[28px] translate-y-1.5 translate-x-1 opacity-40 group-hover:translate-y-2 transition-transform duration-500" />

      {/* Main card content */}
      <div
        onClick={onClick}
        className={cn(
          "relative bg-white border border-gray-100 rounded-[28px] shadow-paper p-8",
          "transition-all duration-300 active:scale-[0.99] active:shadow-sm",
          onClick && "cursor-pointer hover:border-gold/30",
          className
        )}
      >
        {(title || helperText) && (
          <div className="mb-6 flex justify-between items-start">
            <div className="max-w-[85%]">
              {title && (
                <h3 className="text-navy text-[10px] font-bold tracking-[0.25em] uppercase font-sans mb-2 opacity-60">
                  {title}
                </h3>
              )}
              {helperText && (
                <p className="text-gray-400 text-xs italic font-serif leading-relaxed">
                  {helperText}
                </p>
              )}
            </div>
            {onClick && (
              <div className="text-gold opacity-20 group-hover:opacity-60 transition-opacity">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
              </div>
            )}
          </div>
        )}
        <div className="text-charcoal selection:bg-gold/10">{children}</div>
      </div>
    </div>
  );
}
