"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { UserProgress, UserSettings, DEFAULT_USER_PROGRESS } from "./types";

interface ProgressContextType {
  progress: UserProgress;
  updateProgress: (updates: Partial<UserProgress>) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  setCurrentDay: (day: number) => void;
  markDayComplete: (dayId: number) => void;
  saveReflection: (dayId: number, promptIdx: number, text: string) => void;
  saveNotes: (dayId: number, text: string) => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_USER_PROGRESS);

  const updateProgress = useCallback((updates: Partial<UserProgress>) => {
    setProgress((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateSettings = useCallback((settings: Partial<UserSettings>) => {
    setProgress((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  }, []);

  const setCurrentDay = useCallback((day: number) => {
    setProgress((prev) => ({ ...prev, currentDay: day }));
  }, []);

  const markDayComplete = useCallback((dayId: number) => {
    setProgress((prev) => {
      if (prev.completedDayIds.includes(dayId)) return prev;
      return {
        ...prev,
        completedDayIds: [...prev.completedDayIds, dayId],
      };
    });
  }, []);

  const saveReflection = useCallback(
    (dayId: number, promptIdx: number, text: string) => {
      setProgress((prev) => ({
        ...prev,
        reflectionAnswers: {
          ...prev.reflectionAnswers,
          [dayId]: {
            ...(prev.reflectionAnswers[dayId] || {}),
            [promptIdx]: text,
          },
        },
      }));
    },
    []
  );

  const saveNotes = useCallback((dayId: number, text: string) => {
    setProgress((prev) => ({
      ...prev,
      notes: { ...prev.notes, [dayId]: text },
    }));
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        updateProgress,
        updateSettings,
        setCurrentDay,
        markDayComplete,
        saveReflection,
        saveNotes,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
