/**
 * Anonymous user identity utility.
 *
 * - Generates a stable per-browser anonymousId.
 * - Persists in both localStorage (for client-side reads) and a cookie
 *   (so server-side route handlers can read it via `request.cookies`).
 *
 * The ID follows the format `anon_<base36-ts>_<8hex>` and is ~22 chars long.
 */

const STORAGE_KEY = "videoiq:anonymousId";
const COOKIE_KEY = "videoiq_anonymous_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function generateId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(16).slice(2, 10);
  return `anon_${ts}_${rand}`;
}

function setCookie(name: string, value: string, maxAgeSec: number) {
  if (typeof document === "undefined") return;
  const isSecure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSec}; SameSite=Lax${isSecure ? "; Secure" : ""}`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Returns the current anonymousId (creating one if none exists yet).
 * Always reads from localStorage first; falls back to cookie; then generates.
 */
export function getOrCreateAnonymousId(): string {
  if (typeof window === "undefined") return "";

  try {
    let id = window.localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = getCookie(COOKIE_KEY);
    }
    if (!id) {
      id = generateId();
    }

    // Re-sync to both stores (cheap, idempotent).
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* localStorage may be disabled — cookie still works */
    }
    setCookie(COOKIE_KEY, id, COOKIE_MAX_AGE);
    return id;
  } catch {
    // localStorage disabled — fall back to cookie-only.
    let id = getCookie(COOKIE_KEY);
    if (!id) {
      id = generateId();
      setCookie(COOKIE_KEY, id, COOKIE_MAX_AGE);
    }
    return id;
  }
}

/**
 * Returns whatever anonymousId is currently cached (without creating one).
 * Useful for SSR-safe reads where we don't want to mint a new identity.
 */
export function peekAnonymousId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY) || getCookie(COOKIE_KEY);
  } catch {
    return getCookie(COOKIE_KEY);
  }
}

export const ANON_STORAGE_KEY = STORAGE_KEY;
export const ANON_COOKIE_KEY = COOKIE_KEY;
