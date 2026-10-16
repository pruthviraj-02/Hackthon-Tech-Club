export type Priority = 'High' | 'Med' | 'Low';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export type PomodoroMode = 'focus' | 'break';

export interface MoodOption {
  id: number;
  label: string;
  descriptor: string;
  color: string; // hex
  iconName: 'battery' | 'alert' | 'target' | 'trending' | 'zap';
}

export interface MoodRecord {
  date: string; // YYYY-MM-DD
  moodId: number;
  note?: string;
}

export interface UserStats {
  xp: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  sessionsToday: number;
  lastSessionDate: string; // YYYY-MM-DD
  totalFocusMinutes: number;
  totalSessionsCompleted: number;
}
