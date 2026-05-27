import { apiBase } from "@/lib/auth-config";
import {
  parseChallengeAnswerResult,
  parseChallengeForfeit,
  parseChallengeSpin,
  parseChallengeStart,
  type ChallengeAnswerResult,
  type ChallengeForfeit,
  type ChallengeSpin,
  type ChallengeStart,
} from "@/lib/challenge-schemas";

async function postJson<T>(
  path: string,
  accessToken: string,
  body: unknown | undefined,
  parse: (json: unknown) => T,
): Promise<T> {
  const res = await fetch(`${apiBase()}/api/v1/challenge/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const msg =
      json && typeof json === "object" && "error" in json
        ? (json.error as { message?: string })?.message
        : null;
    throw new Error(typeof msg === "string" && msg.trim() ? msg : `Challenge request failed (${res.status})`);
  }
  return parse(json);
}

export function startChallenge(accessToken: string): Promise<ChallengeStart> {
  return postJson("start", accessToken, undefined, parseChallengeStart);
}

export function spinChallenge(accessToken: string): Promise<ChallengeSpin> {
  return postJson("spin", accessToken, undefined, parseChallengeSpin);
}

export function submitChallengeAnswer(
  accessToken: string,
  questionId: number,
  answer: string,
): Promise<ChallengeAnswerResult> {
  return postJson("answer", accessToken, { question_id: questionId, answer }, parseChallengeAnswerResult);
}

export function submitChallengeTimeout(
  accessToken: string,
  questionId: number,
): Promise<ChallengeAnswerResult> {
  return postJson("timeout", accessToken, { question_id: questionId }, parseChallengeAnswerResult);
}

export type ForfeitReason = "tab_hidden" | "user_exit" | "user_confirmed_leave" | "window_blur";

export function forfeitChallenge(
  accessToken: string,
  reason: ForfeitReason,
): Promise<ChallengeForfeit> {
  return postJson("forfeit", accessToken, { reason }, parseChallengeForfeit);
}
