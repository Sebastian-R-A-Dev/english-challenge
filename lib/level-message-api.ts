import { apiBase } from "@/lib/auth-config";

const FALLBACK_LEVEL_0 =
  "Rookie pilot — welcome to the English Challenge.";

/** Public milestone copy for a player level (GET /level-messages/resolve). */
export async function fetchLevelMessage(level: number): Promise<string> {
  try {
    const qs = new URLSearchParams({ level: String(level) });
    const res = await fetch(`${apiBase()}/api/v1/level-messages/resolve?${qs}`);
    if (!res.ok) return level === 0 ? FALLBACK_LEVEL_0 : "Keep playing to level up.";
    const json: unknown = await res.json();
    if (!json || typeof json !== "object" || !("data" in json)) {
      return level === 0 ? FALLBACK_LEVEL_0 : "Keep playing to level up.";
    }
    const data = (json as { data: unknown }).data;
    if (!data || typeof data !== "object") {
      return level === 0 ? FALLBACK_LEVEL_0 : "Keep playing to level up.";
    }
    const message = (data as { message?: unknown }).message;
    return typeof message === "string" && message.trim()
      ? message
      : level === 0
        ? FALLBACK_LEVEL_0
        : "Keep playing to level up.";
  } catch {
    return level === 0 ? FALLBACK_LEVEL_0 : "Keep playing to level up.";
  }
}
