"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import GameBoard from "@/components/GameBoard";
import Keyboard from "@/components/Keyboard";
import LearningMoment from "@/components/LearningMoment";
import StatsModal from "@/components/StatsModal";
import Toast, { ToastMessage } from "@/components/Toast";
import { evaluateGuess, getKeyStatuses, LetterStatus } from "@/lib/gameLogic";
import { getDailyWord, getRandomWord, getTodayKey, getTodayString, WordEntry } from "@/lib/words";
import {
  addToReview,
  getDailyState,
  getStats,
  GameStats,
  saveDailyState,
  updateStats,
} from "@/lib/storage";

type GameMode = "daily" | "infinite";
type GamePhase = "playing" | "learning";

let toastCounter = 0;

export default function Home() {
  const [mode, setMode]           = useState<GameMode>("daily");
  const [phase, setPhase]         = useState<GamePhase>("playing");

  const [word, setWord]           = useState<WordEntry | null>(null);
  const [guesses, setGuesses]     = useState<string[]>([]);
  const [evaluations, setEvals]   = useState<LetterStatus[][]>([]);
  const [currentInput, setInput]  = useState("");
  const [gameStatus, setStatus]   = useState<"playing" | "won" | "lost">("playing");

  const [shakingRow, setShakingRow]     = useState<number | null>(null);
  const [revealingRow, setRevealRow]    = useState<number | null>(null);
  const [wonRow, setWonRow]             = useState<number | null>(null);
  const [isAnimating, setIsAnimating]   = useState(false);

  const [toasts, setToasts]   = useState<ToastMessage[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats]     = useState<GameStats | null>(null);

  const usedWords = useRef<string[]>([]);

  // ── Init ─────────────────────────────────────────────────
  useEffect(() => {
    const todayKey   = getTodayKey();
    const savedState = getDailyState();
    const dailyWord  = getDailyWord();
    setStats(getStats());

    if (savedState && savedState.dateKey === todayKey) {
      setWord(dailyWord);
      setGuesses(savedState.guesses);
      setEvals(savedState.evaluations as LetterStatus[][]);
      setStatus(savedState.gameStatus);
      if (savedState.gameStatus !== "playing") setPhase("learning");
    } else {
      setWord(dailyWord);
    }
  }, []);

  // ── Toast ─────────────────────────────────────────────────
  const showToast  = useCallback((text: string) => {
    const id = ++toastCounter;
    setToasts((p) => [...p, { id, text }]);
  }, []);
  const removeToast = useCallback((id: number) => {
    setToasts((p) => p.filter((t) => t.id !== id));
  }, []);

  // ── Submit guess ──────────────────────────────────────────
  const submitGuess = useCallback(() => {
    if (!word || isAnimating || gameStatus !== "playing") return;

    const guess    = currentInput.toUpperCase();
    const expected = word.length;

    if (guess.length < expected) {
      showToast("Not enough letters");
      setShakingRow(guesses.length);
      setTimeout(() => setShakingRow(null), 600);
      return;
    }
    if (guess.length > expected) {
      showToast("Too many letters");
      setShakingRow(guesses.length);
      setTimeout(() => setShakingRow(null), 600);
      return;
    }

    const evaluation  = evaluateGuess(guess, word.word);
    const newGuesses  = [...guesses, guess];
    const newEvals    = [...evaluations, evaluation];
    const won         = guess === word.word;
    const lost        = !won && newGuesses.length === 6;
    const newStatus   = won ? "won" : lost ? "lost" : "playing";

    setGuesses(newGuesses);
    setEvals(newEvals);
    setInput("");
    setIsAnimating(true);
    setRevealRow(guesses.length);

    if (mode === "daily") {
      saveDailyState({ dateKey: getTodayKey(), word: word.word, guesses: newGuesses, evaluations: newEvals, gameStatus: newStatus });
    }

    const totalDelay = (word.length - 1) * 100 + 500 + 100;
    setTimeout(() => {
      setStatus(newStatus);
      if (won) {
        setWonRow(guesses.length);
        showToast(newGuesses.length <= 2 ? "Magnificent!" : newGuesses.length <= 4 ? "Great!" : "Phew!");
      } else if (lost) {
        showToast(word.word);
      }

      if (won || lost) {
        if (mode === "daily") {
          updateStats(won, newGuesses.length, getTodayKey());
          setStats(getStats());
        }
        addToReview({ word: word.word, date: getTodayString(), definition: word.definition, correct: won, guessCount: newGuesses.length, mode });
        setTimeout(() => { setPhase("learning"); setIsAnimating(false); }, won ? 1600 : 800);
      } else {
        setIsAnimating(false);
      }
    }, totalDelay);
  }, [word, guesses, evaluations, currentInput, gameStatus, isAnimating, mode, showToast]);

  // ── Key handler ───────────────────────────────────────────
  const handleKey = useCallback((key: string) => {
    if (phase !== "playing" || gameStatus !== "playing" || isAnimating || !word) return;
    if (key === "ENTER") { submitGuess(); }
    else if (key === "⌫" || key === "Backspace") { setInput((p) => p.slice(0, -1)); }
    else if (/^[a-zA-Z]$/.test(key)) {
      const upper = key.toUpperCase();
      setInput((p) => p.length < word.length ? p + upper : p);
    }
  }, [phase, gameStatus, isAnimating, word, submitGuess]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key === "Backspace" ? "⌫" : e.key === "Enter" ? "ENTER" : e.key;
      handleKey(key);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey]);

  // ── Mode transitions ──────────────────────────────────────
  function startInfinite() {
    const next = getRandomWord(usedWords.current);
    usedWords.current = [...usedWords.current, next.word];
    resetGame(next, "infinite");
  }

  function nextWord() {
    const next = getRandomWord(usedWords.current);
    usedWords.current = [...usedWords.current, next.word];
    resetGame(next, "infinite");
  }

  function resetGame(next: WordEntry, newMode: GameMode) {
    setMode(newMode); setWord(next); setGuesses([]); setEvals([]);
    setInput(""); setStatus("playing"); setPhase("playing");
    setRevealRow(null); setWonRow(null); setIsAnimating(false);
  }

  const keyStatuses = getKeyStatuses(guesses, evaluations);

  if (!word) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="text-[#878a8c] text-sm">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onShowStats={() => { setStats(getStats()); setShowStats(true); }} mode={mode} />
      <Toast messages={toasts} onRemove={removeToast} />

      <main className="flex-1 flex flex-col items-center w-full max-w-lg mx-auto">
        {phase === "playing" ? (
          <>
            <GameBoard
              wordLength={word.length}
              guesses={guesses}
              evaluations={evaluations}
              currentInput={currentInput}
              gameStatus={gameStatus}
              shakingRow={shakingRow}
              revealingRow={revealingRow}
              onRevealDone={() => setRevealRow(null)}
              wonRow={wonRow}
            />
            <div className="flex-1" />
            <Keyboard
              keyStatuses={keyStatuses}
              onKey={handleKey}
              disabled={isAnimating || phase !== "playing" || gameStatus !== "playing"}
            />
          </>
        ) : (
          <LearningMoment
            word={word}
            guesses={guesses}
            evaluations={evaluations}
            gameStatus={gameStatus as "won" | "lost"}
            mode={mode}
            dateStr={getTodayString()}
            onPlayInfinite={mode === "daily" ? startInfinite : undefined}
            onNextWord={mode === "infinite" ? nextWord : undefined}
          />
        )}
      </main>

      {showStats && stats && (
        <StatsModal stats={stats} onClose={() => setShowStats(false)} />
      )}
    </div>
  );
}
