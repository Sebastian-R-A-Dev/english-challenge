import { apiBase, appName } from "@/lib/auth-config";

export async function postLogout(): Promise<void> {
  const res = await fetch(`${apiBase()}/api/v1/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ expected_app_name: appName() }),
  });
  if (!res.ok && res.status !== 401) {
    throw new Error(`Logout failed (${res.status})`);
  }
}
