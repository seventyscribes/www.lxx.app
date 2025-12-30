
import React from 'react';
import { ICONS } from '../constants';

interface HeaderProps {
  label: string;
  title: string;
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ label, title, onPrev, onNext, prevDisabled, nextDisabled }) => {
  return (
    <header className="sticky top-0 z-30 bg-parchment/90 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between">
      <button 
        onClick={onPrev} 
        disabled={prevDisabled}
        className={`p-2 -ml-2 rounded-full transition-colors ${prevDisabled ? 'opacity-20' : 'active:bg-gray-100'}`}
      >
        <ICONS.ChevronLeft />
      </button>
      
      <div className="flex flex-col items-center text-center">
        <span className="text-[10px] uppercase tracking-widest text-gold font-bold mb-0.5">{label}</span>
        <h1 className="text-lg font-serif font-semibold text-navy leading-tight">{title}</h1>
      </div>

      <button 
        onClick={onNext} 
        disabled={nextDisabled}
        className={`p-2 -mr-2 rounded-full transition-colors ${nextDisabled ? 'opacity-20' : 'active:bg-gray-100'}`}
      >
        <ICONS.ChevronRight />
      </button>
    </header>
  );
};
