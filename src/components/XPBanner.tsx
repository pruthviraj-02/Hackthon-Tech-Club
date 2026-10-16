import React from 'react';
import { Award, Zap, Flame, ShieldAlert } from 'lucide-react';
import { calculateLevel, XP_PER_LEVEL } from '../utils/storage';

interface XPBannerProps {
  xp: number;
  streak: number;
  sessionsToday: number;
}

export const XPBanner: React.FC<XPBannerProps> = ({ xp, streak, sessionsToday }) => {
  const { level, currentLevelXp, nextLevelXp, progressPercent } = calculateLevel(xp);
  const xpNeeded = nextLevelXp - currentLevelXp;

  return (
    <div className="bg-[#FFE066] border-[3px] border-[#111111] shadow-brutal p-4 sm:p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Level & Title */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white border-[3px] border-[#111111] shadow-brutal-sm flex flex-col items-center justify-center font-heading font-black text-[#111111] shrink-0">
            <span className="text-[10px] uppercase tracking-wider leading-none text-[#111111]/70">Level</span>
            <span className="text-2xl leading-none font-black">{level}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-black text-lg sm:text-xl text-[#111111]">
                {level >= 5 ? 'Scholar Titan' : level >= 3 ? 'Deep Work Master' : 'Focus Apprentice'}
              </h2>
              <span className="px-2 py-0.5 bg-[#111111] text-white text-[10px] font-black uppercase tracking-wider">
                Rank {level}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#111111]/80 mt-0.5">
              <span className="font-mono-nums font-black">{xp}</span> Total XP Earned · <span className="font-mono-nums font-black">{xpNeeded} XP</span> to Level {level + 1}
            </p>
          </div>
        </div>

        {/* Right: Streak & Daily summary pill */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-brutal-sm shadow-brutal-sm text-xs font-bold text-[#111111]">
            <Flame className="w-4 h-4 text-[#FF6B6B] fill-[#FF6B6B]" />
            <span>{streak} Day Streak</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4ECDC4] border-brutal-sm shadow-brutal-sm text-xs font-bold text-[#111111]">
            <Zap className="w-4 h-4 stroke-[2.5]" />
            <span>{sessionsToday} Sessions Today</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="mt-4 pt-3 border-t-2 border-[#111111]">
        <div className="flex items-center justify-between text-xs font-black text-[#111111] mb-1.5">
          <span className="uppercase tracking-wider">XP Level Progress</span>
          <span className="font-mono-nums">{currentLevelXp} / {nextLevelXp} XP ({progressPercent}%)</span>
        </div>
        <div className="w-full h-5 bg-white border-[3px] border-[#111111] shadow-brutal-sm overflow-hidden p-[2px]">
          <div
            className="h-full bg-[#FF6B6B] border-r-2 border-[#111111] transition-all duration-300 ease-out"
            style={{ width: `${Math.max(4, progressPercent)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
