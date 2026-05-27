"use client";

import { PlayerNickname } from "@/components/player/player-nickname";
import { loginRedirectHref } from "@/lib/auth-config";
import { fetchLevelMessage } from "@/lib/level-message-api";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Ban, Crown, Loader2, Sparkles, Swords, Target } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const PREVIEW_LEVEL = 0;
const PREVIEW_TIER = "C";
const PREVIEW_CODENAME = "PlayerHub";

function EmptyStat({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center justify-center gap-1 font-display text-xl font-semibold text-slate-500 sm:justify-start",
        className,
      )}
      aria-label="No data yet"
    >
      <Ban className="h-5 w-5 shrink-0 opacity-70" aria-hidden />
    </p>
  );
}

export function PlayerHubPreview() {
  const [levelMessage, setLevelMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchLevelMessage(PREVIEW_LEVEL).then((msg) => {
      if (!cancelled) setLevelMessage(msg);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="player-hub" className="relative scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Your Player Hub{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              (preview)
            </span>
          </h2>
          <p className="mt-3 text-slate-400">
            <Link
              href={loginRedirectHref()}
              className="text-cyan-300 underline-offset-4 hover:text-cyan-200 hover:underline"
            >
              Sign in
            </Link>{" "}
            to sync your live progress—this card shows how your profile will look in-game.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className={cn(
            "relative mx-auto max-w-lg overflow-hidden rounded-2xl border border-cyan-500/25 bg-slate-900/60 p-8 shadow-[0_0_60px_rgba(34,211,238,0.12)] backdrop-blur-xl",
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.08),transparent_40%,rgba(139,92,246,0.08))]" />

          <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
            <div className="relative mb-6 sm:mb-0 sm:mr-8">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-cyan-400/50 bg-gradient-to-br from-slate-800 to-slate-900 shadow-[0_0_30px_rgba(34,211,238,0.25)]">
                <Crown className="h-14 w-14 text-cyan-400" aria-hidden />
              </div>
              <span className="absolute -bottom-2 -right-2 flex h-9 items-center rounded-lg bg-violet-600 px-2 text-xs font-bold text-white shadow-lg">
                {PREVIEW_TIER}
              </span>
            </div>
            <div className="min-w-0 flex-1 space-y-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest text-cyan-400/90">Codename</p>
                <PlayerNickname
                  nickname={PREVIEW_CODENAME}
                  level={PREVIEW_LEVEL}
                  className="font-display text-2xl font-bold text-white"
                />
              </div>
              <div className="grid min-w-0 grid-cols-2 gap-3">
                <div className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400 sm:justify-start">
                    <Target className="h-3.5 w-3.5 shrink-0 text-cyan-400" aria-hidden />
                    Score
                  </p>
                  <EmptyStat className="text-cyan-100/50" />
                </div>
                <div className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400 sm:justify-start">
                    <Swords className="h-3.5 w-3.5 shrink-0 text-violet-400" aria-hidden />
                    Wins
                  </p>
                  <EmptyStat className="text-violet-200/50" />
                </div>
              </div>
              <div className="flex w-full min-w-0 items-start justify-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-2.5 text-sm leading-snug text-amber-100 sm:justify-start">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
                {levelMessage ? (
                  <p className="min-w-0 flex-1 text-left break-words">{levelMessage}</p>
                ) : (
                  <p className="flex flex-1 items-center gap-2 text-left text-amber-100/70">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Loading message…
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
