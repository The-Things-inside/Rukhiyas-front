/** JWT-shaped bearer token from login (`header.payload.signature`). */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("access_token");
  if (!token || token.split(".").length !== 3) {
    if (token) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("parent_id");
    }
    return null;
  }
  return token;
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
