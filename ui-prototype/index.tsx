
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { TodayScreen } from './screens/TodayScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { AccountScreen } from './screens/AccountScreen';
import { UserProgress } from './types';
import { ICONS } from './constants';

const App = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'progress' | 'account'>('today');
  const [progress, setProgress] = useState<UserProgress>({
    completedDayIds: [],
    notes: {},
    reflectionAnswers: {},
    currentDay: 1,
    settings: {
      fontSize: 'base',
      fontFamily: 'serif',
      showSummaries: true
    }
  });

  const renderScreen = () => {
    switch (activeTab) {
      case 'today':
        return <TodayScreen progress={progress} setProgress={setProgress} />;
      case 'progress':
        return <ProgressScreen progress={progress} setProgress={setProgress} />;
      case 'account':
        return <AccountScreen progress={progress} setProgress={setProgress} />;
      default:
        return <TodayScreen progress={progress} setProgress={setProgress} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-parchment overflow-x-hidden">
      <div className="flex-grow pb-24">
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 flex items-center justify-around h-20 px-6 pb-safe safe-area-inset-bottom z-50">
        <button 
          onClick={() => setActiveTab('today')}
          className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300 ${activeTab === 'today' ? 'text-gold scale-110' : 'text-gray-400 opacity-60'}`}
        >
          <ICONS.Book />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Today</span>
        </button>

        <button 
          onClick={() => setActiveTab('progress')}
          className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300 ${activeTab === 'progress' ? 'text-gold scale-110' : 'text-gray-400 opacity-60'}`}
        >
          <ICONS.Path />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Progress</span>
        </button>

        <button 
          onClick={() => setActiveTab('account')}
          className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300 ${activeTab === 'account' ? 'text-gold scale-110' : 'text-gray-400 opacity-60'}`}
        >
          <ICONS.User />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Settings</span>
        </button>
      </nav>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
