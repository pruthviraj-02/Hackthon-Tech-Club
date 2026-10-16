import React from 'react';
import { Clock, CheckCircle2, Flame, Award, Zap, BarChart2 } from 'lucide-react';
import { UserStats } from '../types';

interface StatsSectionProps {
  stats: UserStats;
  tasksCompleted: number;
  totalTasks: number;
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  stats,
  tasksCompleted,
  totalTasks,
}) => {
  const completionRate =
    totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

  return (
    <div className="bg-white border-[3px] border-[#111111] shadow-brutal p-5 sm:p-6">
      <div className="flex items-center justify-between pb-3 mb-4 border-b-[3px] border-[#111111]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF6B6B] border-2 border-[#111111] shadow-brutal-sm flex items-center justify-center font-bold">
            <BarChart2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-heading font-black text-lg text-[#111111]">
              STUDY TELEMETRY
            </h2>
            <span className="text-[11px] font-bold text-[#111111]/70">
              Verified local focus performance metrics
            </span>
          </div>
        </div>

        <span className="px-2 py-0.5 bg-[#4ECDC4] border-2 border-[#111111] text-[#111111] text-[10px] font-black uppercase shadow-brutal-sm">
          Live Stats
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Sessions Today */}
        <div className="p-4 bg-[#FFE066] border-[3px] border-[#111111] shadow-brutal-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-black uppercase text-[#111111]/80 mb-2">
            <span>Sessions Today</span>
            <Zap className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#111111] font-mono-nums">
            {stats.sessionsToday}
          </div>
          <div className="text-[11px] font-bold text-[#111111]/80 mt-1">
            {stats.totalSessionsCompleted} total lifetime
          </div>
        </div>

        {/* Metric 2: Total Focus Minutes */}
        <div className="p-4 bg-[#4ECDC4] border-[3px] border-[#111111] shadow-brutal-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-black uppercase text-[#111111]/80 mb-2">
            <span>Focus Minutes</span>
            <Clock className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#111111] font-mono-nums">
            {stats.totalFocusMinutes}m
          </div>
          <div className="text-[11px] font-bold text-[#111111]/80 mt-1">
            ~{(stats.totalFocusMinutes / 60).toFixed(1)} hours locked in
          </div>
        </div>

        {/* Metric 3: Tasks Done */}
        <div className="p-4 bg-[#FF6B6B] border-[3px] border-[#111111] shadow-brutal-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-black uppercase text-[#111111]/80 mb-2">
            <span>Tasks Done</span>
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#111111] font-mono-nums">
            {tasksCompleted}
          </div>
          <div className="text-[11px] font-bold text-[#111111]/80 mt-1">
            {completionRate}% completion rate
          </div>
        </div>

        {/* Metric 4: Academic Streak */}
        <div className="p-4 bg-white border-[3px] border-[#111111] shadow-brutal-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-black uppercase text-[#111111]/80 mb-2">
            <span>Active Streak</span>
            <Flame className="w-4 h-4 text-[#FF6B6B] stroke-[2.5]" />
          </div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#111111] font-mono-nums">
            {stats.streak}d
          </div>
          <div className="text-[11px] font-bold text-[#111111]/80 mt-1">
            Consecutive study days
          </div>
        </div>
      </div>
    </div>
  );
};
