"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type ParticleLayerProps = {
  className?: string;
};

/** Lightweight orbiting neon particles around the hero card. */
export function ParticleLayer({ className }: ParticleLayerProps) {
  const orbiters = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        radius: 118 + (i % 4) * 22,
        duration: 8 + (i % 5) * 1.6,
        delay: i * 0.25,
        size: 3 + (i % 3),
        color: i % 2 === 0 ? "bg-cyan-400/70" : "bg-violet-400/60",
      })),
    [],
  );

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-[38%] h-0 w-0 -translate-x-1/2 -translate-y-1/2 ${className ?? ""}`}
    >
      {orbiters.map((o) => (
        <motion.span
          key={o.id}
          className={`absolute rounded-full blur-[0.5px] shadow-[0_0_8px_rgba(34,211,238,0.6)] ${o.color}`}
          style={{ width: o.size, height: o.size, marginLeft: -o.size / 2, marginTop: -o.size / 2 }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: o.duration,
            repeat: Infinity,
            ease: "linear",
            delay: o.delay,
          }}
        >
          <motion.span
            className={`block rounded-full ${o.color}`}
            style={{
              width: o.size,
              height: o.size,
              transform: `translateX(${o.radius}px)`,
            }}
            animate={{ opacity: [0.35, 0.95, 0.35], scale: [0.85, 1.15, 0.85] }}
            transition={{
              duration: o.duration * 0.45,
              repeat: Infinity,
              ease: "easeInOut",
              delay: o.delay,
            }}
          />
        </motion.span>
      ))}
    </div>
  );
}
