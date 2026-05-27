import { apiBase } from "@/lib/auth-config";

export type AppAudioTrack = {
  id: number;
  uuid: string;
  display_name: string;
  public_url: string;
  created_at: string;
};

function parseTracks(payload: unknown): AppAudioTrack[] | null {
  if (!payload || typeof payload !== "object") return null;
  const data = (payload as { data?: unknown }).data;
  if (!Array.isArray(data)) return null;
  const out: AppAudioTrack[] = [];
  for (const row of data) {
    if (!row || typeof row !== "object") return null;
    const r = row as Record<string, unknown>;
    if (
      typeof r.id !== "number" ||
      typeof r.uuid !== "string" ||
      typeof r.display_name !== "string" ||
      typeof r.public_url !== "string" ||
      typeof r.created_at !== "string"
    ) {
      return null;
    }
    out.push({
      id: r.id,
      uuid: r.uuid,
      display_name: r.display_name,
      public_url: r.public_url,
      created_at: r.created_at,
    });
  }
  return out;
}

export async function fetchAppAudios(accessToken: string): Promise<AppAudioTrack[]> {
  const res = await fetch(`${apiBase()}/api/v1/audios`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  const json: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const msg =
      json && typeof json === "object" && "error" in json
        ? (json.error as { message?: string })?.message
        : null;
    throw new Error(typeof msg === "string" && msg.trim() ? msg : `Failed to load audios (${res.status})`);
  }
  const list = parseTracks(json);
  if (!list) throw new Error("Unexpected audios response shape");
  return list.sort((a, b) => a.id - b.id);
}
