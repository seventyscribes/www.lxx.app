
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

export interface UserProgress {
  completedDayIds: number[];
  notes: Record<number, string>;
  reflectionAnswers: Record<number, Record<number, string>>; // dayId -> { promptIndex: answer }
  currentDay: number;
  settings: {
    fontSize: 'sm' | 'base' | 'lg' | 'xl';
    fontFamily: 'serif' | 'sans';
    showSummaries: boolean;
  };
}
