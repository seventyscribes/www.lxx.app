"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header, Container } from "@/components/layout";
import { Card, Textarea, Button } from "@/components/ui";
import { ReadingMode, ReflectionField } from "@/components/study";
import { useProgress } from "@/lib/context";
import { MOCK_DAYS } from "@/lib/constants";
import { DayStudy } from "@/lib/types";

function BookIcon() {
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
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0.5-5z" />
      <path d="M6.5 17.5c-1.38 0-2.5 1.12-2.5 2.5" />
      <path d="M12 6h5" />
      <path d="M12 10h5" />
      <path d="M12 14h5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
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

export default function TodayPage() {
  const { progress, setCurrentDay, markDayComplete, saveReflection, saveNotes } =
    useProgress();
  const currentDayId = progress.currentDay || 1;
  const [dayData, setDayData] = useState<DayStudy | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [localNotes, setLocalNotes] = useState("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const found = MOCK_DAYS.find((d) => d.id === currentDayId);
    setDayData(found || null);
    setLocalNotes(progress.notes[currentDayId] || "");
  }, [currentDayId, progress.notes]);

  const handleReflectionSave = (promptIdx: number, text: string) => {
    setIsSaving(true);
    saveReflection(currentDayId, promptIdx, text);
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setLocalNotes(text);
    setIsSaving(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      saveNotes(currentDayId, text);
      setIsSaving(false);
    }, 1000);
  };

  const handleMarkComplete = () => {
    markDayComplete(currentDayId);
  };

  const isCompleted = progress.completedDayIds.includes(currentDayId);

  // Reading Mode Overlay
  if (isReadingMode && dayData) {
    return (
      <ReadingMode
        dayData={dayData}
        settings={progress.settings}
        onClose={() => setIsReadingMode(false)}
      />
    );
  }

  return (
    <div className="bg-parchment min-h-screen">
      <Header
        label={isCompleted ? "Past Study" : "Today's Study"}
        title={`Day ${currentDayId} — ${dayData?.title || "Scripture"}`}
        onPrev={() => setCurrentDay(Math.max(1, currentDayId - 1))}
        onNext={() => setCurrentDay(Math.min(365, currentDayId + 1))}
        prevDisabled={currentDayId <= 1}
        nextDisabled={currentDayId >= 365}
      />

      <Container>
        {dayData ? (
          <>
            {/* Scripture & Context Box Combined */}
            <Card
              title="Today's Reading (KJV)"
              helperText={dayData.passageRange}
            >
              <div className="space-y-6">
                {/* Modern Explanation Box (Context) */}
                {progress.settings.showSummaries && (
                  <div className="bg-navy/[0.03] border-l-2 border-gold/40 p-5 rounded-r-2xl mb-6 shadow-sm">
                    <h4 className="text-[9px] font-black text-gold uppercase tracking-[0.3em] mb-3">
                      Today&apos;s Guidance
                    </h4>
                    <p className="font-sans text-[14px] leading-relaxed text-charcoal/80 italic">
                      {dayData.summary}
                    </p>
                  </div>
                )}

                {/* Scripture Preview Block */}
                <div className="relative group overflow-hidden rounded-2xl border border-gray-100/50 p-6 bg-parchment/30">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/95 z-10" />
                  <div className="space-y-5 max-h-[160px] opacity-60 pointer-events-none select-none">
                    {dayData.chapters[0]?.verses.slice(0, 4).map((v) => (
                      <p key={v.number} className="font-serif text-[15px] leading-relaxed">
                        <span className="font-sans text-[10px] font-bold text-gold/60 mr-3">
                          {v.number}
                        </span>
                        {v.text}
                      </p>
                    ))}
                  </div>
                  <div className="absolute inset-x-0 bottom-6 flex justify-center z-20">
                    <button
                      onClick={() => setIsReadingMode(true)}
                      className="bg-white px-10 py-3.5 rounded-full border border-gold/20 shadow-lg text-[11px] font-bold uppercase tracking-[0.25em] text-navy active:scale-95 transition-all flex items-center gap-3 hover:border-gold/50"
                    >
                      <BookIcon />
                      Read Scripture
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Reflection Questions Card */}
            <Card title="Reflection" helperText="Guided response within your study">
              <div className="space-y-10">
                {dayData.reflectionPrompts.map((prompt, idx) => (
                  <ReflectionField
                    key={`${currentDayId}-${idx}`}
                    index={idx}
                    prompt={prompt}
                    initialValue={
                      (progress.reflectionAnswers[currentDayId] || {})[idx] || ""
                    }
                    onSave={(val) => handleReflectionSave(idx, val)}
                  />
                ))}

                {/* Additional Sacred Space for Notes */}
                <div className="pt-8 border-t border-gray-100/50">
                  <h4 className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <div className="w-1 h-1 bg-gold/40 rounded-full" />
                    Additional Notes
                  </h4>
                  <Textarea
                    value={localNotes}
                    onChange={handleNoteChange}
                    placeholder="Any further quiet reflections..."
                    className="min-h-[140px]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 px-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                      isSaving ? "bg-gold animate-pulse" : "bg-gold opacity-30"
                    }`}
                  />
                  <span
                    className={`text-[9px] uppercase tracking-[0.2em] font-black transition-all ${
                      isSaving ? "text-gold" : "text-gray-300"
                    }`}
                  >
                    {isSaving ? "Preserving" : "Preserved"}
                  </span>
                </div>
              </div>
            </Card>

            {/* Completion Trigger */}
            <div className="mt-16 text-center">
              {!isCompleted ? (
                <Button size="lg" onClick={handleMarkComplete}>
                  <div className="bg-gold/20 p-1 rounded-full group-hover:rotate-12 transition-transform mr-4">
                    <CheckIcon />
                  </div>
                  <span>Conclude Day {currentDayId}</span>
                </Button>
              ) : (
                <div className="py-12 px-10 bg-white border border-gray-100 rounded-[40px] flex flex-col items-center gap-4 shadow-paper transition-all animate-in zoom-in-95 duration-700">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-2 relative">
                    <div className="absolute inset-0 bg-gold/20 rounded-full animate-ping opacity-20" />
                    <CheckIcon />
                  </div>
                  <h3 className="text-navy font-serif text-2xl font-bold">
                    Journey Updated
                  </h3>
                  <div className="h-px w-10 bg-gold/30" />
                  <p className="text-[14px] text-gray-400 font-sans italic max-w-[200px]">
                    &quot;Precept upon precept, line upon line.&quot;
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-8 py-10">
            <div className="h-64 bg-gray-50 rounded-[28px] animate-pulse" />
            <div className="h-48 bg-gray-50 rounded-[28px] animate-pulse" />
          </div>
        )}
      </Container>
    </div>
  );
}
