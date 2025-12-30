"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { UserProgress, UserSettings, DEFAULT_USER_PROGRESS } from "./types";

interface ProgressContextType {
  progress: UserProgress;
  isLoading: boolean;
  updateProgress: (updates: Partial<UserProgress>) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  setCurrentDay: (day: number) => void;
  markDayComplete: (dayId: number) => void;
  saveReflection: (dayId: number, promptIdx: number, text: string) => void;
  saveNotes: (dayId: number, text: string) => void;
  refreshProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_USER_PROGRESS);
  const [isLoading, setIsLoading] = useState(true);
  const progressRef = useRef(progress);

  // Keep ref in sync with state
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Fetch initial progress from API
  const refreshProgress = useCallback(async () => {
    try {
      const [progressRes, settingsRes] = await Promise.all([
        fetch("/api/progress"),
        fetch("/api/settings"),
      ]);

      if (progressRes.ok && settingsRes.ok) {
        const progressData = await progressRes.json();
        const settingsData = await settingsRes.json();

        setProgress({
          currentDay: progressData.currentDay,
          completedDayIds: progressData.completedDayIds,
          notes: progressData.notes || {},
          reflectionAnswers: progressData.reflectionAnswers || {},
          settings: {
            fontSize: settingsData.fontSize as UserSettings["fontSize"],
            fontFamily: settingsData.fontFamily as UserSettings["fontFamily"],
            showSummaries: settingsData.showSummaries,
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  const updateProgress = useCallback((updates: Partial<UserProgress>) => {
    setProgress((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateSettings = useCallback(async (settings: Partial<UserSettings>) => {
    // Optimistic update
    setProgress((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));

    // Sync to API
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }, []);

  const setCurrentDay = useCallback(async (day: number) => {
    // Optimistic update
    setProgress((prev) => ({ ...prev, currentDay: day }));

    // Sync to API
    try {
      await fetch("/api/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentDay: day }),
      });
    } catch (error) {
      console.error("Failed to update current day:", error);
    }
  }, []);

  const markDayComplete = useCallback(async (dayId: number) => {
    // Optimistic update
    setProgress((prev) => {
      if (prev.completedDayIds.includes(dayId)) return prev;
      return {
        ...prev,
        completedDayIds: [...prev.completedDayIds, dayId],
      };
    });

    // Sync to API
    try {
      const res = await fetch("/api/progress/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayNumber: dayId }),
      });

      if (res.ok) {
        const data = await res.json();
        setProgress((prev) => ({
          ...prev,
          completedDayIds: data.completedDayIds,
          currentDay: data.currentDay,
        }));
      }
    } catch (error) {
      console.error("Failed to mark day complete:", error);
    }
  }, []);

  const saveReflection = useCallback(
    async (dayId: number, promptIdx: number, text: string) => {
      // Optimistic update
      setProgress((prev) => {
        const existingAnswers = prev.reflectionAnswers[dayId] || {};
        return {
          ...prev,
          reflectionAnswers: {
            ...prev.reflectionAnswers,
            [dayId]: {
              ...existingAnswers,
              [promptIdx]: text,
            },
          },
        };
      });

      // Sync to API
      try {
        // Use ref to get current state
        const currentAnswers = progressRef.current.reflectionAnswers[dayId] || {};
        const updatedAnswers = { ...currentAnswers, [promptIdx]: text };

        await fetch(`/api/journal/${dayId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reflectionAnswers: updatedAnswers }),
        });
      } catch (error) {
        console.error("Failed to save reflection:", error);
      }
    },
    []
  );

  const saveNotes = useCallback(async (dayId: number, text: string) => {
    // Optimistic update
    setProgress((prev) => ({
      ...prev,
      notes: { ...prev.notes, [dayId]: text },
    }));

    // Sync to API
    try {
      await fetch(`/api/journal/${dayId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        isLoading,
        updateProgress,
        updateSettings,
        setCurrentDay,
        markDayComplete,
        saveReflection,
        saveNotes,
        refreshProgress,
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
