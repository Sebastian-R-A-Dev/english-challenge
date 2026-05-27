import { apiBase } from "@/lib/auth-config";
import { parseDifficulties, type Difficulty } from "@/lib/challenge-schemas";

export async function fetchDifficulties(accessToken: string): Promise<Difficulty[]> {
  const res = await fetch(`${apiBase()}/api/v1/difficulties`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });
  const json: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error("Could not load difficulties");
  }
  return parseDifficulties(json);
}
