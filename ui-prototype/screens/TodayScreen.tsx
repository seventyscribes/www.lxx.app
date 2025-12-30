import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { StudyCard } from '../components/StudyCard';
import { MOCK_DAYS, ICONS } from '../constants';
import { DayStudy, UserProgress } from '../types';

interface TodayScreenProps {
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
}

/**
 * Sub-component for individual reflection inputs to avoid Hook violations
 * and minimize re-renders of the entire Today screen.
 */
const ReflectionField: React.FC<{
  prompt: string;
  index: number;
  initialValue: string;
  onSave: (val: string) => void;
  isSaving: boolean;
}> = ({ prompt, index, initialValue, onSave, isSaving }) => {
  const [localValue, setLocalValue] = useState(initialValue);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  const handleChange = (val: string) => {
    setLocalValue(val);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => onSave(val), 800);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-4 items-start">
        <div className="w-6 h-6 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-gold/60">
          {index + 1}
        </div>
        <p className="text-[14px] text-charcoal/80 font-semibold leading-relaxed font-sans">{prompt}</p>
      </div>
      <textarea
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Write your reflection here..."
        className="w-full min-h-[100px] bg-parchment/40 border border-gray-100/80 rounded-2xl p-4 text-[14px] font-sans focus:outline-none focus:ring-4 focus:ring-gold/5 transition-all resize-none placeholder:text-gray-300 text-charcoal"
      />
    </div>
  );
};

export const TodayScreen: React.FC<TodayScreenProps> = ({ progress, setProgress }) => {
  const currentDayId = progress.currentDay || 1;
  const [dayData, setDayData] = useState<DayStudy | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [localNotes, setLocalNotes] = useState('');
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const found = MOCK_DAYS.find(d => d.id === currentDayId);
    setDayData(found || null);
    setLocalNotes(progress.notes[currentDayId] || '');
  }, [currentDayId]);

  const handleReflectionSave = (promptIdx: number, text: string) => {
    setIsSaving(true);
    setProgress(prev => ({
      ...prev,
      reflectionAnswers: {
        ...prev,
        reflectionAnswers: {
          ...prev.reflectionAnswers,
          [currentDayId]: {
            ...(prev.reflectionAnswers[currentDayId] || {}),
            [promptIdx]: text
          }
        }
      }
    } as UserProgress));
    // Simulated short delay for "Saving..." UI feel
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleNoteChange = (text: string) => {
    setLocalNotes(text);
    setIsSaving(true);
    if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = window.setTimeout(() => {
      setProgress(prev => ({
        ...prev,
        notes: { ...prev.notes, [currentDayId]: text }
      }));
      setIsSaving(false);
    }, 1000);
  };

  const markComplete = () => {
    if (!progress.completedDayIds.includes(currentDayId)) {
      setProgress(prev => ({
        ...prev,
        completedDayIds: [...prev.completedDayIds, currentDayId]
      }));
    }
  };

  const isCompleted = progress.completedDayIds.includes(currentDayId);

  // Reading Mode Overlay
  if (isReadingMode && dayData) {
    const fontSizeClasses = { sm: 'text-sm', base: 'text-[17px]', lg: 'text-xl', xl: 'text-2xl' };
    return (
      <div className="fixed inset-0 z-[100] bg-parchment overflow-y-auto animate-in fade-in duration-700">
        <button 
          onClick={() => setIsReadingMode(false)}
          className="fixed top-8 right-8 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-navy z-[110] active:scale-90 transition-transform border border-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <div className="max-w-prose mx-auto px-8 pt-24 pb-40">
          <div className="text-center mb-16">
            <span className="text-[10px] text-gold uppercase tracking-[0.4em] font-black block mb-4 opacity-60">Immersive Reading</span>
            <h2 className="text-4xl font-serif font-bold text-navy leading-tight">{dayData.passageRange}</h2>
            <div className="w-8 h-px bg-gold/30 mx-auto mt-6" />
          </div>
          <div className={`space-y-16 selection:bg-gold/20 leading-relaxed text-charcoal/90 ${progress.settings.fontFamily === 'serif' ? 'font-serif' : 'font-sans'} ${fontSizeClasses[progress.settings.fontSize]}`}>
            {dayData.chapters.map((ch, idx) => (
              <div key={idx}>
                <h3 className="text-gold italic text-xl mb-10 text-center font-serif">{ch.chapter}</h3>
                <div className="space-y-8">
                  {ch.verses.map(v => (
                    <p key={v.number} className="relative pl-10 md:pl-12">
                      <span className="absolute left-0 top-1 text-[11px] font-sans font-black text-gold/40 select-none">{v.number}</span>
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

  return (
    <div className="bg-parchment min-h-screen">
      <Header 
        label={isCompleted ? "Past Study" : "Today's Study"} 
        title={`Day ${currentDayId} — ${dayData?.title || 'Scripture'}`}
        onPrev={() => setProgress(p => ({ ...p, currentDay: Math.max(1, p.currentDay - 1) }))}
        onNext={() => setProgress(p => ({ ...p, currentDay: Math.min(365, p.currentDay + 1) }))}
        prevDisabled={currentDayId <= 1}
        nextDisabled={currentDayId >= 365}
      />

      <main className="px-6 py-10 pb-40 max-w-2xl mx-auto">
        {dayData ? (
          <>
            {/* Scripture & Context Box Combined */}
            <StudyCard 
              title="Today's Reading (KJV)" 
              helperText={dayData.passageRange}
            >
              <div className="space-y-6">
                {/* Modern Explanation Box (Context) */}
                {progress.settings.showSummaries && (
                  <div className="bg-navy/[0.03] border-l-2 border-gold/40 p-5 rounded-r-2xl mb-6 shadow-sm">
                    <h4 className="text-[9px] font-black text-gold uppercase tracking-[0.3em] mb-3">Today's Guidance</h4>
                    <p className="font-sans text-[14px] leading-relaxed text-charcoal/80 italic">
                      {dayData.summary}
                    </p>
                  </div>
                )}

                {/* Scripture Preview Block */}
                <div className="relative group overflow-hidden rounded-2xl border border-gray-100/50 p-6 bg-parchment/30">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/95 z-10" />
                  <div className="space-y-5 max-h-[160px] opacity-60 pointer-events-none select-none">
                    {dayData.chapters[0]?.verses.slice(0, 4).map(v => (
                      <p key={v.number} className="font-serif text-[15px] leading-relaxed">
                        <span className="font-sans text-[10px] font-bold text-gold/60 mr-3">{v.number}</span>
                        {v.text}
                      </p>
                    ))}
                  </div>
                  <div className="absolute inset-x-0 bottom-6 flex justify-center z-20">
                    <button 
                      onClick={() => setIsReadingMode(true)}
                      className="bg-white px-10 py-3.5 rounded-full border border-gold/20 shadow-lg text-[11px] font-bold uppercase tracking-[0.25em] text-navy active:scale-95 transition-all flex items-center gap-3 hover:border-gold/50"
                    >
                      <ICONS.Book />
                      Read Scripture
                    </button>
                  </div>
                </div>
              </div>
            </StudyCard>

            {/* Reflection Questions Card */}
            <StudyCard 
              title="Reflection" 
              helperText="Guided response within your study"
            >
              <div className="space-y-10">
                {dayData.reflectionPrompts.map((prompt, idx) => (
                  <ReflectionField
                    key={`${currentDayId}-${idx}`}
                    index={idx}
                    prompt={prompt}
                    initialValue={(progress.reflectionAnswers[currentDayId] || {})[idx] || ''}
                    onSave={(val) => handleReflectionSave(idx, val)}
                    isSaving={isSaving}
                  />
                ))}

                {/* Additional Sacred Space for Notes */}
                <div className="pt-8 border-t border-gray-100/50">
                  <h4 className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <div className="w-1 h-1 bg-gold/40 rounded-full" />
                    Additional Notes
                  </h4>
                  <textarea
                    value={localNotes}
                    onChange={(e) => handleNoteChange(e.target.value)}
                    placeholder="Any further quiet reflections..."
                    className="w-full min-h-[140px] bg-parchment/40 border border-gray-100/80 rounded-2xl p-4 text-[14px] font-sans focus:outline-none focus:ring-4 focus:ring-gold/5 transition-all resize-none placeholder:text-gray-300 text-charcoal leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 px-2">
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isSaving ? 'bg-gold animate-pulse' : 'bg-gold opacity-30'}`} />
                  <span className={`text-[9px] uppercase tracking-[0.2em] font-black transition-all ${isSaving ? 'text-gold' : 'text-gray-300'}`}>
                    {isSaving ? 'Preserving' : 'Preserved'}
                  </span>
                </div>
              </div>
            </StudyCard>

            {/* Completion Trigger */}
            <div className="mt-16 text-center">
              {!isCompleted ? (
                <button 
                  onClick={markComplete}
                  className="w-full bg-navy text-white py-6 rounded-[28px] font-bold shadow-xl active:scale-[0.97] transition-all flex items-center justify-center gap-4 hover:shadow-gold/10 group overflow-hidden relative"
                >
                  <div className="bg-gold/20 p-1 rounded-full group-hover:rotate-12 transition-transform">
                    <ICONS.Check />
                  </div>
                  <span className="tracking-widest uppercase text-[12px]">Conclude Day {currentDayId}</span>
                </button>
              ) : (
                <div className="py-12 px-10 bg-white border border-gray-100 rounded-[40px] flex flex-col items-center gap-4 shadow-paper transition-all animate-in zoom-in-95 duration-700">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-2 relative">
                    <div className="absolute inset-0 bg-gold/20 rounded-full animate-ping opacity-20" />
                    <ICONS.Check />
                  </div>
                  <h3 className="text-navy font-serif text-2xl font-bold">Journey Updated</h3>
                  <div className="h-px w-10 bg-gold/30" />
                  <p className="text-[14px] text-gray-400 font-sans italic max-w-[200px]">"Precept upon precept, line upon line."</p>
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
      </main>
    </div>
  );
};
