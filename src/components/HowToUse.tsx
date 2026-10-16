import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Zap, Clock, CheckSquare, Wind, Keyboard } from 'lucide-react';

export const HowToUse: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border-[3px] border-[#111111] shadow-brutal p-4 sm:p-5">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#FFE066] border-2 border-[#111111] shadow-brutal-sm flex items-center justify-center font-bold">
            <HelpCircle className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-heading font-black text-sm text-[#111111] uppercase tracking-wide">
              HOW TO FORGE UNBROKEN FOCUS
            </h3>
            <span className="text-[11px] font-bold text-[#111111]/70">
              {isOpen ? 'Click to collapse guide' : 'Read the 60-second student playbook'}
            </span>
          </div>
        </div>

        <div className="p-1 bg-[#FFFDF5] border-2 border-[#111111] shadow-brutal-sm">
          {isOpen ? <ChevronUp className="w-4 h-4 stroke-[2.5]" /> : <ChevronDown className="w-4 h-4 stroke-[2.5]" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t-2 border-[#111111] grid grid-cols-1 md:grid-cols-4 gap-3 text-xs animate-fadeIn">
          {/* Step 1 */}
          <div className="p-3 bg-[#FFE066] border-2 border-[#111111] shadow-brutal-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-black uppercase text-[#111111] mb-1">
                <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>1. 25m Pomodoro</span>
              </div>
              <p className="font-medium text-[#111111]/80 leading-relaxed">
                Click Start or press <span className="font-mono-nums font-black bg-white px-1 border border-[#111111]">Space</span>. Lock into one singular assignment for 25 minutes. Auto-switch transitions straight into a 5m break.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase mt-2 text-[#111111]">Earns +100 XP</span>
          </div>

          {/* Step 2 */}
          <div className="p-3 bg-[#4ECDC4] border-2 border-[#111111] shadow-brutal-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-black uppercase text-[#111111] mb-1">
                <CheckSquare className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>2. Action Forge</span>
              </div>
              <p className="font-medium text-[#111111]/80 leading-relaxed">
                Add assignments with High, Med, or Low priority. Filter by status or urgency to eliminate mental clutter. Press <span className="font-mono-nums font-black bg-white px-1 border border-[#111111]">Enter</span> to submit instantly.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase mt-2 text-[#111111]">Earns +25 XP / Task</span>
          </div>

          {/* Step 3 */}
          <div className="p-3 bg-[#FF6B6B] border-2 border-[#111111] shadow-brutal-sm flex flex-col justify-between text-[#111111]">
            <div>
              <div className="flex items-center gap-1.5 font-black uppercase mb-1">
                <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>3. Level Up & Streak</span>
              </div>
              <p className="font-medium text-[#111111]/90 leading-relaxed">
                Every focus block and completed task charges your XP bar. Reach higher scholar ranks while maintaining your daily study streak.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase mt-2">Levels up every 250 XP</span>
          </div>

          {/* Step 4 */}
          <div className="p-3 bg-white border-2 border-[#111111] shadow-brutal-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-black uppercase text-[#111111] mb-1">
                <Wind className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>4. 4-4-6 Resonant Breath</span>
              </div>
              <p className="font-medium text-[#111111]/80 leading-relaxed">
                Feeling test anxiety or cognitive brain fog? Open <span className="font-bold">Breathe Mode</span> in the header for a 4-4-6 nervous system recalibration.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase mt-2 text-[#111111]">Press Esc to exit anytime</span>
          </div>
        </div>
      )}
    </div>
  );
};
