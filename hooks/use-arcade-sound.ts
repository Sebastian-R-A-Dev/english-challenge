"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "english-challenge-arcade-sound";

function playTone(freq: number, durationMs: number, volume = 0.04) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + durationMs / 1000 + 0.02);
    osc.onended = () => void ctx.close();
  } catch {
    /* ignore */
  }
}

function readEnabledPreference(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === null) return true;
    return v === "1";
  } catch {
    return true;
  }
}

/** SFX toggle state (music playlist lives in useSoundtrackPlaylist). */
export function useArcadeSound() {
  const [enabled, setEnabledState] = useState(true);

  useEffect(() => {
    const next = readEnabledPreference();
    setEnabledState(next);
    if (next) {
      try {
        if (localStorage.getItem(STORAGE_KEY) === null) {
          localStorage.setItem(STORAGE_KEY, "1");
        }
      } catch {
        /* ignore */
      }
    }
  }, []);

  const setEnabled = useCallback(
    (next: boolean) => {
      setEnabledState(next);
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
    },
    [],
  );

  const playHover = useCallback(() => {
    if (!enabled) return;
    playTone(880, 60, 0.035);
  }, [enabled]);

  const playClick = useCallback(() => {
    if (!enabled) return;
    playTone(520, 90, 0.05);
    window.setTimeout(() => playTone(780, 70, 0.04), 40);
  }, [enabled]);

  const playPowerUp = useCallback(() => {
    if (!enabled) return;
    playTone(440, 80, 0.04);
    window.setTimeout(() => playTone(660, 80, 0.04), 70);
    window.setTimeout(() => playTone(880, 120, 0.05), 140);
  }, [enabled]);

  return { enabled, setEnabled, playHover, playClick, playPowerUp };
}
