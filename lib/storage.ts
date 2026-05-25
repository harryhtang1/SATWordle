"use client";

export interface GameStats {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<string, number>;
  lastPlayedDate: string;
  lastWonDate: string;
}

export interface ReviewEntry {
  word: string;
  date: string;
  definition: string;
  correct: boolean;
  guessCount: number;
  mode: "daily" | "infinite";
}

export interface DailyGameState {
  dateKey: string;
  word: string;
  guesses: string[];
  evaluations: string[][];
  gameStatus: "playing" | "won" | "lost";
}

const STATS_KEY = "satwordle_stats";
const REVIEW_KEY = "satwordle_review";
const DAILY_KEY = "satwordle_daily";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getStats(): GameStats {
  if (!isBrowser()) return defaultStats();
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : defaultStats();
  } catch {
    return defaultStats();
  }
}

function defaultStats(): GameStats {
  return {
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 },
    lastPlayedDate: "",
    lastWonDate: "",
  };
}

export function updateStats(won: boolean, guessCount: number, dateKey: string): void {
  if (!isBrowser()) return;
  const stats = getStats();

  // Don't double-count if already played today
  if (stats.lastPlayedDate === dateKey) return;

  stats.played++;

  if (won) {
    stats.won++;
    const key = String(Math.min(guessCount, 6));
    stats.guessDistribution[key] = (stats.guessDistribution[key] || 0) + 1;

    // Streak logic: check if last win was yesterday
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayKey = `${yesterday.getUTCFullYear()}-${yesterday.getUTCMonth() + 1}-${yesterday.getUTCDate()}`;

    if (stats.lastWonDate === yesterdayKey || stats.lastWonDate === "") {
      stats.currentStreak = stats.currentStreak + 1;
    } else if (stats.lastWonDate !== dateKey) {
      stats.currentStreak = 1;
    }
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    stats.lastWonDate = dateKey;
  } else {
    stats.currentStreak = 0;
  }

  stats.lastPlayedDate = dateKey;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function getReviewList(): ReviewEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(REVIEW_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToReview(entry: ReviewEntry): void {
  if (!isBrowser()) return;
  const list = getReviewList();
  const exists = list.some(
    (e) => e.word === entry.word && e.date === entry.date && e.mode === entry.mode
  );
  if (!exists) {
    list.unshift(entry);
    localStorage.setItem(REVIEW_KEY, JSON.stringify(list));
  }
}

export function getDailyState(): DailyGameState | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveDailyState(state: DailyGameState): void {
  if (!isBrowser()) return;
  localStorage.setItem(DAILY_KEY, JSON.stringify(state));
}
