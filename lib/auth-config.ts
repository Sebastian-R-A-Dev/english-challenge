/** ArcadeCore API origin (no trailing slash). */
export function apiBase(): string {
  const u = process.env.NEXT_PUBLIC_ARCADECORE_API_BASE_URL?.trim();
  if (!u) throw new Error("NEXT_PUBLIC_ARCADECORE_API_BASE_URL is not set");
  return u.replace(/\/$/, "");
}

/** App id sent as ?redirect-to= to generic-login (must exist in NEXT_PUBLIC_REGISTERED_APPS_JSON there). */
export function appName(): string {
  const n = process.env.NEXT_PUBLIC_APP_NAME?.trim();
  if (!n) throw new Error("NEXT_PUBLIC_APP_NAME is not set (e.g. ENGLISH-CHALLENGE)");
  return n;
}

/** generic-login URL (path /login). */
function loginPageOriginAndPath(): URL {
  const raw = process.env.NEXT_PUBLIC_LOGIN_URL?.trim();
  const fallback = "http://localhost:3000/login";
  try {
    return new URL(raw || fallback);
  } catch {
    return new URL(fallback);
  }
}

/** App home (public landing). Used after logout and when /challenge has no session. */
export function appHomeHref(): string {
  return "/";
}

/**
 * Sends the user to generic-login with redirect-to = ENGLISH-CHALLENGE and redirect_url = return URL.
 */
export function loginRedirectHref(returnUrl?: string): string {
  const url = loginPageOriginAndPath();
  url.searchParams.set("redirect-to", appName());
  if (typeof window !== "undefined") {
    url.searchParams.set("redirect_url", returnUrl ?? window.location.href);
  } else if (returnUrl) {
    url.searchParams.set("redirect_url", returnUrl);
  }
  return url.toString();
}
