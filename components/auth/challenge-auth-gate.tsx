"use client";

import { ChallengeAudioProvider } from "@/components/challenge/challenge-audio-provider";
import { appHomeHref } from "@/lib/auth-config";
import { useAuth } from "@/lib/auth-provider";
import { verifyAccessToken } from "@/lib/session-api";
import { useEffect, useState } from "react";

type Phase = "checking" | "ready";

export function ChallengeAuthGate({ children }: { children: React.ReactNode }) {
  const { accessToken, loading, clearSession } = useAuth();
  const [phase, setPhase] = useState<Phase>("checking");

  useEffect(() => {
    if (loading) return;

    if (!accessToken) {
      window.location.href = appHomeHref();
      return;
    }

    let cancelled = false;
    setPhase("checking");
    void verifyAccessToken(accessToken).then((ok) => {
      if (cancelled) return;
      if (!ok) {
        clearSession();
        window.location.href = appHomeHref();
        return;
      }
      setPhase("ready");
    });

    return () => {
      cancelled = true;
    };
  }, [loading, accessToken, clearSession]);

  if (loading) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-slate-400">
        Checking session…
      </main>
    );
  }

  if (!accessToken) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-slate-400">
        Redirecting…
      </main>
    );
  }

  const content =
    phase !== "ready" ? (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-slate-400">
        Checking session…
      </div>
    ) : (
      children
    );

  return (
    <main className="flex-1">
      <ChallengeAudioProvider>{content}</ChallengeAudioProvider>
    </main>
  );
}
