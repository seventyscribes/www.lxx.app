import React from 'react';
import { UserProgress } from '../types';
import { ICONS, MOCK_DAYS } from '../constants';

interface ProgressScreenProps {
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ progress, setProgress }) => {
  const totalDays = 365;
  const completedCount = progress.completedDayIds.length;
  const percentage = (completedCount / totalDays) * 100;

  // Group days into months/milestones for a cleaner look
  const currentSection = Math.floor(progress.currentDay / 30);

  return (
    <div className="bg-parchment min-h-screen p-6 pb-24 max-w-2xl mx-auto">
      <header className="mb-10 mt-6 text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold font-bold block mb-2">The Long Path</span>
        <h2 className="text-3xl font-serif font-bold text-navy">Your Progress</h2>
        <p className="text-gray-400 text-sm mt-2 font-sans">Walk this path with patience.</p>
      </header>

      {/* Hero Summary Card */}
      <div className="bg-white rounded-[32px] p-8 shadow-paper border border-gray-100 mb-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 text-gold/5 transition-transform group-hover:scale-110 duration-700">
          <ICONS.Path />
        </div>
        
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-navy text-4xl font-serif font-bold">{completedCount}</h3>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mt-1 opacity-60">Days in presence</p>
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
            "Thy word is a lamp unto my feet"
          </p>
          <div className="h-px flex-grow bg-gray-50" />
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="relative pl-8">
        {/* Timeline Path Line */}
        <div className="absolute left-3 top-0 bottom-0 w-[2px] day-path-line opacity-20" />

        <div className="space-y-12">
          {/* Example Milestones */}
          {[1, 31, 61, 91].map((milestone) => {
            const isReached = progress.currentDay >= milestone;
            return (
              <div key={milestone} className="relative">
                {/* Milestone Dot */}
                <div className={`absolute -left-8 top-1.5 w-7 h-7 rounded-full border-4 border-parchment shadow-sm z-10 flex items-center justify-center transition-colors duration-500 ${isReached ? 'bg-gold' : 'bg-gray-100'}`}>
                  {isReached && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>

                <div className="ml-4">
                  <h4 className={`text-[11px] font-bold uppercase tracking-widest mb-4 ${isReached ? 'text-navy' : 'text-gray-300'}`}>
                    Day {milestone} — {milestone === 1 ? 'Foundations' : 'Continuing'}
                  </h4>
                  
                  <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: 30 }).map((_, i) => {
                      const dayId = milestone + i;
                      const isCompleted = progress.completedDayIds.includes(dayId);
                      const isCurrent = progress.currentDay === dayId;
                      const hasNotes = !!progress.notes[dayId];
                      
                      return (
                        <button
                          key={dayId}
                          onClick={() => setProgress(prev => ({ ...prev, currentDay: dayId }))}
                          className={`
                            relative aspect-square rounded-[14px] flex items-center justify-center text-[11px] font-bold border transition-all duration-300
                            ${isCompleted ? 'bg-navy border-navy text-white shadow-paper' : 
                              isCurrent ? 'bg-white border-gold text-gold ring-4 ring-gold/5 scale-105 z-20' : 
                              'bg-white border-gray-100 text-gray-300 hover:border-gray-200'}
                          `}
                        >
                          {dayId}
                          {hasNotes && !isCompleted && (
                            <div className="absolute top-1 right-1 w-1 h-1 bg-gold rounded-full" />
                          )}
                          {isCompleted && (
                            <div className="absolute -bottom-1 -right-1 bg-gold text-white rounded-full p-0.5 shadow-sm border-2 border-white scale-75">
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
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
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Final Milestone</p>
        <div className="w-12 h-12 border-2 border-dashed border-gold/40 rounded-full mx-auto flex items-center justify-center">
          <span className="text-[10px] font-black text-gold">365</span>
        </div>
      </div>
    </div>
  );
};
