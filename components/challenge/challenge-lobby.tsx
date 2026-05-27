"use client";

import { AnimatedBackground } from "@/components/challenge/arcade/animated-background";
import { HeroCard } from "@/components/challenge/arcade/hero-card";
import { IntroSequence } from "@/components/challenge/arcade/intro-sequence";
import { ParticleLayer } from "@/components/challenge/arcade/particle-layer";
import { useChallengeAudio } from "@/components/challenge/challenge-audio-provider";
import { motion } from "framer-motion";

type ChallengeLobbyProps = {
  onStart: () => void;
  busy?: boolean;
};

export function ChallengeLobby({ onStart, busy }: ChallengeLobbyProps) {
  const { playHover, playClick, playPowerUp } = useChallengeAudio();

  return (
    <IntroSequence>
      <AnimatedBackground />
      <ParticleLayer />

      <motion.div
        className="relative z-[1] flex w-full flex-1 flex-col items-center justify-center py-8"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <HeroCard
          disabled={busy}
          onStart={onStart}
          onHoverSound={playHover}
          onClickSound={() => {
            playClick();
            playPowerUp();
          }}
        />
      </motion.div>
    </IntroSequence>
  );
}
