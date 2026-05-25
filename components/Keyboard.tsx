"use client";

import { LetterStatus } from "@/lib/gameLogic";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

interface KeyboardProps {
  keyStatuses: Record<string, LetterStatus>;
  onKey: (key: string) => void;
  disabled: boolean;
}

export default function Keyboard({ keyStatuses, onKey, disabled }: KeyboardProps) {
  return (
    <div className="w-full max-w-lg mx-auto px-1 pb-4 flex flex-col gap-[8px]">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex justify-center gap-[6px]">
          {row.map((key) => (
            <Key
              key={key}
              label={key}
              status={keyStatuses[key] ?? "unused"}
              onClick={() => !disabled && onKey(key)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface KeyProps {
  label: string;
  status: LetterStatus | "unused";
  onClick: () => void;
}

function Key({ label, status, onClick }: KeyProps) {
  const isWide = label === "ENTER" || label === "⌫";

  const bgColor =
    status === "correct" ? "#6aaa64"
    : status === "present" ? "#c9b458"
    : status === "absent"  ? "#787c7e"
    : "#d3d6da";

  const textColor =
    status === "correct" || status === "present" || status === "absent"
      ? "#ffffff"
      : "#1a1a1b";

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded font-bold uppercase select-none active:opacity-70 transition-opacity duration-75 cursor-pointer"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        height: 58,
        minWidth: isWide ? 66 : 43,
        fontSize: isWide ? 12 : 14,
        flex: isWide ? "0 0 66px" : "0 0 43px",
      }}
      aria-label={label}
    >
      {label}
    </button>
  );
}
