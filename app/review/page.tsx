"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getReviewList, ReviewEntry } from "@/lib/storage";

type Filter = "all" | "correct" | "missed";

export default function ReviewPage() {
  const [entries, setEntries] = useState<ReviewEntry[]>([]);
  const [filter, setFilter]   = useState<Filter>("all");

  useEffect(() => { setEntries(getReviewList()); }, []);

  const filtered = entries.filter((e) =>
    filter === "correct" ? e.correct : filter === "missed" ? !e.correct : true
  );
  const correctCount = entries.filter((e) => e.correct).length;
  const missedCount  = entries.filter((e) => !e.correct).length;

  return (
    <div className="min-h-screen bg-white text-[#1a1a1b]">
      {/* Header */}
      <header className="border-b border-[#d3d6da] bg-white">
        <div className="flex items-center h-14 px-4 max-w-lg mx-auto">
          <Link
            href="/"
            className="p-2 text-[#878a8c] hover:text-[#1a1a1b] transition-colors"
            aria-label="Back to game"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center text-sm font-bold uppercase tracking-widest text-[#1a1a1b]">
            Word Review
          </h1>
          <span className="text-[#878a8c] text-sm w-8 text-right">{entries.length}</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 flex flex-col gap-4">
        {/* Filter tabs */}
        <div className="flex gap-2">
          {(["all", "correct", "missed"] as Filter[]).map((f) => {
            const count  = f === "all" ? entries.length : f === "correct" ? correctCount : missedCount;
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 rounded-full text-sm font-bold capitalize transition-colors border ${
                  active
                    ? "bg-[#1a1a1b] text-white border-[#1a1a1b]"
                    : "bg-white text-[#878a8c] border-[#d3d6da] hover:border-[#878a8c]"
                }`}
              >
                {f} ({count})
              </button>
            );
          })}
        </div>

        {/* Word list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-[#878a8c]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <p className="text-sm text-center">
              {entries.length === 0 ? "Play some games to build your word list!" : "No words in this category yet."}
            </p>
            {entries.length === 0 && (
              <Link href="/" className="px-5 py-2 bg-[#6aaa64] text-white rounded-full text-sm font-bold">
                Play Today&apos;s Word
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((entry, i) => (
              <WordCard key={`${entry.word}-${entry.date}-${i}`} entry={entry} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function WordCard({ entry }: { entry: ReviewEntry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="border border-[#d3d6da] rounded-xl overflow-hidden cursor-pointer hover:border-[#878a8c] transition-colors bg-white"
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.correct ? "#6aaa64" : "#c9b458" }}
          />
          <div>
            <span className="text-[#1a1a1b] font-black text-lg tracking-widest">
              {entry.word}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-[#878a8c]">{entry.date}</span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                style={{
                  backgroundColor: entry.mode === "daily" ? "#e8f5e9" : "#fff8e1",
                  color:           entry.mode === "daily" ? "#6aaa64"  : "#c9b458",
                }}
              >
                {entry.mode}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {entry.correct ? (
            <span className="text-xs text-[#6aaa64] font-bold">{entry.guessCount}/6</span>
          ) : (
            <span className="text-xs text-[#787c7e] font-bold">Missed</span>
          )}
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#878a8c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-[#d3d6da]">
          <p className="text-[#1a1a1b] text-sm leading-relaxed">{entry.definition}</p>
        </div>
      )}
    </div>
  );
}
