"use client";

import type { ReactNode } from "react";

type IntroSequenceProps = {
  children: ReactNode;
};

/** Cinematic page entrance wrapper for the challenge arena lobby. */
export function IntroSequence({ children }: IntroSequenceProps) {
  return (
    <div className="relative flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center overflow-hidden pb-10 pt-8">
      {children}
      <p className="arcade-golden-intro pointer-events-none absolute inset-x-0 top-10 z-50 text-center font-display text-xs font-bold uppercase tracking-[0.26em] sm:top-12 sm:text-sm">
        Initializing challenge arena
      </p>
    </div>
  );
}
