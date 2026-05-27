import { apiBase, appName } from "@/lib/auth-config";
import type { RankingRow } from "@/types/ranking";

function parseEntry(raw: unknown, index: number): RankingRow | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const player = typeof r.player === "string" ? r.player : null;
  const level_label = typeof r.level_label === "string" ? r.level_label : null;
  const player_level = typeof r.player_level === "number" ? r.player_level : null;
  const score = typeof r.score === "number" ? r.score : null;
  const wins = typeof r.wins === "number" ? r.wins : null;
  const position = typeof r.position === "number" ? r.position : index + 1;
  if (!player || !level_label || player_level == null || score == null || wins == null)
    return null;
  return { position, player, level_label, player_level, score, wins };
}

/** Top players for this app (public). Sorted by wins, then total score. */
export async function fetchLeaderboard(limit = 10): Promise<RankingRow[]> {
  const qs = new URLSearchParams({
    app_name: appName(),
    limit: String(limit),
  });
  const res = await fetch(`${apiBase()}/api/v1/leaderboard?${qs}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json: unknown = await res.json();
  if (!json || typeof json !== "object" || !("data" in json)) return [];
  const data = (json as { data: unknown }).data;
  if (!Array.isArray(data)) return [];
  return data
    .map((row, i) => parseEntry(row, i))
    .filter((row): row is RankingRow => row != null);
}
