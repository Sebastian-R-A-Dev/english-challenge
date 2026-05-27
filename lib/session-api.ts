import { apiBase, appName } from "@/lib/auth-config";

/** Refresh cookie session only if it belongs to this SPA's App.name (see ArcadeCore). */
export async function postRefresh(): Promise<string | null> {
  const res = await fetch(`${apiBase()}/api/v1/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ expected_app_name: appName() }),
  });
  if (!res.ok) return null;
  const json: unknown = await res.json();
  if (!json || typeof json !== "object" || !("data" in json)) return null;
  const data = (json as { data: unknown }).data;
  if (!data || typeof data !== "object" || !("access_token" in data)) return null;
  const token = (data as { access_token: unknown }).access_token;
  return typeof token === "string" && token.trim() ? token.trim() : null;
}

/** Bearer válido y usuario perteneciente al App.name configurado en env. */
export async function verifyAccessToken(accessToken: string): Promise<boolean> {
  try {
    const qs = new URLSearchParams({ expected_app_name: appName() });
    const res = await fetch(`${apiBase()}/api/v1/users/me?${qs.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}
