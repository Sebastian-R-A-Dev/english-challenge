import type {
  ChallengeAnswerResult,
  Difficulty,
  QuestionPublic,
} from "@/lib/challenge-schemas";
import { create } from "zustand";

export type ChallengePhase =
  | "lobby"
  | "instructions"
  | "spinning"
  | "difficulty-selected"
  | "question-intro"
  | "playing"
  | "feedback"
  | "ended";

type ChallengeStore = {
  phase: ChallengePhase;
  isRunActive: boolean;
  sessionId: number | null;
  totalQuestions: number;
  correctCount: number;
  questionSeconds: number;
  uiGraceSeconds: number;
  difficulties: Difficulty[];
  questionsByDifficulty: Record<number, QuestionPublic[]>;
  spinTargetDifficultyId: number | null;
  currentDifficulty: { id: number; name: string } | null;
  currentQuestion: QuestionPublic | null;
  expiresAt: string | null;
  lastFeedback: { correct: boolean; timedOut?: boolean } | null;
  endReason: string | null;
  xpEarned: number | null;
  exitPromptOpen: boolean;
  pendingExitHref: string | null;
  setPhase: (phase: ChallengePhase) => void;
  setExitPrompt: (open: boolean, href?: string | null) => void;
  setDifficulties: (items: Difficulty[]) => void;
  cacheQuestions: (difficultyId: number, items: QuestionPublic[]) => void;
  hasQuestionsCached: (difficultyId: number) => boolean;
  beginSession: (input: {
    sessionId: number;
    totalQuestions: number;
    questionSeconds: number;
    uiGraceSeconds: number;
  }) => void;
  applySpin: (input: {
    difficulty: { id: number; name: string };
    question: QuestionPublic;
    expiresAt: string;
    correctCount: number;
    totalQuestions: number;
    questionSeconds: number;
    uiGraceSeconds: number;
  }) => void;
  setSpinTarget: (id: number | null) => void;
  applyAnswerResult: (result: ChallengeAnswerResult) => void;
  endRun: (reason: string, correctCount?: number, totalQuestions?: number) => void;
  resetRun: () => void;
};

const initialRunState = {
  phase: "lobby" as ChallengePhase,
  isRunActive: false,
  sessionId: null as number | null,
  totalQuestions: 0,
  correctCount: 0,
  questionSeconds: 20,
  uiGraceSeconds: 3,
  spinTargetDifficultyId: null as number | null,
  currentDifficulty: null as { id: number; name: string } | null,
  currentQuestion: null as QuestionPublic | null,
  expiresAt: null as string | null,
  lastFeedback: null as { correct: boolean; timedOut?: boolean } | null,
  endReason: null as string | null,
  xpEarned: null as number | null,
  exitPromptOpen: false,
  pendingExitHref: null as string | null,
};

export const useChallengeStore = create<ChallengeStore>((set, get) => ({
  ...initialRunState,
  difficulties: [],
  questionsByDifficulty: {},

  setPhase: (phase) => set({ phase }),
  setExitPrompt: (open, href = null) => set({ exitPromptOpen: open, pendingExitHref: href }),
  setDifficulties: (items) => set({ difficulties: items }),
  cacheQuestions: (difficultyId, items) =>
    set((s) => ({
      questionsByDifficulty: { ...s.questionsByDifficulty, [difficultyId]: items },
    })),
  hasQuestionsCached: (difficultyId) => Boolean(get().questionsByDifficulty[difficultyId]?.length),

  beginSession: ({ sessionId, totalQuestions, questionSeconds, uiGraceSeconds }) =>
    set({
      ...initialRunState,
      phase: "spinning",
      isRunActive: true,
      sessionId,
      totalQuestions,
      questionSeconds,
      uiGraceSeconds,
      difficulties: get().difficulties,
      questionsByDifficulty: get().questionsByDifficulty,
    }),

  applySpin: (input) =>
    set({
      spinTargetDifficultyId: input.difficulty.id,
      currentDifficulty: input.difficulty,
      currentQuestion: input.question,
      expiresAt: input.expiresAt,
      correctCount: input.correctCount,
      totalQuestions: input.totalQuestions,
      questionSeconds: input.questionSeconds,
      uiGraceSeconds: input.uiGraceSeconds,
    }),

  setSpinTarget: (id) => set({ spinTargetDifficultyId: id }),

  applyAnswerResult: (result) =>
    set({
      correctCount: result.correct_count,
      totalQuestions: result.total_questions,
      lastFeedback: { correct: result.correct, timedOut: result.timed_out },
      xpEarned: result.xp_earned ?? get().xpEarned,
      phase: result.status === "active" ? "feedback" : "ended",
      isRunActive: result.status === "active",
      endReason: result.status === "active" ? null : result.status,
    }),

  endRun: (reason, correctCount, totalQuestions) =>
    set((s) => ({
      phase: "ended",
      isRunActive: false,
      endReason: reason,
      correctCount: correctCount ?? s.correctCount,
      totalQuestions: totalQuestions ?? s.totalQuestions,
    })),

  resetRun: () =>
    set((s) => ({
      ...initialRunState,
      difficulties: s.difficulties,
      questionsByDifficulty: s.questionsByDifficulty,
    })),
}));
