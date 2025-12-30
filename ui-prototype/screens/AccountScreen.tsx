import React from 'react';
import { UserProgress } from '../types';
import { ICONS } from '../constants';

interface AccountScreenProps {
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ progress, setProgress }) => {
  const toggleSetting = (key: keyof UserProgress['settings']) => {
    if (typeof progress.settings[key] === 'boolean') {
      setProgress(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [key]: !prev.settings[key]
        }
      }));
    }
  };

  const updateFontSize = (size: 'sm' | 'base' | 'lg' | 'xl') => {
    setProgress(prev => ({
      ...prev,
      settings: { ...prev.settings, fontSize: size }
    }));
  };

  const updateFontFamily = (family: 'serif' | 'sans') => {
    setProgress(prev => ({
      ...prev,
      settings: { ...prev.settings, fontFamily: family }
    }));
  };

  return (
    <div className="bg-parchment min-h-screen p-6 pb-24 max-w-2xl mx-auto">
      <header className="mb-10 mt-6 text-center">
        <div className="w-20 h-20 bg-navy rounded-[28px] flex items-center justify-center text-gold mx-auto mb-5 shadow-paper-xl border border-gold/10 relative">
          <ICONS.User />
          <div className="absolute -bottom-1 -right-1 bg-gold w-6 h-6 rounded-full border-4 border-parchment shadow-sm" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-navy">Reflective Heart</h2>
        <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] mt-2 font-bold opacity-60">Private Study Account</p>
      </header>

      <div className="space-y-8">
        {/* Subscription Status Card */}
        <div className="bg-navy text-white rounded-[32px] p-7 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full -mr-24 -mt-24 transition-transform group-hover:scale-125 duration-1000" />
          <div className="relative z-10">
            <h4 className="text-gold text-[10px] uppercase tracking-widest font-bold mb-2 opacity-80">Membership</h4>
            <p className="text-2xl font-serif font-bold">LXX Premium</p>
            <div className="h-px w-8 bg-gold/40 my-4" />
            <p className="text-sm text-gray-300 leading-relaxed opacity-70">365 days of sacred guidance.<br/>Journey active since 2025.</p>
          </div>
        </div>

        {/* Reading Preferences */}
        <section>
          <h3 className="text-navy text-[11px] uppercase tracking-widest font-bold mb-4 ml-1 opacity-50">Reading Preferences</h3>
          <div className="bg-white rounded-[28px] p-2 overflow-hidden border border-gray-100 shadow-paper">
            {/* Font Family */}
            <div className="px-5 py-5 flex items-center justify-between border-b border-gray-50">
              <span className="text-sm font-semibold text-navy">Typography Style</span>
              <div className="flex bg-parchment p-1 rounded-xl gap-1">
                <button 
                  onClick={() => updateFontFamily('serif')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-all ${progress.settings.fontFamily === 'serif' ? 'bg-white shadow-sm text-gold font-bold' : 'text-gray-400'}`}
                >
                  Serif
                </button>
                <button 
                  onClick={() => updateFontFamily('sans')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all ${progress.settings.fontFamily === 'sans' ? 'bg-white shadow-sm text-gold font-bold' : 'text-gray-400'}`}
                >
                  Sans
                </button>
              </div>
            </div>

            {/* Font Size */}
            <div className="px-5 py-5 flex items-center justify-between border-b border-gray-50">
              <span className="text-sm font-semibold text-navy">Text Size</span>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-gray-300">A</span>
                <div className="flex gap-1.5">
                  {(['sm', 'base', 'lg', 'xl'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => updateFontSize(size)}
                      className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${progress.settings.fontSize === size ? 'border-gold bg-gold/5 scale-110' : 'border-gray-100'}`}
                    >
                      <div className={`rounded-full bg-gold ${progress.settings.fontSize === size ? 'w-2 h-2' : 'w-0 h-0 opacity-0'}`} />
                    </button>
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-300">A</span>
              </div>
            </div>

            {/* Toggle Preferences */}
            <button 
              onClick={() => toggleSetting('showSummaries')}
              className="w-full px-5 py-5 flex items-center justify-between active:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <span className="text-sm font-semibold text-navy block">Modern Summaries</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Explain KJV passages</span>
              </div>
              <div className={`w-12 h-7 rounded-full relative p-1 transition-colors duration-300 ${progress.settings.showSummaries ? 'bg-gold' : 'bg-gray-200'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${progress.settings.showSummaries ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>
        </section>

        {/* Actions */}
        <section>
          <h3 className="text-navy text-[11px] uppercase tracking-widest font-bold mb-4 ml-1 opacity-50">Journey Management</h3>
          <div className="bg-white rounded-[28px] overflow-hidden border border-gray-100 shadow-paper">
            <button className="w-full px-5 py-5 border-b border-gray-50 flex items-center justify-between active:bg-gray-50 transition-colors group">
              <span className="text-sm font-semibold text-navy">Manage Subscription</span>
              <div className="text-gold transition-transform group-hover:translate-x-1"><ICONS.ChevronRight /></div>
            </button>
            <button className="w-full px-5 py-5 border-b border-gray-50 flex items-center justify-between active:bg-gray-50 transition-colors group">
              <span className="text-sm font-semibold text-navy">Export Sacred Reflections</span>
              <div className="text-gold transition-transform group-hover:translate-x-1"><ICONS.ChevronRight /></div>
            </button>
            <button className="w-full px-5 py-5 flex items-center justify-between text-red-500 active:bg-red-50 transition-colors group">
              <span className="text-sm font-bold uppercase tracking-widest text-[11px]">Sign Out</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </section>

        <footer className="pt-12 pb-16 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 opacity-20">
            <div className="w-1 h-1 bg-navy rounded-full" />
            <div className="w-1 h-1 bg-navy rounded-full" />
            <div className="w-1 h-1 bg-navy rounded-full" />
          </div>
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em]">LXX Bible Study &copy; MMXXV</p>
          <p className="text-[9px] text-gray-300 uppercase tracking-widest">Build 1.0.4-beta • Made with reverence</p>
        </footer>
      </div>
    </div>
  );
};
