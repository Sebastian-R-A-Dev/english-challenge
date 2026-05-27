"use client";

import { PlayerHubPreview } from "@/components/player/player-preview";
import { PlayerNickname } from "@/components/player/player-nickname";
import { fetchPlayerMe, type PlayerMe } from "@/lib/player-api";
import { useAuth } from "@/lib/auth-provider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Crown, Loader2, Sparkles, Swords, Target } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

function formatNum(n: number): string {
  return n.toLocaleString("en-US");
}

function TruncatedStat({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const text = formatNum(value);
  return (
    <p className={cn("min-w-0 truncate font-display text-xl font-semibold", className)} title={text}>
      {text}
    </p>
  );
}

export function PlayerHub() {
  const { accessToken, loading: authLoading } = useAuth();
  const [player, setPlayer] = useState<PlayerMe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !accessToken) {
      setPlayer(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    void fetchPlayerMe(accessToken).then((data) => {
      if (cancelled) return;
      if (!data) {
        setPlayer(null);
        setError("Could not load your profile.");
      } else {
        setPlayer(data);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [accessToken, authLoading]);

  if (authLoading) {
    return (
      <section id="player-hub" className="relative scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Your Player Hub</h2>
            <p className="mt-3 text-slate-400">Your live progress synced from English Challenge.</p>
          </div>
          <div
            className={cn(
              "relative mx-auto flex max-w-lg flex-col items-center justify-center gap-3 rounded-2xl border border-cyan-500/25 bg-slate-900/60 py-16 shadow-[0_0_60px_rgba(34,211,238,0.12)] backdrop-blur-xl",
            )}
          >
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" aria-hidden />
            <p className="text-sm text-slate-400">Checking session…</p>
          </div>
        </div>
      </section>
    );
  }

  if (!accessToken) {
    return <PlayerHubPreview />;
  }

  const nickname = player?.profile?.nickname ?? "Pilot";
  const avatarUrl = player?.profile?.avatar_url;

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
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Your Player Hub</h2>
          <p className="mt-3 text-slate-400">Your live progress synced from English Challenge.</p>
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

          {loading ? (
            <div className="relative flex flex-col items-center justify-center gap-3 py-12 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400" aria-hidden />
              <p className="text-sm">Loading your stats…</p>
            </div>
          ) : error || !player ? (
            <p className="relative text-center text-sm text-red-300" role="alert">
              {error ?? "Profile unavailable."}
            </p>
          ) : (
            <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
              <div className="relative mb-6 sm:mb-0 sm:mr-8">
                <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-cyan-400/50 bg-gradient-to-br from-slate-800 to-slate-900 shadow-[0_0_30px_rgba(34,211,238,0.25)]">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="112px"
                      unoptimized
                    />
                  ) : (
                    <Crown className="h-14 w-14 text-cyan-400" aria-hidden />
                  )}
                </div>
                <span className="absolute -bottom-2 -right-2 flex h-9 items-center rounded-lg bg-violet-600 px-2 text-xs font-bold text-white shadow-lg">
                  {player.progress.tier_label}
                </span>
              </div>
              <div className="min-w-0 flex-1 space-y-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest text-cyan-400/90">Codename</p>
                  <PlayerNickname
                    nickname={nickname}
                    level={player.progress.level}
                    className="font-display text-2xl font-bold"
                    truncate
                  />
                </div>
                <div className="grid min-w-0 grid-cols-2 gap-3">
                  <div className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400 sm:justify-start">
                      <Target className="h-3.5 w-3.5 shrink-0 text-cyan-400" aria-hidden />
                      Score
                    </p>
                    <TruncatedStat
                      value={player.progress.total_score}
                      className="text-cyan-100"
                    />
                  </div>
                  <div className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400 sm:justify-start">
                      <Swords className="h-3.5 w-3.5 shrink-0 text-violet-400" aria-hidden />
                      Wins
                    </p>
                    <TruncatedStat value={player.progress.wins} className="text-violet-200" />
                  </div>
                </div>
                <div className="flex w-full min-w-0 items-start justify-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-2.5 text-sm leading-snug text-amber-100 sm:justify-start">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
                  <p className="min-w-0 flex-1 text-left break-words">
                    {player.progress.level_message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
