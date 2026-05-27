"use client";

import { forfeitChallenge, type ForfeitReason } from "@/lib/challenge-api";
import { useChallengeStore } from "@/store/challenge-store";
import { useEffect, useRef } from "react";

/** Ends the run if the user hides the tab or tries to leave mid-challenge. */
export function useChallengeAbandonGuard(accessToken: string | null) {
  const isRunActive = useChallengeStore((s) => s.isRunActive);
  const forfeitInFlight = useRef(false);

  useEffect(() => {
    if (!accessToken || !isRunActive) return;

    async function abandon(reason: ForfeitReason) {
      if (forfeitInFlight.current) return;
      forfeitInFlight.current = true;
      try {
        await forfeitChallenge(accessToken!, reason);
      } catch {
        /* session may already be closed */
      } finally {
        useChallengeStore.getState().endRun(reason);
        forfeitInFlight.current = false;
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") {
        void abandon("tab_hidden");
      }
    }

    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [accessToken, isRunActive]);
}

/** Intercepts in-app link navigation during an active run. */
export function useChallengeNavigationGuard() {
  const isRunActive = useChallengeStore((s) => s.isRunActive);
  const setExitPrompt = useChallengeStore((s) => s.setExitPrompt);

  useEffect(() => {
    if (!isRunActive) return;

    function onClick(e: MouseEvent) {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
      if (anchor.target === "_blank") {
        e.preventDefault();
        setExitPrompt(true, href);
        return;
      }
      if (href.startsWith("/") || href.startsWith("http")) {
        e.preventDefault();
        setExitPrompt(true, href);
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [isRunActive, setExitPrompt]);
}
