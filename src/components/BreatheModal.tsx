import React, { useState, useEffect } from 'react';
import { X, Wind, Heart, RotateCcw } from 'lucide-react';

interface BreatheModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale';

export const BreatheModal: React.FC<BreatheModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(4);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

  // 4-4-6 timing constants
  const INHALE_TIME = 4;
  const HOLD_TIME = 4;
  const EXHALE_TIME = 6;

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setPhase('inhale');
      setPhaseSecondsLeft(INHALE_TIME);
      return;
    }

    const timer = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          if (phase === 'inhale') {
            setPhase('hold');
            return HOLD_TIME;
          } else if (phase === 'hold') {
            setPhase('exhale');
            return EXHALE_TIME;
          } else {
            // Exhale complete -> new cycle!
            setCyclesCompleted((c) => c + 1);
            setPhase('inhale');
            return INHALE_TIME;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, phase]);

  if (!isOpen) return null;

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return {
          title: 'INHALE DEEPLY',
          subtitle: 'Fill your lungs with fresh oxygen',
          color: 'bg-[#4ECDC4]',
          scaleClass: 'scale-125 sm:scale-150',
          duration: 'transition-all duration-[4000ms] ease-out',
        };
      case 'hold':
        return {
          title: 'HOLD STEADY',
          subtitle: 'Keep your chest calm and relaxed',
          color: 'bg-[#FFE066]',
          scaleClass: 'scale-125 sm:scale-150',
          duration: 'transition-all duration-300 ease-linear',
        };
      case 'exhale':
        return {
          title: 'EXHALE SLOWLY',
          subtitle: 'Release all cognitive tension',
          color: 'bg-[#FF6B6B]',
          scaleClass: 'scale-75 sm:scale-90',
          duration: 'transition-all duration-[6000ms] ease-in-out',
        };
    }
  };

  const instruction = getPhaseInstruction();

  return (
    <div className="fixed inset-0 z-50 bg-[#111111]/90 backdrop-blur-sm flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn">
      {/* Top Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFE066] border-[3px] border-[#111111] shadow-brutal-sm text-xs font-black uppercase text-[#111111]">
          <Wind className="w-4 h-4 stroke-[2.5]" />
          <span>4-4-6 Resonant Breath Protocol</span>
        </div>

        <button
          onClick={onClose}
          className="p-2 bg-white hover:bg-[#FF6B6B] border-[3px] border-[#111111] shadow-brutal-sm text-[#111111] transition-colors cursor-pointer"
          title="Exit Breathe Mode (Esc)"
        >
          <X className="w-5 h-5 stroke-[3]" />
        </button>
      </div>

      {/* Center Breathing Orb Container */}
      <div className="flex flex-col items-center justify-center my-auto text-center">
        {/* Animated Expanding/Contracting Orb */}
        <div className="relative flex items-center justify-center w-72 h-72 sm:w-88 sm:h-88 my-6">
          {/* Outer ring */}
          <div
            className={`absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full border-[4px] border-[#111111] ${instruction.color} shadow-brutal-lg ${instruction.scaleClass} ${instruction.duration} flex items-center justify-center`}
          >
            {/* Inner pulsating core */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-[3px] border-[#111111] bg-white flex flex-col items-center justify-center shadow-brutal-sm select-none">
              <span className="font-heading font-black text-4xl sm:text-5xl text-[#111111] font-mono-nums">
                {phaseSecondsLeft}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#111111]/70">
                Seconds
              </span>
            </div>
          </div>
        </div>

        {/* Phase Guidance text */}
        <div className="mt-8 z-10 bg-white border-[3px] border-[#111111] shadow-brutal px-6 py-4 max-w-md">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#111111] tracking-tight">
            {instruction.title}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-[#111111]/75 mt-1">
            {instruction.subtitle}
          </p>
        </div>
      </div>

      {/* Bottom Bar: Cycles completed & Reset */}
      <div className="w-full max-w-md bg-white border-[3px] border-[#111111] shadow-brutal p-3 flex items-center justify-between text-xs font-black text-[#111111]">
        <div className="flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-[#FF6B6B] fill-[#FF6B6B]" />
          <span>{cyclesCompleted} Cycles Completed</span>
        </div>

        <button
          onClick={() => {
            setPhase('inhale');
            setPhaseSecondsLeft(INHALE_TIME);
            setCyclesCompleted(0);
          }}
          className="flex items-center gap-1 px-2.5 py-1 bg-[#FFFDF5] hover:bg-[#FFE066] border-2 border-[#111111] shadow-brutal-sm cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Restart</span>
        </button>
      </div>
    </div>
  );
};
