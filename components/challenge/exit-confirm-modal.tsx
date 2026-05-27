"use client";

import { ChallengeModal } from "@/components/challenge/challenge-modal";
import { NeonButton } from "@/components/ui/neon-button";

type ExitConfirmModalProps = {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
  busy?: boolean;
};

export function ExitConfirmModal({ open, onStay, onLeave, busy }: ExitConfirmModalProps) {
  return (
    <ChallengeModal
      open={open}
      title="Leave the challenge?"
      footer={
        <>
          <NeonButton variant="ghost" disabled={busy} onClick={onStay}>
            Stay in the run
          </NeonButton>
          <NeonButton disabled={busy} onClick={onLeave}>
            End challenge now
          </NeonButton>
        </>
      }
    >
      <p>
        If you leave now, your current run will end immediately and count as a loss. You cannot resume
        this attempt.
      </p>
    </ChallengeModal>
  );
}
