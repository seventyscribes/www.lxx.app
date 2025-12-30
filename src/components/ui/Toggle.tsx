"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        "w-full px-5 py-5 flex items-center justify-between active:bg-gray-50 transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="text-left">
        {label && (
          <span className="text-sm font-semibold text-navy block">{label}</span>
        )}
        {description && (
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
            {description}
          </span>
        )}
      </div>
      <div
        className={cn(
          "w-12 h-7 rounded-full relative p-1 transition-colors duration-300",
          checked ? "bg-gold" : "bg-gray-200"
        )}
      >
        <div
          className={cn(
            "w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </div>
    </button>
  );
}
