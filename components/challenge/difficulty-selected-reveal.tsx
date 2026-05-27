"use client";

import { motion } from "framer-motion";

type DifficultySelectedRevealProps = {
  open: boolean;
  difficultyName: string | null;
};

/** Full-screen golden reveal after the roulette locks (auto-dismissed by parent). */
export function DifficultySelectedReveal({ open, difficultyName }: DifficultySelectedRevealProps) {
  if (!open || !difficultyName) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/92 p-6 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <p className="arcade-golden-intro font-display text-xs font-bold uppercase tracking-[0.3em] sm:text-sm">
          Difficulty selected
        </p>
        <p
          className="arcade-golden-hint font-display text-5xl font-bold uppercase tracking-[0.2em] sm:text-6xl md:text-7xl"
          aria-live="polite"
        >
          {difficultyName}
        </p>
      </motion.div>
    </div>
  );
}
