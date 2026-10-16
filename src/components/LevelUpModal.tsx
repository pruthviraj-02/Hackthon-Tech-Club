import React from 'react';
import { Award, Zap, Sparkles, X, ChevronRight } from 'lucide-react';
import { Confetti } from './Confetti';

interface LevelUpModalProps {
  level: number;
  isOpen: boolean;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <Confetti durationMs={4000} />
      <div className="fixed inset-0 z-50 bg-[#111111]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
        <div className="relative w-full max-w-md bg-[#FFE066] border-[4px] border-[#111111] shadow-brutal-lg p-6 sm:p-8 text-center text-[#111111] animate-task-pop">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-white hover:bg-[#FF6B6B] border-2 border-[#111111] shadow-brutal-sm cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Icon Badge */}
          <div className="w-20 h-20 mx-auto mb-4 bg-white border-[4px] border-[#111111] shadow-brutal flex items-center justify-center animate-bounce">
            <Award className="w-10 h-10 stroke-[2.5] text-[#FF6B6B]" />
          </div>

          <span className="inline-block px-3 py-1 bg-[#111111] text-[#4ECDC4] text-xs font-black uppercase tracking-widest shadow-brutal-sm mb-3">
            ACADEMIC MASTERY UNLOCKED
          </span>

          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#111111] tracking-tight">
            LEVEL {level} REACHED!
          </h2>

          <p className="text-xs sm:text-sm font-bold text-[#111111]/80 mt-2 max-w-xs mx-auto">
            Your cognitive stamina is advancing. Keep stacking focus blocks to unlock the Scholar Titan title.
          </p>

          <div className="mt-6 pt-4 border-t-2 border-[#111111] flex flex-col gap-2">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#4ECDC4] hover:bg-[#4ECDC4] text-[#111111] font-black uppercase text-sm btn-brutal flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Keep Forging</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
