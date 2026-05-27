"use client";

import { AudioToggle } from "@/components/challenge/arcade/audio-toggle";
import { TrackToast } from "@/components/challenge/arcade/track-toast";
import { useArcadeSound } from "@/hooks/use-arcade-sound";
import { useSoundtrackPlaylist } from "@/hooks/use-soundtrack-playlist";
import { useAuth } from "@/lib/auth-provider";
import { createContext, useContext, type ReactNode } from "react";

type ChallengeAudioContextValue = {
  enabled: boolean;
  setEnabled: (next: boolean) => void;
  playHover: () => void;
  playClick: () => void;
  playPowerUp: () => void;
};

const ChallengeAudioContext = createContext<ChallengeAudioContextValue | null>(null);

export function ChallengeAudioProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth();
  const { enabled, setEnabled, playHover, playClick, playPowerUp } = useArcadeSound();
  const { trackLabel } = useSoundtrackPlaylist(accessToken, enabled);

  return (
    <ChallengeAudioContext.Provider
      value={{ enabled, setEnabled, playHover, playClick, playPowerUp }}
    >
      {children}
      <AudioToggle enabled={enabled} onToggle={() => setEnabled(!enabled)} />
      <TrackToast label={trackLabel} />
    </ChallengeAudioContext.Provider>
  );
}

export function useChallengeAudio(): ChallengeAudioContextValue {
  const ctx = useContext(ChallengeAudioContext);
  if (!ctx) {
    throw new Error("useChallengeAudio must be used within ChallengeAudioProvider");
  }
  return ctx;
}
