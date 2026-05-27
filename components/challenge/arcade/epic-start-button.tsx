"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Zap } from "lucide-react";
import { useCallback, useState, type MouseEvent } from "react";

type EpicStartButtonProps = {
  onStart: () => void;
  disabled?: boolean;
  onHoverSound?: () => void;
  onClickSound?: () => void;
  onPowerUpSound?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
};

export function EpicStartButton({
  onStart,
  disabled,
  onHoverSound,
  onClickSound,
  onPowerUpSound,
  soundEnabled,
  onToggleSound,
}: EpicStartButtonProps) {
  const [flash, setFlash] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClickSound?.();
      onPowerUpSound?.();

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((r) => [...r, { id, x, y }]);
      window.setTimeout(() => setRipples((r) => r.filter((rip) => rip.id !== id)), 700);

      setFlash(true);
      window.setTimeout(() => setFlash(false), 450);

      window.setTimeout(() => onStart(), 280);
    },
    [disabled, onClickSound, onPowerUpSound, onStart],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.85, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-md px-4"
    >
      {onToggleSound ? (
        <button
          type="button"
          aria-label={soundEnabled ? "Disable sound effects" : "Enable sound effects"}
          onClick={onToggleSound}
          className="absolute -top-12 right-4 flex items-center gap-1.5 rounded-full border border-cyan-500/25 bg-slate-900/80 px-3 py-1.5 text-[10px] uppercase tracking-wider text-cyan-300/80 transition hover:border-cyan-400/50 hover:text-cyan-200"
        >
          {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          SFX {soundEnabled ? "on" : "off"}
        </button>
      ) : null}

      <motion.button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        onMouseEnter={onHoverSound}
        whileHover={{ scale: disabled ? 1 : 1.03 }}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
        className={cn(
          "arcade-epic-btn group relative w-full overflow-hidden rounded-2xl px-8 py-4",
          "bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500",
          "text-sm font-bold uppercase tracking-[0.2em] text-slate-950",
          "shadow-[0_0_40px_rgba(34,211,238,0.45)]",
          "disabled:pointer-events-none disabled:opacity-40",
        )}
      >
        <span
          aria-hidden
          className="arcade-btn-charge pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
        />
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          <Zap className="h-5 w-5" aria-hidden />
          Start the Challenge
        </span>

        {ripples.map((r) => (
          <span
            key={r.id}
            className="arcade-ripple pointer-events-none absolute rounded-full bg-white/40"
            style={{ left: r.x, top: r.y, width: 8, height: 8, marginLeft: -4, marginTop: -4 }}
          />
        ))}

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity group-hover:opacity-60"
          style={{
            background: "linear-gradient(90deg, rgba(34,211,238,0.6), rgba(167,139,250,0.6))",
          }}
        />
      </motion.button>

      {flash ? (
        <motion.div
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="pointer-events-none fixed inset-0 z-[200] bg-cyan-300/25 mix-blend-screen"
        />
      ) : null}
    </motion.div>
  );
}
