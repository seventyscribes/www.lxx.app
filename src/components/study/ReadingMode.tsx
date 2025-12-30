"use client";

import React from "react";
import { DayStudy, UserSettings } from "@/lib/types";
import { FONT_SIZE_CLASSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ReadingModeProps {
  dayData: DayStudy;
  settings: UserSettings;
  onClose: () => void;
}

function CloseIcon() {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function ReadingMode({ dayData, settings, onClose }: ReadingModeProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-parchment overflow-y-auto animate-in fade-in duration-700">
      <button
        onClick={onClose}
        className="fixed top-8 right-8 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-navy z-[110] active:scale-90 transition-transform border border-gray-100"
        aria-label="Close reading mode"
      >
        <CloseIcon />
      </button>

      <div className="max-w-prose mx-auto px-8 pt-24 pb-40">
        <div className="text-center mb-16">
          <span className="text-[10px] text-gold uppercase tracking-[0.4em] font-black block mb-4 opacity-60">
            Immersive Reading
          </span>
          <h2 className="text-4xl font-serif font-bold text-navy leading-tight">
            {dayData.passageRange}
          </h2>
          <div className="w-8 h-px bg-gold/30 mx-auto mt-6" />
        </div>

        <div
          className={cn(
            "space-y-16 selection:bg-gold/20 leading-relaxed text-charcoal/90",
            settings.fontFamily === "serif" ? "font-serif" : "font-sans",
            FONT_SIZE_CLASSES[settings.fontSize]
          )}
        >
          {dayData.chapters.map((ch, idx) => (
            <div key={idx}>
              <h3 className="text-gold italic text-xl mb-10 text-center font-serif">
                {ch.chapter}
              </h3>
              <div className="space-y-8">
                {ch.verses.map((v) => (
                  <p key={v.number} className="relative pl-10 md:pl-12">
                    <span className="absolute left-0 top-1 text-[11px] font-sans font-black text-gold/40 select-none">
                      {v.number}
                    </span>
                    {v.text}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
