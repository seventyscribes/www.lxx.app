"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  label: string;
  title: string;
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  className?: string;
}

function ChevronLeft() {
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
      <path d="m15 18-6-6 6-6" />
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

export function Header({
  label,
  title,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 bg-parchment/90 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between",
        className
      )}
    >
      <button
        onClick={onPrev}
        disabled={prevDisabled}
        className={cn(
          "p-2 -ml-2 rounded-full transition-colors",
          prevDisabled ? "opacity-20" : "active:bg-gray-100"
        )}
      >
        <ChevronLeft />
      </button>

      <div className="flex flex-col items-center text-center">
        <span className="text-[10px] uppercase tracking-widest text-gold font-bold mb-0.5">
          {label}
        </span>
        <h1 className="text-lg font-serif font-semibold text-navy leading-tight">
          {title}
        </h1>
      </div>

      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={cn(
          "p-2 -mr-2 rounded-full transition-colors",
          nextDisabled ? "opacity-20" : "active:bg-gray-100"
        )}
      >
        <ChevronRight />
      </button>
    </header>
  );
}
