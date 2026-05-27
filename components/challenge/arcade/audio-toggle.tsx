"use client";

import { Volume2, VolumeX } from "lucide-react";

type AudioToggleProps = {
  enabled: boolean;
  onToggle: () => void;
};

export function AudioToggle({ enabled, onToggle }: AudioToggleProps) {
  return (
    <button
      type="button"
      aria-label={enabled ? "Turn audio off" : "Turn audio on"}
      onClick={onToggle}
      className="arcade-audio-toggle fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-amber-400/35 bg-slate-950/85 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-amber-200/90 shadow-[0_0_24px_rgba(251,191,36,0.2)] backdrop-blur-md transition hover:border-amber-300/60 hover:text-amber-100 hover:shadow-[0_0_32px_rgba(251,191,36,0.35)]"
    >
      {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      Audio {enabled ? "on" : "off"}
    </button>
  );
}
