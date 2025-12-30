export interface ScriptureChapter {
  chapter: string;
  verses: { number: number; text: string }[];
}

export interface DayStudy {
  id: number;
  title: string;
  passageRange: string;
  chapters: ScriptureChapter[];
  summary: string;
  reflectionPrompts: string[];
}

export interface UserSettings {
  fontSize: "sm" | "base" | "lg" | "xl";
  fontFamily: "serif" | "sans";
  showSummaries: boolean;
}

export interface UserProgress {
  completedDayIds: number[];
  notes: Record<number, string>;
  reflectionAnswers: Record<number, Record<number, string>>; // dayId -> { promptIndex: answer }
  currentDay: number;
  settings: UserSettings;
}

export const DEFAULT_USER_PROGRESS: UserProgress = {
  completedDayIds: [],
  notes: {},
  reflectionAnswers: {},
  currentDay: 1,
  settings: {
    fontSize: "base",
    fontFamily: "serif",
    showSummaries: true,
  },
};
