"use client";

import type { Difficulty } from "@/lib/challenge-schemas";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const SPIN_MS = 2600;

const CARD_THEMES = [
  { border: "border-cyan-400/60", glow: "shadow-[0_0_18px_rgba(34,211,238,0.55)]", text: "text-cyan-100" },
  { border: "border-violet-400/60", glow: "shadow-[0_0_18px_rgba(167,139,250,0.55)]", text: "text-violet-100" },
  { border: "border-fuchsia-400/60", glow: "shadow-[0_0_18px_rgba(236,72,153,0.5)]", text: "text-fuchsia-100" },
  { border: "border-emerald-400/60", glow: "shadow-[0_0_18px_rgba(52,211,153,0.45)]", text: "text-emerald-100" },
  { border: "border-amber-400/60", glow: "shadow-[0_0_18px_rgba(251,191,36,0.45)]", text: "text-amber-100" },
  { border: "border-indigo-400/60", glow: "shadow-[0_0_18px_rgba(99,102,241,0.5)]", text: "text-indigo-100" },
] as const;

const ORBIT_RADIUS = 152;
const WHEEL_SIZE = "min(90vw, 400px)";

type DifficultyWheelProps = {
  open: boolean;
  difficulties: Difficulty[];
  targetDifficultyId: number | null;
  onSpinComplete?: () => void;
};

function DifficultyMiniCard({
  name,
  active,
  themeIndex,
}: {
  name: string;
  active: boolean;
  themeIndex: number;
}) {
  const theme = CARD_THEMES[themeIndex % CARD_THEMES.length]!;
  return (
    <div
      className={cn(
        "flex h-12 w-[3.25rem] items-center justify-center rounded-lg border bg-slate-950/90 font-display text-sm font-bold uppercase tracking-wide transition-all duration-150",
        theme.border,
        theme.text,
        active ? cn("scale-110", theme.glow, "bg-slate-800/95") : "scale-95 opacity-55",
      )}
    >
      {name}
    </div>
  );
}

export function DifficultyWheel({
  open,
  difficulties,
  targetDifficultyId,
  onSpinComplete,
}: DifficultyWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const count = Math.max(difficulties.length, 1);
  const segmentAngle = 360 / count;

  const targetIndex = useMemo(() => {
    if (!targetDifficultyId) return 0;
    const idx = difficulties.findIndex((d) => d.id === targetDifficultyId);
    return idx >= 0 ? idx : 0;
  }, [difficulties, targetDifficultyId]);

  const target = difficulties[targetIndex];

  useEffect(() => {
    if (!open || !targetDifficultyId || difficulties.length === 0) return;

    setSpinning(true);
    setHighlightIndex(0);
    const fullSpins = 5;
    const finalRotation = fullSpins * 360 - targetIndex * segmentAngle;
    setRotation(finalRotation);

    const start = performance.now();
    let tick = 0;
    let interval = 70;

    const pulse = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const progress = Math.min(1, elapsed / SPIN_MS);
      interval = 70 + Math.floor(progress * progress * 220);
      tick += 1;
      if (progress < 0.82) {
        setHighlightIndex(tick % count);
      } else {
        setHighlightIndex(targetIndex);
      }
    }, 70);

    const done = window.setTimeout(() => {
      window.clearInterval(pulse);
      setHighlightIndex(targetIndex);
      setSpinning(false);
      onSpinComplete?.();
    }, SPIN_MS);

    return () => {
      window.clearInterval(pulse);
      window.clearTimeout(done);
    };
  }, [open, targetDifficultyId, difficulties.length, targetIndex, segmentAngle, count, onSpinComplete]);

  if (!open) return null;

  if (!targetDifficultyId) {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md">
        <p className="font-display animate-pulse text-lg uppercase tracking-[0.25em] text-cyan-200">
          Loading arena…
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md">
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-5">
        <p className="arcade-golden-intro text-center font-display text-xs font-bold uppercase tracking-[0.28em] sm:text-sm">
          Selecting a random difficulty
        </p>

        <div
          className="relative flex items-center justify-center"
          style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
        >
          <motion.div
            className="arcade-gear-teeth pointer-events-none absolute inset-0 rounded-full"
            animate={{ rotate: spinning ? -360 : 0 }}
            transition={
              spinning
                ? { duration: 18, repeat: Infinity, ease: "linear" }
                : { duration: 0.3 }
            }
          />

          <div
            className="pointer-events-none absolute inset-[10%] rounded-full border-2 border-cyan-400/25 bg-slate-950/40 shadow-[inset_0_0_40px_rgba(34,211,238,0.08)]"
            aria-hidden
          />

          <div
            className="pointer-events-none absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-[2px]"
            aria-hidden
          >
            <div
              className="h-0 w-0 border-x-[11px] border-b-[18px] border-x-transparent border-b-cyan-300"
              style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.9))" }}
            />
          </div>

          <motion.div
            className="absolute inset-0"
            animate={{ rotate: rotation }}
            transition={{ duration: SPIN_MS / 1000, ease: [0.12, 0.78, 0.14, 1] }}
          >
            {difficulties.map((d, i) => {
              const angleDeg = i * segmentAngle - 90;
              const angleRad = (angleDeg * Math.PI) / 180;
              const x = Math.cos(angleRad) * ORBIT_RADIUS;
              const y = Math.sin(angleRad) * ORBIT_RADIUS;
              const atPointer = !spinning && i === targetIndex;
              const pulsing = spinning && i === highlightIndex;

              return (
                <div
                  key={d.id}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  }}
                >
                  <DifficultyMiniCard
                    name={d.name}
                    active={atPointer || pulsing}
                    themeIndex={i}
                  />
                </div>
              );
            })}
          </motion.div>

          <div
            className="relative z-20 flex h-20 w-20 items-center justify-center"
            aria-hidden
          >
            <div className="arcade-gear-hub absolute inset-0" />
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-cyan-400/40 bg-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
              <span className="font-display text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300/90">
                {spinning ? "RNG" : "OK"}
              </span>
            </div>
          </div>
        </div>

        <div className="min-h-[3.5rem] text-center">
          <motion.p
            key={spinning ? "spin" : target?.id}
            className="font-display text-2xl font-bold uppercase tracking-[0.22em] text-cyan-100 sm:text-3xl"
            initial={{ opacity: 0.5, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {spinning ? difficulties[highlightIndex]?.name ?? "…" : (target?.name ?? "—")}
          </motion.p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-slate-500">
            {spinning ? "Scanning difficulties…" : "Difficulty locked"}
          </p>
        </div>
      </div>
    </div>
  );
}
