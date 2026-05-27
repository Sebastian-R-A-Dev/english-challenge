import { z } from "zod";

export const difficultySchema = z.object({
  id: z.number(),
  app_id: z.number(),
  name: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
});

export const questionTypeSchema = z.object({
  id: z.number(),
  slug: z.string(),
  label: z.string(),
  is_active: z.boolean(),
});

export const questionPublicSchema = z.object({
  id: z.number(),
  app_id: z.number(),
  difficulty_id: z.number(),
  difficulty: z.object({
    id: z.number(),
    name: z.string(),
    is_active: z.boolean(),
  }),
  question_type_id: z.number(),
  question_type: questionTypeSchema,
  question: z.union([z.string(), z.array(z.string())]),
  options: z.unknown(),
  image_url: z.string().nullable(),
  image_name: z.string().nullable(),
  image_id: z.number().nullable(),
  created_at: z.string(),
});

export const challengeStartSchema = z.object({
  session_id: z.number(),
  total_questions: z.number(),
  question_seconds: z.number(),
  ui_grace_seconds: z.number(),
  status: z.literal("active"),
});

export const challengeSpinSchema = z.object({
  difficulty: z.object({ id: z.number(), name: z.string() }),
  question: questionPublicSchema,
  expires_at: z.string(),
  question_seconds: z.number(),
  ui_grace_seconds: z.number(),
  correct_count: z.number(),
  total_questions: z.number(),
  status: z.literal("active"),
});

export const challengeAnswerResultSchema = z.object({
  correct: z.boolean(),
  correct_count: z.number(),
  total_questions: z.number(),
  status: z.enum(["active", "completed", "failed"]),
  timed_out: z.boolean().optional(),
  xp_earned: z.number().optional(),
});

export const challengeForfeitSchema = z.object({
  correct_count: z.number(),
  total_questions: z.number(),
  status: z.literal("failed"),
  reason: z.string(),
});

export type Difficulty = z.infer<typeof difficultySchema>;
export type QuestionPublic = z.infer<typeof questionPublicSchema>;
export type ChallengeStart = z.infer<typeof challengeStartSchema>;
export type ChallengeSpin = z.infer<typeof challengeSpinSchema>;
export type ChallengeAnswerResult = z.infer<typeof challengeAnswerResultSchema>;
export type ChallengeForfeit = z.infer<typeof challengeForfeitSchema>;

function unwrapData<T>(schema: z.ZodType<T>, json: unknown): T {
  if (!json || typeof json !== "object" || !("data" in json)) {
    throw new Error("Unexpected API response");
  }
  return schema.parse((json as { data: unknown }).data);
}

export function parseDifficulties(json: unknown): Difficulty[] {
  if (!json || typeof json !== "object" || !("data" in json)) {
    throw new Error("Unexpected difficulties response");
  }
  const data = (json as { data: unknown }).data;
  return z.array(difficultySchema).parse(data);
}

export function parseQuestions(json: unknown): QuestionPublic[] {
  if (!json || typeof json !== "object" || !("data" in json)) {
    throw new Error("Unexpected questions response");
  }
  const data = (json as { data: unknown }).data;
  return z.array(questionPublicSchema).parse(data);
}

export function parseChallengeStart(json: unknown): ChallengeStart {
  return unwrapData(challengeStartSchema, json);
}

export function parseChallengeSpin(json: unknown): ChallengeSpin {
  return unwrapData(challengeSpinSchema, json);
}

export function parseChallengeAnswerResult(json: unknown): ChallengeAnswerResult {
  return unwrapData(challengeAnswerResultSchema, json);
}

export function parseChallengeForfeit(json: unknown): ChallengeForfeit {
  return unwrapData(challengeForfeitSchema, json);
}
