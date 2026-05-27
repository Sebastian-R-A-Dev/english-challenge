"use client";

import { fetchAppAudios, type AppAudioTrack } from "@/lib/audios-api";
import { useCallback, useEffect, useRef, useState } from "react";

const TOAST_MS = 4000;
const MUSIC_VOLUME = 0.5;
const AUTOPLAY_RETRY_MS = 1200;
const AUTOPLAY_RETRY_MAX = 30;

function waitForAudioReady(audio: HTMLAudioElement): Promise<void> {
  if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const done = () => {
      audio.removeEventListener("canplay", done);
      audio.removeEventListener("error", done);
      resolve();
    };
    audio.addEventListener("canplay", done, { once: true });
    audio.addEventListener("error", done, { once: true });
  });
}

async function tryPlayAudio(audio: HTMLAudioElement): Promise<boolean> {
  try {
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

export function useSoundtrackPlaylist(accessToken: string | null, enabled: boolean) {
  const [trackLabel, setTrackLabel] = useState<string | null>(null);
  const tracksRef = useRef<AppAudioTrack[]>([]);
  const indexRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fetchStartedRef = useRef(false);
  const enabledRef = useRef(enabled);
  const autoplayRetriesRef = useRef(0);

  enabledRef.current = enabled;

  const flashTrackLabel = useCallback((name: string) => {
    setTrackLabel(name);
  }, []);

  const resumePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!enabledRef.current || !audio?.src) return false;
    if (!audio.paused) return true;
    return tryPlayAudio(audio);
  }, []);

  const playAtIndexRef = useRef<(index: number) => Promise<void>>(async () => {});

  const playAtIndex = useCallback(
    async (index: number) => {
      if (!enabledRef.current) return;
      const tracks = tracksRef.current;
      if (tracks.length === 0) return;

      const track = tracks[index % tracks.length];
      indexRef.current = index % tracks.length;

      let audio = audioRef.current;
      if (!audio) {
        audio = new Audio();
        audio.volume = MUSIC_VOLUME;
        audio.preload = "auto";
        audioRef.current = audio;
        audio.addEventListener("ended", () => {
          if (!enabledRef.current) return;
          const next = (indexRef.current + 1) % tracksRef.current.length;
          void playAtIndexRef.current(next);
        });
      }

      audio.pause();
      audio.src = track.public_url;
      audio.load();
      flashTrackLabel(track.display_name);

      await waitForAudioReady(audio);
      await tryPlayAudio(audio);
    },
    [flashTrackLabel],
  );

  playAtIndexRef.current = playAtIndex;

  const stopPlaylist = useCallback(() => {
    autoplayRetriesRef.current = 0;
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, []);

  const ensurePlaylistStarted = useCallback(async () => {
    if (!enabledRef.current || !accessToken) return;

    if (tracksRef.current.length === 0 && !fetchStartedRef.current) {
      fetchStartedRef.current = true;
      try {
        tracksRef.current = await fetchAppAudios(accessToken);
      } catch (e) {
        console.warn("[soundtrack] could not load tracks:", e);
        fetchStartedRef.current = false;
        return;
      }
    }

    if (tracksRef.current.length === 0) return;

    const audio = audioRef.current;
    if (audio?.src && !audio.paused) return;

    if (!audio?.src) {
      indexRef.current = 0;
      await playAtIndex(0);
      return;
    }

    await resumePlayback();
  }, [accessToken, playAtIndex, resumePlayback]);

  useEffect(() => {
    if (!trackLabel) return;
    const t = window.setTimeout(() => setTrackLabel(null), TOAST_MS);
    return () => window.clearTimeout(t);
  }, [trackLabel]);

  useEffect(() => {
    if (!enabled || !accessToken) {
      stopPlaylist();
      return;
    }

    autoplayRetriesRef.current = 0;
    let cancelled = false;

    void (async () => {
      await ensurePlaylistStarted();
      if (cancelled) return;
      await resumePlayback();
    })();

    const resumeOnGesture = () => {
      void resumePlayback();
    };

    const events = ["pointerdown", "click", "keydown", "touchstart"] as const;
    for (const ev of events) {
      document.addEventListener(ev, resumeOnGesture, { passive: true });
    }

    const retryId = window.setInterval(() => {
      if (!enabledRef.current) return;
      const audio = audioRef.current;
      if (!audio?.src || !audio.paused) {
        if (audio && !audio.paused) autoplayRetriesRef.current = 0;
        return;
      }
      if (autoplayRetriesRef.current >= AUTOPLAY_RETRY_MAX) return;
      autoplayRetriesRef.current += 1;
      void resumePlayback();
    }, AUTOPLAY_RETRY_MS);

    return () => {
      cancelled = true;
      window.clearInterval(retryId);
      for (const ev of events) {
        document.removeEventListener(ev, resumeOnGesture);
      }
    };
  }, [enabled, accessToken, ensurePlaylistStarted, resumePlayback, stopPlaylist]);

  useEffect(
    () => () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audioRef.current = null;
      }
    },
    [],
  );

  return { trackLabel };
}
