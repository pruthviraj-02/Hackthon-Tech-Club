import React, { useState } from 'react';
import {
  BatteryWarning,
  AlertCircle,
  Compass,
  CheckCircle2,
  Zap,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { MoodRecord } from '../types';
import { getTodayDateString, getDateOffsetString } from '../utils/storage';

interface MoodCheckInProps {
  moods: MoodRecord[];
  onSelectMood: (moodId: number, note?: string) => void;
}

interface MoodConfig {
  id: number;
  label: string;
  tagline: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MOOD_CONFIGS: MoodConfig[] = [
  {
    id: 1,
    label: 'Drained',
    tagline: 'Low energy & tired',
    color: 'bg-[#FF6B6B]',
    icon: BatteryWarning,
  },
  {
    id: 2,
    label: 'Distracted',
    tagline: 'Struggling to lock in',
    color: 'bg-[#FFE066]',
    icon: AlertCircle,
  },
  {
    id: 3,
    label: 'Steady',
    tagline: 'Calm & balanced rhythm',
    color: 'bg-white',
    icon: Compass,
  },
  {
    id: 4,
    label: 'Productive',
    tagline: 'Making solid headway',
    color: 'bg-[#4ECDC4]',
    icon: CheckCircle2,
  },
  {
    id: 5,
    label: 'Locked In',
    tagline: 'Peak focus & hyperflow',
    color: 'bg-[#FFE066]',
    icon: Zap,
  },
];

export const MoodCheckIn: React.FC<MoodCheckInProps> = ({ moods, onSelectMood }) => {
  const today = getTodayDateString();
  const todayRecord = moods.find((m) => m.date === today);
  const [selectedMoodId, setSelectedMoodId] = useState<number | null>(
    todayRecord ? todayRecord.moodId : 5
  );

  const handleChoose = (id: number) => {
    setSelectedMoodId(id);
    const cfg = MOOD_CONFIGS.find((m) => m.id === id);
    onSelectMood(id, cfg?.tagline);
  };

  // Build the 7-day window from 6 days ago up to today
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const offset = i - 6; // -6 to 0 (today)
    const dateStr = getDateOffsetString(offset);
    const existing = moods.find((m) => m.date === dateStr);
    const dateObj = new Date(dateStr + 'T00:00:00');
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = dateObj.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    const isToday = dateStr === today;

    return {
      dateStr,
      dayName,
      dayNum,
      isToday,
      moodId: existing ? existing.moodId : null,
      note: existing ? existing.note : null,
    };
  });

  return (
    <div className="bg-white border-[3px] border-[#111111] shadow-brutal p-5 sm:p-6 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b-[3px] border-[#111111]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4ECDC4] border-2 border-[#111111] shadow-brutal-sm flex items-center justify-center font-bold">
              <Compass className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg text-[#111111]">
                MOOD & ENERGY FORGE
              </h2>
              <span className="text-[11px] font-bold text-[#111111]/70">
                Daily check-in & 7-day academic mindset track
              </span>
            </div>
          </div>

          <span className="px-2 py-0.5 bg-[#111111] text-[#FFFDF5] text-[10px] font-black uppercase">
            {todayRecord ? 'Checked In Today' : 'Awaiting Check-in'}
          </span>
        </div>

        {/* 5 Mood Options (Strictly Lucide SVG icons, zero emoji) */}
        <p className="text-xs font-black text-[#111111] uppercase tracking-wider mb-2">
          How is your focus mindset right now?
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-5">
          {MOOD_CONFIGS.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMoodId === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleChoose(m.id)}
                className={`p-3 border-[3px] border-[#111111] flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  m.color
                } ${
                  isSelected
                    ? 'shadow-brutal ring-2 ring-[#111111] scale-[1.02]'
                    : 'shadow-brutal-sm hover:scale-[1.01]'
                }`}
              >
                <div className="w-8 h-8 rounded-full border-2 border-[#111111] bg-white flex items-center justify-center mb-1.5 shadow-brutal-sm">
                  <Icon className="w-4 h-4 stroke-[2.5] text-[#111111]" />
                </div>
                <span className="font-heading font-black text-xs text-[#111111] block">
                  {m.label}
                </span>
                <span className="text-[10px] font-bold text-[#111111]/75 leading-tight mt-0.5 line-clamp-1">
                  {m.tagline}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7-Day History Track */}
      <div className="pt-3 border-t-2 border-[#111111]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Last 7 Days Academic Flow</span>
          </span>
          <span className="text-[11px] font-bold text-[#111111]/60">
            Updated Daily
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
          {last7Days.map((day) => {
            const mood = day.moodId ? MOOD_CONFIGS.find((m) => m.id === day.moodId) : null;
            const Icon = mood ? mood.icon : null;

            return (
              <div
                key={day.dateStr}
                className={`p-2 border-2 border-[#111111] shadow-brutal-sm flex flex-col items-center justify-between min-h-[75px] ${
                  day.isToday ? 'bg-[#FFE066]' : mood ? mood.color : 'bg-[#FFFDF5]'
                }`}
              >
                <div className="text-[10px] font-black uppercase text-[#111111]">
                  {day.dayName}
                </div>
                <div className="my-1">
                  {Icon ? (
                    <div className="w-6 h-6 border-2 border-[#111111] bg-white rounded-full flex items-center justify-center shadow-brutal-sm">
                      <Icon className="w-3.5 h-3.5 stroke-[2.5] text-[#111111]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-dashed border-[#111111]/40 rounded-full flex items-center justify-center text-[10px] font-bold text-[#111111]/40">
                      -
                    </div>
                  )}
                </div>
                <div className="text-[9px] font-bold text-[#111111] truncate w-full">
                  {mood ? mood.label : day.dayNum}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
