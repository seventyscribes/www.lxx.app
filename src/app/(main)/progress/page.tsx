"use client";

import React from "react";
import { useProgress } from "@/lib/context";
import { cn } from "@/lib/utils";

function PathIcon() {
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
      <path d="m20 10-8 8-4-4" />
    </svg>
  );
}

function CheckIcon({ size = 10 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const MILESTONES = [
  { day: 1, name: "Foundations" },
  { day: 31, name: "Building" },
  { day: 61, name: "Growing" },
  { day: 91, name: "Deepening" },
];

export default function ProgressPage() {
  const { progress, setCurrentDay } = useProgress();
  const totalDays = 365;
  const completedCount = progress.completedDayIds.length;
  const percentage = (completedCount / totalDays) * 100;

  return (
    <div className="bg-parchment min-h-screen p-6 pb-24 max-w-2xl mx-auto">
      <header className="mb-10 mt-6 text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold font-bold block mb-2">
          The Long Path
        </span>
        <h2 className="text-3xl font-serif font-bold text-navy">Your Progress</h2>
        <p className="text-gray-400 text-sm mt-2 font-sans">
          Walk this path with patience.
        </p>
      </header>

      {/* Hero Summary Card */}
      <div className="bg-white rounded-[32px] p-8 shadow-paper border border-gray-100 mb-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 text-gold/5 transition-transform group-hover:scale-110 duration-700">
          <PathIcon />
        </div>

        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-navy text-4xl font-serif font-bold">
              {completedCount}
            </h3>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mt-1 opacity-60">
              Days in presence
            </p>
          </div>
          <div className="text-gold font-sans font-black text-lg bg-gold/10 px-3 py-1 rounded-full">
            {Math.round(percentage)}%
          </div>
        </div>

        {/* Modern Progress Bar */}
        <div className="h-2 w-full bg-parchment rounded-full overflow-hidden shadow-inner border border-gray-50">
          <div
            className="h-full bg-gold transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(197,160,89,0.3)]"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="h-px flex-grow bg-gray-50" />
          <p className="text-[13px] text-gray-500 font-serif italic text-center whitespace-nowrap">
            &quot;Thy word is a lamp unto my feet&quot;
          </p>
          <div className="h-px flex-grow bg-gray-50" />
        </div>
      </div>

      {/* Streak Indicator */}
      {completedCount > 0 && (
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="bg-white rounded-full px-5 py-2.5 shadow-paper border border-gray-100 flex items-center gap-2.5">
            <span className="text-2xl">🔥</span>
            <span className="text-[11px] font-bold text-navy uppercase tracking-wider">
              {completedCount} Day{completedCount > 1 ? "s" : ""} Complete
            </span>
          </div>
        </div>
      )}

      {/* Journey Timeline */}
      <div className="relative pl-8">
        {/* Timeline Path Line */}
        <div className="absolute left-3 top-0 bottom-0 w-[2px] day-path-line opacity-20" />

        <div className="space-y-12">
          {MILESTONES.map((milestone) => {
            const isReached = progress.currentDay >= milestone.day;
            return (
              <div key={milestone.day} className="relative">
                {/* Milestone Dot */}
                <div
                  className={cn(
                    "absolute -left-8 top-1.5 w-7 h-7 rounded-full border-4 border-parchment shadow-sm z-10 flex items-center justify-center transition-colors duration-500",
                    isReached ? "bg-gold" : "bg-gray-100"
                  )}
                >
                  {isReached && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>

                <div className="ml-4">
                  <h4
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-widest mb-4",
                      isReached ? "text-navy" : "text-gray-300"
                    )}
                  >
                    Day {milestone.day} — {milestone.name}
                  </h4>

                  <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: 30 }).map((_, i) => {
                      const dayId = milestone.day + i;
                      if (dayId > 365) return null;
                      const isCompleted =
                        progress.completedDayIds.includes(dayId);
                      const isCurrent = progress.currentDay === dayId;
                      const hasNotes = !!progress.notes[dayId];

                      return (
                        <button
                          key={dayId}
                          onClick={() => setCurrentDay(dayId)}
                          className={cn(
                            "relative aspect-square rounded-[14px] flex items-center justify-center text-[11px] font-bold border transition-all duration-300",
                            isCompleted
                              ? "bg-navy border-navy text-white shadow-paper"
                              : isCurrent
                              ? "bg-white border-gold text-gold ring-4 ring-gold/5 scale-105 z-20"
                              : "bg-white border-gray-100 text-gray-300 hover:border-gray-200"
                          )}
                        >
                          {dayId}
                          {hasNotes && !isCompleted && (
                            <div className="absolute top-1 right-1 w-1 h-1 bg-gold rounded-full" />
                          )}
                          {isCompleted && (
                            <div className="absolute -bottom-1 -right-1 bg-gold text-white rounded-full p-0.5 shadow-sm border-2 border-white scale-75">
                              <CheckIcon size={10} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-16 text-center opacity-30">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4">
          Final Milestone
        </p>
        <div className="w-12 h-12 border-2 border-dashed border-gold/40 rounded-full mx-auto flex items-center justify-center">
          <span className="text-[10px] font-black text-gold">365</span>
        </div>
      </div>
    </div>
  );
}
