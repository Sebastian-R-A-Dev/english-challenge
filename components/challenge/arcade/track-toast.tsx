"use client";

import { Music } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type TrackToastProps = {
  label: string | null;
};

export function TrackToast({ label }: TrackToastProps) {
  return (
    <AnimatePresence>
      {label ? (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none fixed bottom-20 left-1/2 z-50 -translate-x-1/2"
        >
          <motion.div
            className="flex items-center gap-2 rounded-full border border-amber-400/40 bg-slate-950/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-amber-100 shadow-[0_0_24px_rgba(251,191,36,0.25)] backdrop-blur-md"
            animate={{ opacity: [1, 1, 0.85] }}
            transition={{ duration: 4, ease: "easeOut" }}
          >
            <Music className="h-3.5 w-3.5 text-amber-300" aria-hidden />
            {label}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
