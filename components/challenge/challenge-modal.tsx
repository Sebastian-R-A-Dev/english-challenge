"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type ChallengeModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function ChallengeModal({ open, title, children, footer, className }: ChallengeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className={cn(
          "relative z-10 w-full max-w-lg rounded-2xl border border-cyan-400/30 bg-slate-900/95 p-6 shadow-[0_0_48px_rgba(34,211,238,0.2)]",
          className,
        )}
      >
        <h2 className="font-display text-xl font-bold tracking-wide text-white">{title}</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">{children}</div>
        {footer ? <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div> : null}
      </motion.div>
    </div>
  );
}
