"use client";

import { PlayerNickname } from "@/components/player/player-nickname";
import { fetchLeaderboard } from "@/lib/leaderboard-api";
import type { RankingRow } from "@/types/ranking";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2, Medal } from "lucide-react";
import { useEffect, useState } from "react";

function rankStyles(position: number) {
  if (position === 1)
    return "border-amber-400/40 bg-gradient-to-r from-amber-500/15 to-transparent shadow-[0_0_28px_rgba(251,191,36,0.15)]";
  if (position === 2)
    return "border-slate-300/35 bg-gradient-to-r from-slate-400/15 to-transparent shadow-[0_0_24px_rgba(148,163,184,0.12)]";
  if (position === 3)
    return "border-amber-700/40 bg-gradient-to-r from-orange-700/15 to-transparent shadow-[0_0_24px_rgba(180,83,9,0.12)]";
  return "border-white/8 bg-slate-950/40 hover:border-cyan-400/25 hover:bg-cyan-500/5";
}

function RankBadge({ position }: { position: number }) {
  if (position <= 3) {
    const colors =
      position === 1
        ? "text-amber-300"
        : position === 2
          ? "text-slate-200"
          : "text-orange-400";
    return (
      <span className={cn("inline-flex items-center gap-1 font-display font-bold", colors)}>
        <Medal className="h-4 w-4" aria-hidden />
        {position}
      </span>
    );
  }
  return <span className="font-mono text-slate-400">{position}</span>;
}

export function RankingTable() {
  const [rows, setRows] = useState<RankingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetchLeaderboard(10).then((data) => {
      if (!cancelled) {
        setRows(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="ranking" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/35 to-transparent" />
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Global leaderboard
          </h2>
          <p className="mt-3 text-slate-400">
            Top 10 pilots — ranked by wins, then total score.
          </p>
        </motion.div>

        <div className="overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-900/40 shadow-[0_0_50px_rgba(139,92,246,0.08)] backdrop-blur-xl">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-400" aria-hidden />
                <p className="text-sm">Loading leaderboard…</p>
              </div>
            ) : rows.length === 0 ? (
              <p className="px-6 py-16 text-center text-sm text-slate-400">
                No players on the board yet. Be the first to complete a challenge.
              </p>
            ) : (
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-950/80 text-xs uppercase tracking-wider text-cyan-200/90">
                    <th scope="col" className="px-4 py-4 font-semibold sm:px-6">
                      Position
                    </th>
                    <th scope="col" className="px-4 py-4 font-semibold sm:px-6">
                      Player
                    </th>
                    <th scope="col" className="px-4 py-4 font-semibold sm:px-6">
                      Level
                    </th>
                    <th scope="col" className="px-4 py-4 font-semibold sm:px-6">
                      Score
                    </th>
                    <th scope="col" className="px-4 py-4 font-semibold sm:px-6">
                      Wins
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <motion.tr
                      key={`${row.position}-${row.player}`}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className={cn(
                        "border-b border-white/5 transition-colors last:border-b-0",
                        rankStyles(row.position),
                      )}
                    >
                      <td className="px-4 py-4 sm:px-6">
                        <RankBadge position={row.position} />
                      </td>
                      <td className="max-w-[10rem] px-4 py-4 font-medium sm:max-w-[14rem] sm:px-6">
                    <PlayerNickname
                      nickname={row.player}
                      level={row.player_level}
                      className="font-medium"
                      truncate
                    />
                  </td>
                      <td className="px-4 py-4">
                        <span className="rounded-md border border-violet-400/30 bg-violet-500/15 px-2 py-0.5 text-xs font-semibold text-violet-200">
                          {row.level_label}
                        </span>
                      </td>
                    <td className="max-w-[8rem] px-4 py-4 font-mono text-cyan-100 sm:max-w-[10rem] sm:px-6">
                      <span
                        className="block truncate"
                        title={row.score.toLocaleString("en-US")}
                      >
                        {row.score.toLocaleString("en-US")}
                      </span>
                    </td>
                    <td className="max-w-[5rem] px-4 py-4 text-slate-300 sm:px-6">
                      <span className="block truncate" title={String(row.wins)}>
                        {row.wins.toLocaleString("en-US")}
                      </span>
                    </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </section>
  );
}
