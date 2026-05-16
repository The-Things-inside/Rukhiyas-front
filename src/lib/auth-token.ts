/** JWT-shaped bearer token from login (`header.payload.signature`). */

export const SESSION_EXPIRED = "SESSION_EXPIRED";

export function decodeJwtPayload(
  token: string,
): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, skewSeconds = 30): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;
  return Date.now() >= (payload.exp - skewSeconds) * 1000;
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("parent_id");
}

export function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/login")) return;
  window.location.replace("/login");
}

/** Clears stored credentials and sends the user to the login page. */
export function handleSessionExpired(): void {
  clearAuthSession();
  redirectToLogin();
}

export function isUnauthorizedStatus(status: number): boolean {
  return status === 401 || status === 403;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("access_token");
  if (!token || token.split(".").length !== 3) {
    if (token) clearAuthSession();
    return null;
  }
  if (isTokenExpired(token)) {
    clearAuthSession();
    return null;
  }
  return token;
}

/**
 * Returns a valid token or redirects to login.
 * Returns null only while redirect is in progress.
 */
export function requireAccessToken(): string | null {
  const token = getAccessToken();
  if (!token) {
    handleSessionExpired();
    return null;
  }
  return token;
}

export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const token = requireAccessToken();
  if (!token) {
    throw new Error(SESSION_EXPIRED);
  }

  const headers = new Headers(init?.headers);
  if (!headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("accept")) {
    headers.set("accept", "application/json");
  }

  const res = await fetch(input, { ...init, headers });

  if (isUnauthorizedStatus(res.status)) {
    handleSessionExpired();
    throw new Error(SESSION_EXPIRED);
  }

  return res;
}

export function isSessionExpiredError(error: unknown): boolean {
  return error instanceof Error && error.message === SESSION_EXPIRED;
}

export async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    throw new Error("Empty response from server");
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid response from server. Please sign in again.");
  }
}
