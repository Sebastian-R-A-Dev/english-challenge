import { apiBase } from "@/lib/auth-config";
import { parseQuestions, type QuestionPublic } from "@/lib/challenge-schemas";

export async function fetchQuestionsByDifficulty(
  accessToken: string,
  difficultyId: number,
): Promise<QuestionPublic[]> {
  const qs = new URLSearchParams({ difficulty_id: String(difficultyId) });
  const res = await fetch(`${apiBase()}/api/v1/questions/?${qs}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });
  const json: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error("Could not load questions");
  }
  return parseQuestions(json);
}
