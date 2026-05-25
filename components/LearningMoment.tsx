"use client";

import { WordEntry } from "@/lib/wordbank";
import { LetterStatus, buildShareText } from "@/lib/gameLogic";
import { useState } from "react";

interface LearningMomentProps {
  word: WordEntry;
  guesses: string[];
  evaluations: LetterStatus[][];
  gameStatus: "won" | "lost";
  mode: "daily" | "infinite";
  dateStr: string;
  onPlayInfinite?: () => void;
  onNextWord?: () => void;
}

export default function LearningMoment({
  word,
  guesses,
  evaluations,
  gameStatus,
  mode,
  dateStr,
  onPlayInfinite,
  onNextWord,
}: LearningMomentProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const text = buildShareText(word.word, guesses, evaluations, dateStr, gameStatus === "won");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const emojiRows = evaluations.map((row) =>
    row.map((s) => (s === "correct" ? "🟩" : s === "present" ? "🟨" : "⬛")).join("")
  );

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6 w-full max-w-lg mx-auto">
      {/* Result */}
      <div className="text-center">
        {gameStatus === "won" ? (
          <p className="text-sm font-bold tracking-widest uppercase text-[#6aaa64]">
            {guesses.length === 1 ? "Genius" : guesses.length === 2 ? "Magnificent" : guesses.length === 3 ? "Impressive" : guesses.length === 4 ? "Splendid" : guesses.length === 5 ? "Great" : "Phew"}
          </p>
        ) : (
          <p className="text-sm font-bold tracking-widest uppercase text-[#787c7e]">
            The word was
          </p>
        )}
        <h2 className="text-5xl font-black tracking-widest text-[#1a1a1b] mt-1">
          {word.word}
        </h2>
      </div>

      {/* Definition card */}
      <div className="w-full rounded-xl border border-[#d3d6da] bg-[#f9f9f9] p-5 flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#878a8c]">
          {word.pos}
        </span>
        <p className="text-[#1a1a1b] text-base leading-relaxed">
          {word.definition}
        </p>
        <p className="text-[#878a8c] text-sm italic leading-relaxed border-l-2 border-[#6aaa64] pl-3">
          &ldquo;{word.example}&rdquo;
        </p>
        <div className="pt-2 border-t border-[#d3d6da]">
          <p className="text-[#878a8c] text-xs leading-relaxed">
            <span className="text-[#c9b458] font-semibold">Etymology: </span>
            {word.etymology}
          </p>
        </div>
      </div>

      {/* Emoji grid */}
      {mode === "daily" && (
        <div className="flex flex-col items-center gap-0.5 font-mono text-xl">
          {emojiRows.map((row, i) => <div key={i}>{row}</div>)}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col w-full gap-3">
        {mode === "daily" && (
          <button
            onClick={handleShare}
            className="w-full py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-colors"
            style={{
              backgroundColor: copied ? "#6aaa64" : "#6aaa64",
              color: "#ffffff",
              opacity: copied ? 0.85 : 1,
            }}
          >
            {copied ? "Copied!" : "Share Result"}
          </button>
        )}
        {mode === "daily" && onPlayInfinite && (
          <button
            onClick={onPlayInfinite}
            className="w-full py-3 rounded-full font-bold uppercase tracking-wider text-sm border-2 border-[#d3d6da] text-[#1a1a1b] hover:border-[#878a8c] transition-colors bg-white"
          >
            Play Infinite Mode
          </button>
        )}
        {mode === "infinite" && onNextWord && (
          <button
            onClick={onNextWord}
            className="w-full py-3 rounded-full font-bold uppercase tracking-wider text-sm text-white"
            style={{ backgroundColor: "#6aaa64" }}
          >
            Next Word →
          </button>
        )}
      </div>
    </div>
  );
}
