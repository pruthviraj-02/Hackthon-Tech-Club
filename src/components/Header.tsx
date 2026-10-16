import React from 'react';
import { Flame, RotateCcw, Target, ShieldCheck, Wind, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  streak: number;
  level: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenBreathe: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streak,
  level,
  darkMode,
  onToggleDarkMode,
  onOpenBreathe,
  onResetData,
}) => {
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="border-b-[3px] border-[#111111] bg-[#FFFDF5] sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#FFE066] border-[3px] border-[#111111] shadow-brutal-sm flex items-center justify-center font-black text-xl text-[#111111]">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#111111]">
                FOCUSFORGE
              </span>
              <span className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#111111] text-[#FFE066]">
                STUDENT FOCUS HUB
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#111111]/70 -mt-0.5 hidden sm:inline">
              Lock in. Level up. Forge your degree.
            </span>
          </div>
        </div>

        {/* Center Date indicator (Desktop) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-white border-brutal-sm shadow-brutal-sm text-xs font-bold text-[#111111]">
          <span>{todayFormatted}</span>
          <span>·</span>
          <span>Academic Sprint Active</span>
        </div>

        {/* Right Badges & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Breathe Mode Button */}
          <button
            type="button"
            onClick={onOpenBreathe}
            title="Open 4-4-6 Resonant Breathing Mode"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#4ECDC4] hover:bg-[#4ECDC4] border-brutal-sm shadow-brutal-sm text-xs font-black text-[#111111] transition-transform active:scale-95 cursor-pointer"
          >
            <Wind className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Breathe</span>
          </button>

          {/* Level Badge */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#FFE066] border-brutal-sm shadow-brutal-sm text-xs font-black text-[#111111]">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            <span>LVL {level}</span>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#FF6B6B] border-brutal-sm shadow-brutal-sm text-xs font-black text-[#111111]">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] fill-white text-white" />
            <span className="hidden xs:inline">{streak}D STREAK</span>
            <span className="xs:hidden">{streak}D</span>
          </div>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-1.5 sm:p-2 bg-white hover:bg-[#FFE066] border-brutal-sm shadow-brutal-sm text-[#111111] transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 stroke-[2.5]" /> : <Moon className="w-4 h-4 stroke-[2.5]" />}
          </button>

          {/* Reset Demo button */}
          <button
            type="button"
            onClick={onResetData}
            title="Reset to sample student data"
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-white hover:bg-slate-100 border-brutal-sm shadow-brutal-sm text-xs font-bold text-[#111111] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
