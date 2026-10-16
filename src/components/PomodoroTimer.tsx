import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Target, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { PomodoroMode } from '../types';
import { playTimerCompleteSound } from '../utils/audio';

interface PomodoroTimerProps {
  onSessionComplete: (focusMinutes: number) => void;
}

const FOCUS_SECONDS = 25 * 60; // 1500s
const BREAK_SECONDS = 5 * 60;  // 300s

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(FOCUS_SECONDS);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [autoSwitch, setAutoSwitch] = useState<boolean>(true);
  const [sessionCompletedAlert, setSessionCompletedAlert] = useState<string | null>(null);

  // Keep a ref to autoSwitch and mode so interval callback sees latest values
  const autoSwitchRef = useRef(autoSwitch);
  autoSwitchRef.current = autoSwitch;

  const modeRef = useRef(mode);
  modeRef.current = mode;

  // Format seconds into MM:SS (ensure never negative)
  const formatTime = (seconds: number): string => {
    const safeSec = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(safeSec / 60);
    const secs = safeSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Switch modes safely
  const handleSwitchMode = (newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS);
    setSessionCompletedAlert(null);
  };

  // Timer tick effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          // Check if timer reaches 0 or below
          if (prev <= 1) {
            // Clamped to 0
            playTimerCompleteSound();

            const currentMode = modeRef.current;
            const willAutoSwitch = autoSwitchRef.current;

            if (currentMode === 'focus') {
              onSessionComplete(25);
              setSessionCompletedAlert('FOCUS SESSION COMPLETE! +100 XP EARNED');
              if (willAutoSwitch) {
                setMode('break');
                return BREAK_SECONDS;
              } else {
                setIsRunning(false);
                return 0;
              }
            } else {
              setSessionCompletedAlert('BREAK FINISHED! TIME TO FORGE AGAIN');
              if (willAutoSwitch) {
                setMode('focus');
                return FOCUS_SECONDS;
              } else {
                setIsRunning(false);
                return 0;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, onSessionComplete]);

  const handleStartPause = () => {
    if (timeLeft <= 0) {
      // If at 0, reset to full time first
      setTimeLeft(mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS);
    }
    setIsRunning(!isRunning);
    setSessionCompletedAlert(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS);
    setSessionCompletedAlert(null);
  };

  // Quick preset helper (+1m / -1m) ensuring strictly non-negative
  const handleAdjustTime = (deltaMinutes: number) => {
    setTimeLeft((prev) => {
      const next = prev + deltaMinutes * 60;
      return Math.max(60, next); // At least 1 minute, never negative
    });
  };

  const totalTime = mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;
  const progressPercent = Math.min(100, Math.max(0, ((totalTime - timeLeft) / totalTime) * 100));

  return (
    <div className="bg-white border-[3px] border-[#111111] shadow-brutal p-5 sm:p-6 flex flex-col justify-between">
      {/* Header bar of Timer */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b-[3px] border-[#111111]">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 border-2 border-[#111111] shadow-brutal-sm flex items-center justify-center font-bold ${
              mode === 'focus' ? 'bg-[#FF6B6B]' : 'bg-[#4ECDC4]'
            }`}>
              {mode === 'focus' ? <Target className="w-4 h-4 stroke-[2.5]" /> : <Coffee className="w-4 h-4 stroke-[2.5]" />}
            </div>
            <div>
              <h2 className="font-heading font-black text-lg text-[#111111]">
                {mode === 'focus' ? 'POMODORO FORGE' : 'REST & RECHARGE'}
              </h2>
              <span className="text-[11px] font-bold text-[#111111]/70">
                {mode === 'focus' ? '25 min deep study session' : '5 min restorative breather'}
              </span>
            </div>
          </div>

          {/* Mode Selector Segmented Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#FFFDF5] border-2 border-[#111111] shadow-brutal-sm">
            <button
              type="button"
              onClick={() => handleSwitchMode('focus')}
              className={`px-3 py-1 text-xs font-black uppercase transition-all cursor-pointer ${
                mode === 'focus'
                  ? 'bg-[#FF6B6B] text-[#111111] border-2 border-[#111111] shadow-brutal-sm'
                  : 'text-[#111111]/70 hover:text-[#111111]'
              }`}
            >
              25m Focus
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('break')}
              className={`px-3 py-1 text-xs font-black uppercase transition-all cursor-pointer ${
                mode === 'break'
                  ? 'bg-[#4ECDC4] text-[#111111] border-2 border-[#111111] shadow-brutal-sm'
                  : 'text-[#111111]/70 hover:text-[#111111]'
              }`}
            >
              5m Break
            </button>
          </div>
        </div>

        {/* Completion Alert Banner */}
        {sessionCompletedAlert && (
          <div className="mb-5 p-3 bg-[#FFE066] border-[3px] border-[#111111] shadow-brutal-sm flex items-center justify-between text-xs font-black text-[#111111] animate-bounce">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF6B6B]" />
              <span>{sessionCompletedAlert}</span>
            </div>
            <button
              onClick={() => setSessionCompletedAlert(null)}
              className="text-[#111111] underline hover:no-underline font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Big Digital Clock Display */}
        <div className="my-4 text-center">
          <div className="inline-block relative">
            <div className="font-heading font-black text-6xl sm:text-7xl lg:text-8xl tracking-tight text-[#111111] font-mono-nums drop-shadow-sm select-none py-2 px-6 bg-[#FFFDF5] border-[3px] border-[#111111] shadow-brutal">
              {formatTime(timeLeft)}
            </div>

            {/* Status indicator tag */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className={`inline-block w-3 h-3 border-2 border-[#111111] ${isRunning ? 'bg-[#4ECDC4]' : 'bg-[#FF6B6B]'}`} />
              <span className="text-xs font-black uppercase tracking-wider text-[#111111]">
                {isRunning ? (mode === 'focus' ? 'Session In Progress' : 'Break In Progress') : 'Timer Paused'}
              </span>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="my-5">
          <div className="w-full h-4 bg-[#FFFDF5] border-[3px] border-[#111111] shadow-brutal-sm p-[2px] overflow-hidden">
            <div
              className={`h-full border-r-2 border-[#111111] transition-all duration-300 ${
                mode === 'focus' ? 'bg-[#FF6B6B]' : 'bg-[#4ECDC4]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-bold text-[#111111]/70 mt-1">
            <span>Elapsed: {formatTime(totalTime - timeLeft)}</span>
            <span>{Math.round(progressPercent)}% Done</span>
          </div>
        </div>
      </div>

      {/* Timer Controls Row */}
      <div className="pt-2 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Start / Pause Button */}
          <button
            type="button"
            onClick={handleStartPause}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-black uppercase tracking-wider text-[#111111] btn-brutal cursor-pointer ${
              isRunning ? 'bg-[#FFE066] hover:bg-[#FFE066]' : 'bg-[#4ECDC4] hover:bg-[#4ECDC4]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 stroke-[2.5]" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 stroke-[2.5]" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-3.5 text-sm font-black uppercase tracking-wider text-[#111111] bg-white hover:bg-slate-50 btn-brutal cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>Reset</span>
          </button>

          {/* Quick Adjust Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleAdjustTime(-1)}
              title="Minus 1 minute"
              className="px-2.5 py-3.5 text-xs font-black text-[#111111] bg-white border-[3px] border-[#111111] shadow-brutal-sm hover:bg-slate-100 cursor-pointer"
            >
              -1m
            </button>
            <button
              type="button"
              onClick={() => handleAdjustTime(1)}
              title="Add 1 minute"
              className="px-2.5 py-3.5 text-xs font-black text-[#111111] bg-white border-[3px] border-[#111111] shadow-brutal-sm hover:bg-slate-100 cursor-pointer"
            >
              +1m
            </button>
          </div>
        </div>

        {/* Auto-Switch & Audio indicator options */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-[#111111] text-xs font-bold text-[#111111]">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoSwitch}
              onChange={(e) => setAutoSwitch(e.target.checked)}
              className="w-4 h-4 accent-[#111111] rounded-none border-2 border-[#111111]"
            />
            <span>Auto-switch between Focus & Break</span>
          </label>

          <button
            type="button"
            onClick={() => playTimerCompleteSound()}
            title="Test alert sound"
            className="inline-flex items-center gap-1 text-[11px] text-[#111111] hover:underline"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Test Chime</span>
          </button>
        </div>
      </div>
    </div>
  );
};
