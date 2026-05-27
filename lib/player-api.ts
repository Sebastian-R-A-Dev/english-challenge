import { apiBase, appName } from "@/lib/auth-config";

export type PlayerProgress = {
  level: number;
  xp: number;
  xp_to_next_level: number | null;
  games_played: number;
  wins: number;
  total_score: number;
  tier_label: string;
  level_message: string;
  is_max_level: boolean;
};

export type PlayerMe = {
  id: number;
  email: string;
  profile: {
    nickname: string;
    avatar_url: string | null;
  } | null;
  progress: PlayerProgress;
};

function parsePlayerMe(data: unknown): PlayerMe | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (typeof row.id !== "number" || typeof row.email !== "string") return null;

  let profile: PlayerMe["profile"] = null;
  if (row.profile && typeof row.profile === "object") {
    const p = row.profile as Record<string, unknown>;
    if (typeof p.nickname === "string") {
      profile = {
        nickname: p.nickname,
        avatar_url: typeof p.avatar_url === "string" ? p.avatar_url : null,
      };
    }
  }

  const prog = row.progress;
  if (!prog || typeof prog !== "object") return null;
  const pr = prog as Record<string, unknown>;
  if (
    typeof pr.level !== "number" ||
    typeof pr.xp !== "number" ||
    typeof pr.games_played !== "number" ||
    typeof pr.wins !== "number" ||
    typeof pr.total_score !== "number"
  ) {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    profile,
    progress: {
      level: pr.level,
      xp: pr.xp,
      xp_to_next_level: typeof pr.xp_to_next_level === "number" ? pr.xp_to_next_level : null,
      games_played: pr.games_played,
      wins: pr.wins,
      total_score: pr.total_score,
      tier_label: typeof pr.tier_label === "string" ? pr.tier_label : "C",
      level_message:
        typeof pr.level_message === "string" ? pr.level_message : "Keep playing to level up.",
      is_max_level: pr.is_max_level === true,
    },
  };
}

/** Authenticated player hub data (GET /api/v1/player/me). */
export async function fetchPlayerMe(accessToken: string): Promise<PlayerMe | null> {
  const qs = new URLSearchParams({ expected_app_name: appName() });
  const res = await fetch(`${apiBase()}/api/v1/player/me?${qs}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });
  if (!res.ok) return null;
  const json: unknown = await res.json();
  if (!json || typeof json !== "object" || !("data" in json)) return null;
  return parsePlayerMe((json as { data: unknown }).data);
}
