"use client";

import { motion } from "framer-motion";

/** Sci-fi arena backdrop: grid, mist, parallax lines — CSS-only for performance. */
export function AnimatedBackground() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="arcade-grid absolute inset-0 opacity-40" />
      <motion.div
        className="absolute -left-1/4 top-1/4 h-[60%] w-[70%] rounded-full bg-cyan-500/10 blur-[100px]"
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-1/4 bottom-1/4 h-[50%] w-[60%] rounded-full bg-violet-600/12 blur-[90px]"
        animate={{ x: [0, -35, 25, 0], y: [0, 25, -15, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,7,18,0.85)_72%)]" />

      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="arcade-scifi-line absolute h-px w-[140%] bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent"
          style={{ top: `${22 + i * 28}%`, left: "-20%" }}
          animate={{ x: ["0%", "8%", "0%"], opacity: [0.15, 0.45, 0.15] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
        />
      ))}

      {Array.from({ length: 12 }, (_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white/80"
          style={{
            width: 1 + (i % 2),
            height: 1 + (i % 2),
            left: `${(i * 17 + 5) % 100}%`,
            top: `${(i * 29 + 11) % 100}%`,
          }}
          animate={{ opacity: [0.1, 0.7, 0.1], scale: [1, 1.8, 1] }}
          transition={{
            duration: 2.5 + (i % 4),
            repeat: Infinity,
            delay: i * 0.35,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}
