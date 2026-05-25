"use client";

import { LetterStatus } from "@/lib/gameLogic";
import { useEffect, useRef, useState } from "react";

interface GameBoardProps {
  wordLength: number;
  guesses: string[];
  evaluations: LetterStatus[][];
  currentInput: string;
  gameStatus: "playing" | "won" | "lost";
  shakingRow: number | null;
  revealingRow: number | null;
  onRevealDone: () => void;
  wonRow: number | null;
}

const EVAL_COLORS: Record<string, string> = {
  correct: "#6aaa64",
  present: "#c9b458",
  absent:  "#787c7e",
};

export default function GameBoard({
  wordLength,
  guesses,
  evaluations,
  currentInput,
  gameStatus,
  shakingRow,
  revealingRow,
  onRevealDone,
  wonRow,
}: GameBoardProps) {
  const rows = 6;
  const currentRowIndex = guesses.length;

  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (revealingRow === null) return;
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    const totalDelay = (wordLength - 1) * 100 + 500 + 50;
    revealTimerRef.current = setTimeout(onRevealDone, totalDelay);
    return () => { if (revealTimerRef.current) clearTimeout(revealTimerRef.current); };
  }, [revealingRow, wordLength, onRevealDone]);

  // Responsive tile size based on word length
  const tileSize = wordLength === 7 ? 54 : wordLength === 6 ? 58 : 62;

  return (
    <div className="flex flex-col items-center gap-[5px] py-6" role="grid">
      {Array.from({ length: rows }).map((_, rowIdx) => {
        const isCurrentRow = rowIdx === currentRowIndex && gameStatus === "playing";
        const isShaking   = shakingRow === rowIdx;
        const isRevealing = revealingRow === rowIdx;
        const isBouncing  = wonRow === rowIdx;
        const submitted   = rowIdx < guesses.length;
        const evaluation  = evaluations[rowIdx];

        const letters = submitted
          ? guesses[rowIdx].split("")
          : isCurrentRow
          ? currentInput.split("")
          : [];

        return (
          <div
            key={rowIdx}
            className={`flex gap-[5px] ${isShaking ? "row-shake" : ""}`}
            role="row"
          >
            {Array.from({ length: wordLength }).map((_, colIdx) => {
              const letter = letters[colIdx] ?? "";
              let status: LetterStatus = "empty";
              if (submitted && evaluation) status = evaluation[colIdx];
              else if (isCurrentRow && letter) status = "tbd";

              return (
                <Tile
                  key={colIdx}
                  letter={letter}
                  status={status}
                  size={tileSize}
                  isRevealing={isRevealing && submitted}
                  isBouncing={isBouncing && submitted}
                  delay={colIdx * 100}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

interface TileProps {
  letter: string;
  status: LetterStatus;
  size: number;
  isRevealing: boolean;
  isBouncing: boolean;
  delay: number;
}

function Tile({ letter, status, size, isRevealing, isBouncing, delay }: TileProps) {
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => {
    if (isRevealing || isBouncing) setAnimKey((k) => k + 1);
  }, [isRevealing, isBouncing]);

  // Border color
  const borderColor =
    status === "tbd"   ? "#878a8c"
    : (status === "correct" || status === "present" || status === "absent")
    ? (EVAL_COLORS[status] ?? "#787c7e")
    : "#d3d6da";

  // Background color
  const bgColor =
    status === "correct" || status === "present" || status === "absent"
      ? EVAL_COLORS[status]
      : "#ffffff";

  // Text color: white on colored tiles, dark on empty/tbd
  const textColor =
    status === "correct" || status === "present" || status === "absent"
      ? "#ffffff"
      : "#1a1a1b";

  const tileClass =
    isRevealing ? "tile-reveal"
    : isBouncing ? "tile-bounce"
    : letter && status === "tbd" ? "tile-pop"
    : "";

  const cssVars = isRevealing
    ? ({ "--delay": `${delay}ms`, "--tile-color": EVAL_COLORS[status] ?? "#787c7e" } as React.CSSProperties)
    : isBouncing
    ? ({ "--delay": `${delay}ms` } as React.CSSProperties)
    : {};

  return (
    <div
      key={animKey}
      className={`flex items-center justify-center font-bold uppercase select-none ${tileClass}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.43,
        border: `2px solid ${isRevealing ? "#878a8c" : borderColor}`,
        backgroundColor: isRevealing ? "#ffffff" : bgColor,
        color: isRevealing ? "#1a1a1b" : textColor,
        ...cssVars,
      }}
      aria-label={letter ? `${letter} ${status}` : "empty"}
    >
      {letter}
    </div>
  );
}
