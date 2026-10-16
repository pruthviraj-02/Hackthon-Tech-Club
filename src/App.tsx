/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Task, UserStats, MoodRecord, Priority } from './types';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  loadStatsFromStorage,
  saveStatsToStorage,
  loadMoodsFromStorage,
  saveMoodsToStorage,
  calculateLevel,
  getTodayDateString,
  getDateOffsetString,
  getDefaultTasks,
  getDefaultStats,
  getDefaultMoods,
} from './utils/storage';
import { playXPGainSound } from './utils/audio';
import { Header } from './components/Header';
import { MarqueeStrip } from './components/MarqueeStrip';
import { XPBanner } from './components/XPBanner';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskList } from './components/TaskList';
import { MoodCheckIn } from './components/MoodCheckIn';
import { StatsSection } from './components/StatsSection';
import { BreatheModal } from './components/BreatheModal';
import { LevelUpModal } from './components/LevelUpModal';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { HowToUse } from './components/HowToUse';
import { Sparkles, Flame, Target, ArrowRight } from 'lucide-react';

export default function App() {
  // Preloader state
  const [showPreloader, setShowPreloader] = useState<boolean>(() => {
    return !sessionStorage.getItem('focusforge_visited');
  });

  // Dark Mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('focusforge_theme');
      if (saved) return saved === 'dark';
    } catch (e) {
      // fallback
    }
    return false;
  });

  // Data states with robust persistence
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [stats, setStats] = useState<UserStats>(() => loadStatsFromStorage());
  const [moods, setMoods] = useState<MoodRecord[]>(() => loadMoodsFromStorage());

  // Modals state
  const [isBreatheOpen, setIsBreatheOpen] = useState(false);
  const [levelUpState, setLevelUpState] = useState<{ isOpen: boolean; level: number }>({
    isOpen: false,
    level: 1,
  });

  // XP Award Toast Notification
  const [xpToast, setXpToast] = useState<{ message: string; amount: number } | null>(null);

  // Sync dark mode class with DOM and localStorage
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('focusforge_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('focusforge_theme', 'light');
      }
    } catch (err) {
      console.error('Failed to save theme', err);
    }
  }, [darkMode]);

  // Sync tasks to localStorage
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Sync stats to localStorage
  useEffect(() => {
    saveStatsToStorage(stats);
  }, [stats]);

  // Sync moods to localStorage
  useEffect(() => {
    saveMoodsToStorage(moods);
  }, [moods]);

  // Handle streak verification on initial mount
  useEffect(() => {
    const today = getTodayDateString();
    const yesterday = getDateOffsetString(-1);

    setStats((prev) => {
      // If user was active today, keep streak
      if (prev.lastActiveDate === today) {
        return prev;
      }
      // If user was active yesterday, keep current streak or increment on next action
      if (prev.lastActiveDate === yesterday) {
        return { ...prev, lastActiveDate: today };
      }
      // If last active was before yesterday, streak resets to 1 for today
      return { ...prev, streak: 1, lastActiveDate: today };
    });
  }, []);

  // Award XP helper that checks for Level Up
  const awardXP = useCallback((amount: number, reason: string) => {
    playXPGainSound();
    setXpToast({ message: reason, amount });
    setTimeout(() => setXpToast(null), 3000);

    setStats((prev) => {
      const oldLevel = calculateLevel(prev.xp).level;
      const newXp = prev.xp + amount;
      const newLevel = calculateLevel(newXp).level;

      if (newLevel > oldLevel) {
        // Trigger celebratory level-up modal!
        setLevelUpState({ isOpen: true, level: newLevel });
      }

      return {
        ...prev,
        xp: newXp,
      };
    });
  }, []);

  // Pomodoro Focus session completion handler
  const handleSessionComplete = useCallback(
    (focusMinutes: number) => {
      const today = getTodayDateString();
      setStats((prev) => ({
        ...prev,
        sessionsToday: prev.sessionsToday + 1,
        totalSessionsCompleted: prev.totalSessionsCompleted + 1,
        totalFocusMinutes: prev.totalFocusMinutes + focusMinutes,
        lastActiveDate: today,
        lastSessionDate: today,
      }));

      awardXP(100, '25m Focus Block Finished!');
    },
    [awardXP]
  );

  // Task actions
  const handleAddTask = (title: string, priority: Priority) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            // Task completed -> award XP!
            awardXP(25, `Mission Completed: "${t.title.substring(0, 24)}..."`);
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Mood selection handler
  const handleSelectMood = (moodId: number, note?: string) => {
    const today = getTodayDateString();
    setMoods((prev) => {
      const filtered = prev.filter((m) => m.date !== today);
      return [...filtered, { date: today, moodId, note }];
    });
    awardXP(15, 'Daily Academic Mood Recorded');
  };

  // Reset to sample student data
  const handleResetData = () => {
    if (window.confirm('Reset hub to realistic student sample data?')) {
      const defaultT = getDefaultTasks();
      const defaultS = getDefaultStats();
      const defaultM = getDefaultMoods();
      setTasks(defaultT);
      setStats(defaultS);
      setMoods(defaultM);
      saveTasksToStorage(defaultT);
      saveStatsToStorage(defaultS);
      saveMoodsToStorage(defaultM);
      setXpToast({ message: 'Sample assignments & metrics restored!', amount: 0 });
      setTimeout(() => setXpToast(null), 2500);
    }
  };

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('focusforge_visited', 'true');
    setShowPreloader(false);
  };

  // Global keyboard shortcuts (Space to toggle timer, Esc to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is currently typing in an input or textarea, ignore spacebar
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.code === 'Space') {
        // Find and click the timer start/pause button
        const startBtn = document.querySelector(
          'button[class*="btn-brutal"]:has(svg)'
        ) as HTMLButtonElement | null;
        if (startBtn && !isBreatheOpen && !levelUpState.isOpen) {
          e.preventDefault();
          startBtn.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBreatheOpen, levelUpState.isOpen]);

  const tasksCompletedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#111111] flex flex-col font-sans transition-colors selection:bg-[#FFE066] selection:text-[#111111]">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Preloader */}
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Header */}
      <Header
        streak={stats.streak}
        level={calculateLevel(stats.xp).level}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenBreathe={() => setIsBreatheOpen(true)}
        onResetData={handleResetData}
      />

      {/* Motivational Marquee Strip */}
      <MarqueeStrip />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Oversized Hero Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-[3px] border-[#111111] pb-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-[#FF6B6B] border-2 border-[#111111] shadow-brutal-sm text-[11px] font-black uppercase text-[#111111]">
                STUDENT DEEP WORK ENGINE
              </span>
              <span className="text-xs font-bold text-[#111111]/70">
                · Zero Distractions Policy
              </span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#111111] leading-none uppercase">
              FORGE UNBROKEN FOCUS.
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#111111]/80 mt-2 max-w-xl">
              Lock in 25-minute Pomodoro sprints, slay high-priority assignments, and level up your academic stamina every single day.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsBreatheOpen(true)}
              className="px-4 py-2.5 bg-[#4ECDC4] hover:bg-[#4ECDC4] text-[#111111] font-black uppercase text-xs btn-brutal flex items-center gap-2 cursor-pointer"
            >
              <span>4-4-6 Reset</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* 1. XP Level & Streak Progress Banner */}
        <div className="reveal-section">
          <XPBanner
            xp={stats.xp}
            streak={stats.streak}
            sessionsToday={stats.sessionsToday}
          />
        </div>

        {/* 2. Asymmetric Bento Grid Row 1: Pomodoro Forge (7 cols) + Mood Forge (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch reveal-section">
          {/* Pomodoro Timer Tile */}
          <div className="lg:col-span-7 card-tilt">
            <PomodoroTimer onSessionComplete={handleSessionComplete} />
          </div>

          {/* Mood & Energy Check-in Tile */}
          <div className="lg:col-span-5 card-tilt">
            <MoodCheckIn moods={moods} onSelectMood={handleSelectMood} />
          </div>
        </div>

        {/* 3. Asymmetric Bento Grid Row 2: Action Forge Tasks (7 cols) + Stats Telemetry (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch reveal-section">
          {/* Action Tasks Tile */}
          <div className="lg:col-span-7 card-tilt">
            <TaskList
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>

          {/* Telemetry Stats Tile */}
          <div className="lg:col-span-5 flex flex-col justify-between card-tilt">
            <StatsSection
              stats={stats}
              tasksCompleted={tasksCompletedCount}
              totalTasks={tasks.length}
            />
          </div>
        </div>

        {/* 4. On-Screen "How To Use" Guide */}
        <div className="reveal-section">
          <HowToUse />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-[3px] border-[#111111] bg-white py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#111111]">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-sm uppercase">FOCUSFORGE</span>
            <span>—</span>
            <span className="text-[#111111]/70">Engineered for relentless student productivity.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider text-[#111111]/70">
            <span>Local Storage Active</span>
            <span>·</span>
            <span>No Cloud Dependency</span>
          </div>
        </div>
      </footer>

      {/* Breathe Mode Full-screen Modal */}
      <BreatheModal
        isOpen={isBreatheOpen}
        onClose={() => setIsBreatheOpen(false)}
      />

      {/* Level-Up Celebration Modal */}
      <LevelUpModal
        isOpen={levelUpState.isOpen}
        level={levelUpState.level}
        onClose={() => setLevelUpState({ isOpen: false, level: 1 })}
      />

      {/* XP Toast Banner */}
      {xpToast && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 bg-[#FFE066] border-[3px] border-[#111111] shadow-brutal flex items-center gap-3 text-xs font-black text-[#111111] animate-task-pop">
          <div className="w-6 h-6 bg-[#111111] text-[#FFE066] flex items-center justify-center font-bold">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span>{xpToast.message}</span>
            {xpToast.amount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-[#FF6B6B] border border-[#111111] text-[10px]">
                +{xpToast.amount} XP
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
