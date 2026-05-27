"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 23) % 100}%`,
        duration: 14 + (i % 8),
        delay: (i % 6) * 0.4,
        size: 2 + (i % 3),
      })),
    [],
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-cyan-400/35 blur-[0.5px]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 8, -18, 0],
            opacity: [0.15, 0.55, 0.25, 0.45, 0.15],
            scale: [1, 1.4, 0.9, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.08),transparent_50%)]" />
    </div>
  );
}
