"use client";

import Link from "next/link";

interface HeaderProps {
  onShowStats: () => void;
  mode: "daily" | "infinite";
}

export default function Header({ onShowStats, mode }: HeaderProps) {
  return (
    <header className="w-full border-b border-[#d3d6da] bg-white">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <Link
          href="/review"
          className="p-2 text-[#878a8c] hover:text-[#1a1a1b] transition-colors"
          title="Review list"
        >
          <BookIcon />
        </Link>

        <div className="text-center">
          <h1 className="text-2xl font-black tracking-widest text-[#1a1a1b] leading-none select-none">
            SATWordle
          </h1>
          {mode === "infinite" && (
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#c9b458] uppercase">
              Infinite
            </span>
          )}
        </div>

        <button
          onClick={onShowStats}
          className="p-2 text-[#878a8c] hover:text-[#1a1a1b] transition-colors"
          title="Statistics"
        >
          <StatsIcon />
        </button>
      </div>
    </header>
  );
}

function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function StatsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
