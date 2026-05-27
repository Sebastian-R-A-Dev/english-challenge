"use client";

import { NeonButton } from "@/components/ui/neon-button";
import { postLogout } from "@/lib/auth-logout";
import { appHomeHref, loginRedirectHref } from "@/lib/auth-config";
import { useAuth } from "@/lib/auth-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { CircleUserRound, LogIn, LogOut, Zap } from "lucide-react";
import { useState } from "react";

function playHoverTick() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.07);
    osc.onended = () => ctx.close();
  } catch {
    /* ignore */
  }
}

function scrollToPlayerHub() {
  document.getElementById("player-hub")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function SiteHeader() {
  const { accessToken, loading, clearSession } = useAuth();
  const [logoutBusy, setLogoutBusy] = useState(false);

  function goLogin() {
    window.location.href = loginRedirectHref();
  }

  async function handleLogout() {
    if (logoutBusy) return;
    setLogoutBusy(true);
    try {
      await postLogout();
    } catch {
      /* still clear client state and leave challenge */
    } finally {
      clearSession();
      setLogoutBusy(false);
      window.location.href = appHomeHref();
    }
  }

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "sticky top-0 z-50 border-b border-cyan-500/15 bg-slate-950/70 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 font-display text-lg font-bold tracking-tight text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            <Zap className="h-5 w-5 text-slate-950" aria-hidden />
          </span>
          <span className="bg-gradient-to-r from-cyan-200 to-violet-300 bg-clip-text text-transparent">
            English Challenge
          </span>
        </Link>

        {loading ? (
          <div className="h-10 w-28 animate-pulse rounded-xl bg-white/10" aria-hidden />
        ) : accessToken ? (
          <div className="flex items-center gap-2">
            <NeonButton
              variant="ghost"
              type="button"
              className="px-3 py-2.5 sm:px-3"
              aria-label="Ver tu perfil de jugador"
              onClick={scrollToPlayerHub}
            >
              <CircleUserRound className="h-5 w-5 shrink-0" aria-hidden />
            </NeonButton>
            <NeonButton
              variant="ghost"
              type="button"
              className="px-3 py-2.5 sm:px-3"
              disabled={logoutBusy}
              aria-label="Cerrar sesión"
              onClick={() => void handleLogout()}
            >
              <LogOut className="h-5 w-5 shrink-0" aria-hidden />
            </NeonButton>
          </div>
        ) : (
          <NeonButton
            variant="ghost"
            type="button"
            className="px-5 py-2.5 text-xs sm:text-sm"
            onMouseEnter={playHoverTick}
            aria-label="Iniciar sesión"
            onClick={goLogin}
          >
            <LogIn className="h-4 w-4 shrink-0" aria-hidden />
            <span>Login</span>
          </NeonButton>
        )}
      </div>
    </motion.header>
  );
}
