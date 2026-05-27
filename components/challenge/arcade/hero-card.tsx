"use client";

import { useMouseTilt } from "@/hooks/use-mouse-tilt";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Shield, Sparkles } from "lucide-react";
import { useState } from "react";

const cardVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.88, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.35 },
  },
};

type HeroCardProps = {
  onStart: () => void;
  disabled?: boolean;
  onHoverSound?: () => void;
  onClickSound?: () => void;
};

/** Holographic hero card — click to enter the challenge. */
export function HeroCard({ onStart, disabled, onHoverSound, onClickSound }: HeroCardProps) {
  const { ref, onMouseMove, onMouseLeave } = useMouseTilt(14);
  const [hovered, setHovered] = useState(false);
  const [flash, setFlash] = useState(false);

  function handleClick() {
    if (disabled) return;
    onClickSound?.();
    setFlash(true);
    window.setTimeout(() => setFlash(false), 400);
    window.setTimeout(() => onStart(), 260);
  }

  function handleMouseLeave() {
    onMouseLeave();
    setHovered(false);
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="relative mx-auto w-[min(92vw,420px)] pt-10"
    >
      {/* Golden star — outside overflow so it stays visible */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-30 -translate-x-1/2"
        animate={{
          y: [0, -6, 0],
          rotate: [0, 12, -12, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/25 blur-xl" />
        <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300/35 blur-md" />
        <Sparkles
          className="relative h-12 w-12 text-amber-300 sm:h-14 sm:w-14"
          strokeWidth={1.6}
          style={{
            filter:
              "drop-shadow(0 0 12px rgba(251,191,36,1)) drop-shadow(0 0 28px rgba(251,191,36,0.75)) drop-shadow(0 0 48px rgba(245,158,11,0.45))",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute -inset-6 rounded-[2.5rem] bg-cyan-500/20 blur-3xl"
        animate={{ opacity: [0.35, 0.65, 0.35], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <ParticleRing />

      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => {
          setHovered(true);
          onHoverSound?.();
        }}
        className="relative"
      >
      <button
        type="button"
        disabled={disabled}
        aria-label="Click to start the challenge"
        onClick={handleClick}
        className={cn(
          "group arcade-hero-card relative block w-full text-left transition-transform duration-200 ease-out will-change-transform",
          "rounded-[1.75rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        )}
      >
          <div className="arcade-holo-border absolute -inset-[1px] rounded-[1.75rem]" />
          <div className="arcade-scanlines pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-30" />
          <div className="arcade-shine pointer-events-none absolute inset-0 rounded-[1.75rem]" />

          <div className="relative rounded-[1.75rem] border border-cyan-400/25 bg-gradient-to-b from-slate-800/90 via-slate-900/95 to-slate-950 px-8 py-12 shadow-[0_0_60px_rgba(34,211,238,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]">
            <motion.div
              className={cn(
                "pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-[1.75rem] bg-slate-950/55 backdrop-blur-[2px] transition-opacity duration-300",
                hovered && !disabled ? "opacity-100" : "opacity-0",
              )}
            >
              <motion.p
                initial={false}
                animate={hovered && !disabled ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                className="arcade-golden-hint px-6 text-center font-display text-sm font-bold uppercase tracking-[0.18em] sm:text-base"
              >
                Click to start the challenge
              </motion.p>
            </motion.div>

            <div className="arcade-hud-corner absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-cyan-400/50" />
            <div className="arcade-hud-corner absolute right-3 top-3 h-6 w-6 border-r-2 border-t-2 border-cyan-400/50" />
            <div className="arcade-hud-corner absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2 border-violet-400/50" />
            <div className="arcade-hud-corner absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 border-violet-400/50" />

            <div className="flex flex-col items-center gap-4 text-center">
              <motion.div
                className="relative flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-600 shadow-[0_0_40px_rgba(139,92,246,0.55)]"
                animate={{
                  boxShadow: [
                    "0 0 32px rgba(34,211,238,0.45)",
                    "0 0 48px rgba(167,139,250,0.65)",
                    "0 0 32px rgba(34,211,238,0.45)",
                  ],
                }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Shield className="h-16 w-16 text-slate-950" strokeWidth={1.4} />
                <motion.span
                  className="absolute inset-0 rounded-2xl ring-2 ring-cyan-200/30"
                  animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              <motion.p
                className="font-display text-3xl font-bold uppercase tracking-[0.22em] text-transparent sm:text-4xl"
                style={{
                  backgroundImage: "linear-gradient(90deg, #a5f3fc, #e9d5ff, #67e8f9, #c4b5fd)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
                animate={{ backgroundPosition: ["0% center", "200% center"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                Challenge Mode
              </motion.p>

              <motion.p
                initial={{ opacity: 0, letterSpacing: "0.05em" }}
                animate={{ opacity: 1, letterSpacing: "0.35em" }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="text-[10px] uppercase text-violet-200/75 sm:text-xs"
              >
                English arena champion
              </motion.p>

              <motion.div
                className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-widest text-cyan-400/70"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                System online
              </motion.div>
            </div>
          </div>
      </button>
      </motion.div>

      {flash ? (
        <motion.div
          initial={{ opacity: 0.55 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none fixed inset-0 z-[200] bg-amber-200/20 mix-blend-screen"
        />
      ) : null}
    </motion.div>
  );
}

function ParticleRing() {
  return (
    <>
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[calc(50%+1.25rem)] h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20"
        animate={{ rotate: 360, scale: [1, 1.03, 1] }}
        transition={{
          rotate: { duration: 24, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity },
        }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[calc(50%+1.25rem)] h-[96%] w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-violet-400/15"
        animate={{ rotate: -360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      />
    </>
  );
}
