"use client";

import { ChallengeLobby } from "@/components/challenge/challenge-lobby";
import { DifficultySelectedReveal } from "@/components/challenge/difficulty-selected-reveal";
import { DifficultyWheel } from "@/components/challenge/difficulty-wheel";
import { ExitConfirmModal } from "@/components/challenge/exit-confirm-modal";
import { InstructionsModal } from "@/components/challenge/instructions-modal";
import { QuestionPanel } from "@/components/challenge/question-panel";
import { ResultPanel } from "@/components/challenge/result-panel";
import {
  forfeitChallenge,
  spinChallenge,
  startChallenge,
  submitChallengeAnswer,
  submitChallengeTimeout,
} from "@/lib/challenge-api";
import { fetchDifficulties } from "@/lib/difficulties-api";
import { fetchQuestionsByDifficulty } from "@/lib/questions-api";
import { useAuth } from "@/lib/auth-provider";
import {
  useChallengeAbandonGuard,
  useChallengeNavigationGuard,
} from "@/hooks/use-challenge-abandon-guard";
import { useChallengeStore } from "@/store/challenge-store";
import { useCallback, useRef, useState } from "react";

const INTRO_MS = 1000;
const DIFFICULTY_REVEAL_MS = 2000;
const FEEDBACK_MS = 1400;
const DEFAULT_RUN_SIZE = 10;
const DEFAULT_QUESTION_SECONDS = 20;

export function ChallengeExperience() {
  const { accessToken } = useAuth();
  const phase = useChallengeStore((s) => s.phase);
  const isRunActive = useChallengeStore((s) => s.isRunActive);
  const totalQuestions = useChallengeStore((s) => s.totalQuestions);
  const questionSeconds = useChallengeStore((s) => s.questionSeconds);
  const difficulties = useChallengeStore((s) => s.difficulties);
  const spinTargetDifficultyId = useChallengeStore((s) => s.spinTargetDifficultyId);
  const currentQuestion = useChallengeStore((s) => s.currentQuestion);
  const currentDifficulty = useChallengeStore((s) => s.currentDifficulty);
  const expiresAt = useChallengeStore((s) => s.expiresAt);
  const correctCount = useChallengeStore((s) => s.correctCount);
  const lastFeedback = useChallengeStore((s) => s.lastFeedback);
  const endReason = useChallengeStore((s) => s.endReason);
  const xpEarned = useChallengeStore((s) => s.xpEarned);
  const exitPromptOpen = useChallengeStore((s) => s.exitPromptOpen);
  const pendingExitHref = useChallengeStore((s) => s.pendingExitHref);

  const [busy, setBusy] = useState(false);
  const spinPendingRef = useRef(false);
  const answeringRef = useRef(false);

  useChallengeAbandonGuard(accessToken);
  useChallengeNavigationGuard();

  const ensureCatalog = useCallback(async () => {
    if (!accessToken) throw new Error("Not authenticated");
    const st = useChallengeStore.getState();

    let diffs = st.difficulties;
    if (diffs.length === 0) {
      diffs = await fetchDifficulties(accessToken);
      st.setDifficulties(diffs);
    }

    await Promise.all(
      diffs.map(async (d) => {
        if (!st.hasQuestionsCached(d.id)) {
          const qs = await fetchQuestionsByDifficulty(accessToken, d.id);
          st.cacheQuestions(d.id, qs);
        }
      }),
    );
  }, [accessToken]);

  const runSpinRound = useCallback(async () => {
    if (!accessToken || spinPendingRef.current) return;
    spinPendingRef.current = true;
    setBusy(true);
    const st = useChallengeStore.getState();
    st.setPhase("spinning");
    st.setSpinTarget(null);

    try {
      const spin = await spinChallenge(accessToken);
      st.applySpin({
        difficulty: spin.difficulty,
        question: spin.question,
        expiresAt: spin.expires_at,
        correctCount: spin.correct_count,
        totalQuestions: spin.total_questions,
        questionSeconds: spin.question_seconds,
        uiGraceSeconds: spin.ui_grace_seconds,
      });

      if (!st.hasQuestionsCached(spin.difficulty.id)) {
        st.cacheQuestions(spin.difficulty.id, [spin.question]);
      }
    } catch (e) {
      st.endRun(e instanceof Error ? e.message : "Spin failed");
    } finally {
      spinPendingRef.current = false;
      setBusy(false);
    }
  }, [accessToken]);

  const onWheelComplete = useCallback(() => {
    const st = useChallengeStore.getState();
    st.setPhase("difficulty-selected");
    window.setTimeout(() => {
      const next = useChallengeStore.getState();
      next.setPhase("question-intro");
      window.setTimeout(() => {
        useChallengeStore.getState().setPhase("playing");
      }, INTRO_MS);
    }, DIFFICULTY_REVEAL_MS);
  }, []);

  async function handleAcceptInstructions() {
    if (!accessToken) return;
    setBusy(true);
    try {
      const start = await startChallenge(accessToken);
      await ensureCatalog();
      useChallengeStore.getState().beginSession({
        sessionId: start.session_id,
        totalQuestions: start.total_questions,
        questionSeconds: start.question_seconds,
        uiGraceSeconds: start.ui_grace_seconds,
      });
      await runSpinRound();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not start challenge");
      useChallengeStore.getState().resetRun();
    } finally {
      setBusy(false);
    }
  }

  async function handleAnswer(answer: string) {
    if (!accessToken || !currentQuestion || answeringRef.current) return;
    answeringRef.current = true;
    setBusy(true);
    try {
      const result = await submitChallengeAnswer(accessToken, currentQuestion.id, answer);
      useChallengeStore.getState().applyAnswerResult(result);
      if (result.status === "active") {
        window.setTimeout(() => {
          void runSpinRound();
        }, FEEDBACK_MS);
      }
    } catch (e) {
      useChallengeStore.getState().endRun(e instanceof Error ? e.message : "Submit failed");
    } finally {
      answeringRef.current = false;
      setBusy(false);
    }
  }

  async function handleTimeout() {
    if (!accessToken || !currentQuestion || answeringRef.current) return;
    answeringRef.current = true;
    setBusy(true);
    try {
      const result = await submitChallengeTimeout(accessToken, currentQuestion.id);
      useChallengeStore.getState().applyAnswerResult(result);
    } catch {
      useChallengeStore.getState().endRun("timeout");
    } finally {
      answeringRef.current = false;
      setBusy(false);
    }
  }

  async function handleConfirmExit() {
    if (!accessToken) return;
    setBusy(true);
    try {
      await forfeitChallenge(accessToken, "user_confirmed_leave");
    } catch {
      /* ignore */
    }
    useChallengeStore.getState().endRun("user_confirmed_leave");
    useChallengeStore.getState().setExitPrompt(false);
    if (pendingExitHref) {
      window.location.href = pendingExitHref;
    }
    setBusy(false);
  }

  const showQuestion =
    (phase === "question-intro" || phase === "playing" || phase === "feedback") &&
    currentQuestion &&
    currentDifficulty;

  return (
    <>
      <InstructionsModal
        open={phase === "instructions"}
        totalQuestions={totalQuestions || DEFAULT_RUN_SIZE}
        questionSeconds={questionSeconds || DEFAULT_QUESTION_SECONDS}
        onAccept={() => void handleAcceptInstructions()}
        onCancel={() => useChallengeStore.getState().setPhase("lobby")}
        busy={busy}
      />

      <ExitConfirmModal
        open={exitPromptOpen}
        busy={busy}
        onStay={() => useChallengeStore.getState().setExitPrompt(false)}
        onLeave={() => void handleConfirmExit()}
      />

      <DifficultyWheel
        open={phase === "spinning" && isRunActive}
        difficulties={difficulties}
        targetDifficultyId={spinTargetDifficultyId}
        onSpinComplete={spinTargetDifficultyId ? onWheelComplete : undefined}
      />

      <DifficultySelectedReveal
        open={phase === "difficulty-selected" && isRunActive}
        difficultyName={currentDifficulty?.name ?? null}
      />

      {phase === "lobby" ? (
        <ChallengeLobby
          onStart={() => useChallengeStore.getState().setPhase("instructions")}
          busy={busy}
        />
      ) : null}

      {phase === "ended" ? (
        <ResultPanel
          correctCount={correctCount}
          totalQuestions={totalQuestions}
          endReason={endReason}
          xpEarned={xpEarned}
          onPlayAgain={() => useChallengeStore.getState().resetRun()}
        />
      ) : null}

      {showQuestion ? (
        <div className="relative pt-6 sm:pt-8">
          <p className="arcade-golden-intro pointer-events-none mb-5 text-center font-display text-xs font-bold uppercase tracking-[0.26em] sm:mb-6 sm:text-sm">
            Good luck
          </p>
          <QuestionPanel
            question={currentQuestion}
            difficultyName={currentDifficulty.name}
            expiresAt={expiresAt ?? new Date().toISOString()}
            questionSeconds={questionSeconds || DEFAULT_QUESTION_SECONDS}
            introActive={phase === "question-intro"}
            disabled={busy || phase === "feedback"}
            onSubmit={(a) => void handleAnswer(a)}
            onTimeout={() => void handleTimeout()}
          />
        </div>
      ) : null}

      {phase === "feedback" && lastFeedback ? (
        <div className="fixed inset-x-0 bottom-24 z-[80] flex justify-center px-4">
          <div
            className={`rounded-xl px-6 py-3 font-display text-lg font-bold uppercase tracking-wider ${
              lastFeedback.correct
                ? "border border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
                : "border border-rose-400/40 bg-rose-500/15 text-rose-200"
            }`}
          >
            {lastFeedback.correct ? "Correct!" : "Wrong — run over"}
          </div>
        </div>
      ) : null}

      {isRunActive ? (
        <div className="mx-auto max-w-2xl px-4 pb-6 text-center text-xs text-slate-500">
          Question {correctCount + 1} of {totalQuestions} · Do not switch tabs or open new windows
        </div>
      ) : null}
    </>
  );
}
