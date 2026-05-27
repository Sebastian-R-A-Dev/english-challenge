"use client";

import { NeonButton } from "@/components/ui/neon-button";
import { loginRedirectHref } from "@/lib/auth-config";
import { useAuth } from "@/lib/auth-provider";
import { motion } from "framer-motion";
import { ChevronRight, LogIn, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();
  const { accessToken } = useAuth();

  function goChallenge() {
    router.push("/challenge");
  }

  function goLogin() {
    window.location.href = loginRedirectHref();
  }

  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 sm:pb-28 sm:pt-16 lg:px-8 lg:pt-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.25),transparent)]" />
      <div className="pointer-events-none absolute right-[-10%] top-1/4 h-72 w-72 rounded-full bg-violet-600/20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-[-5%] h-64 w-64 rounded-full bg-cyan-500/15 blur-[90px]" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-cyan-200"
        >
          <Trophy className="h-3.5 w-3.5 text-amber-400" aria-hidden />
          Competitive English Arena
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.05 }}
          className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Become the{" "}
          <span className="relative whitespace-nowrap">
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">
              Ultimate English Master
            </span>
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-cyan-400/0 via-cyan-400/80 to-violet-500/0 blur-sm"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl"
        >
          Improve your English while climbing the global ranking. Test your skills and dominate the
          leaderboard—only legends reach the top.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="mt-10 flex w-full flex-col items-stretch justify-center gap-4 sm:w-auto sm:flex-row sm:items-center"
        >
          <NeonButton type="button" className="min-h-[52px] px-10 text-base" onClick={goChallenge}>
            <span>Start Challenge</span>
            <ChevronRight className="h-5 w-5 shrink-0" aria-hidden />
          </NeonButton>
          {!accessToken ? (
            <NeonButton type="button" variant="ghost" className="min-h-[52px] px-10 text-base" onClick={goLogin}>
              <LogIn className="h-5 w-5 shrink-0" aria-hidden />
              <span>Login</span>
            </NeonButton>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
