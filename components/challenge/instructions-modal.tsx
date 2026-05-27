"use client";

import { ChallengeModal } from "@/components/challenge/challenge-modal";
import { RulesQuestionCarousel } from "@/components/challenge/rules-question-carousel";
import { NeonButton } from "@/components/ui/neon-button";
import { AlertTriangle } from "lucide-react";

type InstructionsModalProps = {
  open: boolean;
  totalQuestions: number;
  questionSeconds: number;
  onAccept: () => void;
  onCancel: () => void;
  busy?: boolean;
};

export function InstructionsModal({
  open,
  totalQuestions,
  questionSeconds,
  onAccept,
  onCancel,
  busy,
}: InstructionsModalProps) {
  return (
    <ChallengeModal
      open={open}
      title="Challenge Rules"
      footer={
        <>
          <NeonButton variant="ghost" disabled={busy} onClick={onCancel}>
            Not now
          </NeonButton>
          <NeonButton disabled={busy} onClick={onAccept}>
            I accept — let&apos;s go
          </NeonButton>
        </>
      }
    >
      <p>
        You have <strong className="text-cyan-200">{questionSeconds} seconds</strong> to answer each
        question once it appears.
      </p>
      <p>
        This run has up to <strong className="text-cyan-200">{totalQuestions}</strong> questions. Your
        score is based on how many you get right out of that total.
      </p>
      <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-400">
        <li>No going back — each question is your only shot.</li>
        <li>One wrong answer or timeout ends the entire challenge.</li>
        <li>A random difficulty is picked on every spin.</li>
      </ul>

      <RulesQuestionCarousel className="mt-1" />

      <div className="flex gap-2 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-amber-100">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p className="text-xs leading-relaxed">
          Switching tabs, opening another window, or leaving this page will{" "}
          <strong>automatically forfeit</strong> the challenge. Stay focused on this screen until you
          finish.
        </p>
      </div>
    </ChallengeModal>
  );
}
