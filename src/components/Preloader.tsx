import React, { useState, useEffect } from 'react';
import { Target, Zap } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 200);
          return 100;
        }
        return prev + 20;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#FFFDF5] flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white border-[4px] border-[#111111] shadow-brutal-lg text-center animate-task-pop">
        {/* Animated Brand Emblem */}
        <div className="w-20 h-20 mx-auto mb-5 bg-[#FFE066] border-[4px] border-[#111111] shadow-brutal flex items-center justify-center animate-brutal-pulse">
          <Target className="w-10 h-10 stroke-[3] text-[#111111]" />
        </div>

        {/* Brand Headline */}
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#111111] tracking-tight">
          FOCUSFORGE
        </h1>
        <p className="text-xs font-black uppercase tracking-widest text-[#111111]/70 mt-1">
          STUDENT FOCUS & DEEP WORK HUB
        </p>

        {/* Progress Bar Container */}
        <div className="mt-6 mb-2">
          <div className="flex items-center justify-between text-xs font-black text-[#111111] mb-1.5">
            <span>SYNCHRONIZING REPOSITORY</span>
            <span className="font-mono-nums">{progress}%</span>
          </div>
          <div className="w-full h-5 bg-[#FFFDF5] border-[3px] border-[#111111] p-[2px] overflow-hidden">
            <div
              className="h-full bg-[#FF6B6B] border-r-2 border-[#111111] transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Fast-forward Button */}
        <button
          onClick={onComplete}
          className="mt-4 text-[11px] font-black uppercase underline hover:no-underline text-[#111111] cursor-pointer"
        >
          Skip into Hub →
        </button>
      </div>
    </div>
  );
};
