"use client";

import { NeonButton } from "@/components/ui/neon-button";
import { motion } from "framer-motion";
import { Trophy, XCircle } from "lucide-react";

type ResultPanelProps = {
  correctCount: number;
  totalQuestions: number;
  endReason: string | null;
  xpEarned: number | null;
  onPlayAgain: () => void;
};

export function ResultPanel({
  correctCount,
  totalQuestions,
  endReason,
  xpEarned,
  onPlayAgain,
}: ResultPanelProps) {
  const won = endReason === "completed";
  const scorePct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full rounded-2xl border border-cyan-400/25 bg-slate-900/80 p-8 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
      >
        {won ? (
          <Trophy className="mx-auto h-12 w-12 text-amber-300" aria-hidden />
        ) : (
          <XCircle className="mx-auto h-12 w-12 text-rose-400" aria-hidden />
        )}
        <h2 className="mt-4 font-display text-2xl font-bold text-white">
          {won ? "Challenge complete!" : "Run ended"}
        </h2>
        <p className="mt-2 text-slate-400">
          {correctCount} / {totalQuestions} correct ({scorePct}%)
        </p>
        {xpEarned != null && xpEarned > 0 ? (
          <p className="mt-2 text-sm text-cyan-300">+{xpEarned} XP earned</p>
        ) : null}
        {!won && endReason === "tab_hidden" ? (
          <p className="mt-3 text-xs text-amber-200/90">You left the tab — the challenge was forfeited.</p>
        ) : null}
        <NeonButton className="mt-8 w-full" onClick={onPlayAgain}>
          Back to arena
        </NeonButton>
      </motion.div>
    </div>
  );
}
