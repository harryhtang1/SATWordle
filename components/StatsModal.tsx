"use client";

import { GameStats } from "@/lib/storage";

interface StatsModalProps {
  stats: GameStats;
  onClose: () => void;
}

export default function StatsModal({ stats, onClose }: StatsModalProps) {
  const winPct = stats.played === 0 ? 0 : Math.round((stats.won / stats.played) * 100);
  const maxDist = Math.max(...Object.values(stats.guessDistribution), 1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-[#d3d6da] rounded-2xl w-full max-w-sm mx-4 p-6 flex flex-col gap-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="w-6" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#1a1a1b]">
            Statistics
          </h2>
          <button
            onClick={onClose}
            className="text-[#878a8c] hover:text-[#1a1a1b] transition-colors text-2xl leading-none w-6"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Summary numbers */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { value: stats.played,         label: "Played" },
            { value: winPct,               label: "Win %" },
            { value: stats.currentStreak,  label: "Current\nStreak" },
            { value: stats.maxStreak,      label: "Max\nStreak" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col">
              <span className="text-3xl font-black text-[#1a1a1b]">{value}</span>
              <span className="text-[10px] text-[#878a8c] leading-tight whitespace-pre-wrap mt-0.5">
                {label}
              </span>
            </div>
          ))}
        </div>

        <hr className="border-[#d3d6da]" />

        {/* Guess distribution */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#878a8c] mb-3 text-center">
            Guess Distribution
          </h3>
          {stats.played === 0 ? (
            <p className="text-center text-[#878a8c] text-sm">
              Complete a daily word to see your stats!
            </p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((n) => {
                const count = stats.guessDistribution[String(n)] ?? 0;
                const pct = Math.max(7, Math.round((count / maxDist) * 100));
                return (
                  <div key={n} className="flex items-center gap-2 text-sm">
                    <span className="w-4 text-right text-[#1a1a1b] font-bold">{n}</span>
                    <div className="flex-1 h-7 bg-[#f9f9f9] rounded-sm overflow-hidden">
                      <div
                        className="h-full flex items-center justify-end pr-2 font-bold text-white text-xs bar-fill rounded-sm"
                        style={{
                          "--bar-width": `${pct}%`,
                          backgroundColor: "#6aaa64",
                        } as React.CSSProperties}
                      >
                        {count}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
