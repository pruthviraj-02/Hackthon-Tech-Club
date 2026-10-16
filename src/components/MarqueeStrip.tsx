import React from 'react';
import { Sparkles, Flame, Zap, Target } from 'lucide-react';

export const MarqueeStrip: React.FC = () => {
  const items = [
    'LOCK IN',
    'ZERO DISTRACTION',
    'FORGE DEEP FLOW',
    'ACADEMIC WEAPON',
    '25 MINUTES OF PURE FOCUS',
    'DESTROY PROCRASTINATION',
    'LEVEL UP YOUR MIND',
    'BUILD THE STREAK',
  ];

  return (
    <div className="w-full bg-[#111111] text-[#FFE066] border-y-[3px] border-[#111111] py-2.5 overflow-hidden select-none">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {/* Render twice for seamless loop */}
        {[...items, ...items, ...items].map((phrase, idx) => (
          <span key={idx} className="flex items-center gap-3 mx-4 text-xs font-black uppercase tracking-widest">
            <span>{phrase}</span>
            <span className="w-1.5 h-1.5 bg-[#FF6B6B] inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
};
