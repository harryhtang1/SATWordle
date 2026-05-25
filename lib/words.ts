import { wordbank, WordEntry } from "./wordbank";

export type { WordEntry };

export function getWordBank(): WordEntry[] {
  return wordbank;
}

export function getDailyWord(): WordEntry {
  const words = getWordBank();
  const start = Date.UTC(2024, 0, 1);
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const dayIndex = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return words[dayIndex % words.length];
}

export function getTodayString(): string {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function getTodayKey(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
}

export function getRandomWord(excludeWords: string[] = []): WordEntry {
  const words = getWordBank().filter((w) => !excludeWords.includes(w.word));
  if (words.length === 0) return getWordBank()[0];
  return words[Math.floor(Math.random() * words.length)];
}
