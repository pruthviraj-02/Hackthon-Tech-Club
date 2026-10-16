import { Task, UserStats, MoodRecord } from '../types';

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateOffsetString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const TASKS_KEY = 'focusforge_tasks_v2';
const STATS_KEY = 'focusforge_stats_v2';
const MOODS_KEY = 'focusforge_moods_v2';

export const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Complete Linear Algebra Matrix Transformation Set',
    priority: 'High',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Review Machine Learning Chapter 4 Lecture Notes',
    priority: 'Med',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Submit Operating Systems Thread Synchronization Lab',
    priority: 'High',
    completed: true,
    completedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Organize Research Sources for Cognitive Science Paper',
    priority: 'Low',
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export function getDefaultTasks(): Task[] {
  return [
    {
      id: 'task-1',
      title: 'Complete Linear Algebra Matrix Transformation Set',
      priority: 'High',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-2',
      title: 'Review Machine Learning Chapter 4 Lecture Notes',
      priority: 'Med',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-3',
      title: 'Submit Operating Systems Thread Synchronization Lab',
      priority: 'High',
      completed: true,
      completedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'task-4',
      title: 'Organize Research Sources for Cognitive Science Paper',
      priority: 'Low',
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ];
}

export function getDefaultStats(): UserStats {
  const today = getTodayDateString();
  return {
    xp: 420,
    streak: 4,
    lastActiveDate: today,
    sessionsToday: 2,
    lastSessionDate: today,
    totalFocusMinutes: 150,
    totalSessionsCompleted: 6,
  };
}

export function getDefaultMoods(): MoodRecord[] {
  return [
    { date: getDateOffsetString(-6), moodId: 3, note: 'Steady pace' },
    { date: getDateOffsetString(-5), moodId: 4, note: 'Productive morning' },
    { date: getDateOffsetString(-4), moodId: 2, note: 'Midterm prep stress' },
    { date: getDateOffsetString(-3), moodId: 5, note: 'Crushed coding lab' },
    { date: getDateOffsetString(-2), moodId: 4, note: 'Good study flow' },
    { date: getDateOffsetString(-1), moodId: 3, note: 'Routine review' },
    { date: getTodayDateString(), moodId: 5, note: 'Locked in for exams' },
  ];
}

export function loadTasksFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to load tasks', err);
  }
  return DEFAULT_TASKS;
}

export function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks', err);
  }
}

export function loadStatsFromStorage(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      const parsed: UserStats = JSON.parse(raw);
      const today = getTodayDateString();
      // If today is a new day, reset sessionsToday count
      if (parsed.lastSessionDate !== today) {
        parsed.sessionsToday = 0;
        parsed.lastSessionDate = today;
      }
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load stats', err);
  }
  return getDefaultStats();
}

export function saveStatsToStorage(stats: UserStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save stats', err);
  }
}

export function loadMoodsFromStorage(): MoodRecord[] {
  try {
    const raw = localStorage.getItem(MOODS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to load moods', err);
  }
  return getDefaultMoods();
}

export function saveMoodsToStorage(moods: MoodRecord[]): void {
  try {
    localStorage.setItem(MOODS_KEY, JSON.stringify(moods));
  } catch (err) {
    console.error('Failed to save moods', err);
  }
}

// XP & Level calculations
// Level 1: 0 - 249 XP
// Level 2: 250 - 499 XP, etc. (250 XP per level)
export const XP_PER_LEVEL = 250;

export function calculateLevel(totalXp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const currentLevelXp = totalXp % XP_PER_LEVEL;
  const nextLevelXp = XP_PER_LEVEL;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / nextLevelXp) * 100));
  return { level, currentLevelXp, nextLevelXp, progressPercent };
}
