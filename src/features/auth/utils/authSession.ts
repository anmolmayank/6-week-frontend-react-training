/**
 * ============================================================================
 * Authentication Session Utilities
 * ============================================================================
 * Stores and observes the browser-side authentication snapshot.
 * Token presence is a UI signal only; the Node.js API is the security boundary.
 * ============================================================================
 */
import { ROUTES, STORAGE_KEYS } from "@/shared/constants";
import type { AuthUser, UserRole } from "../models";

const AUTH_SESSION_CHANGED = "app:auth-session-changed";

/** Returns true when an access token is present in local storage. */
export function hasAccessToken(): boolean {
  return Boolean(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));
}

/** Validates the role fields required by the current role-aware backend. */
function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== "object" || value === null) return false;
  if (!("_id" in value) || !("name" in value) || !("email" in value)) return false;
  if (!("role" in value) || !("tenantId" in value)) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate._id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.email === "string" &&
    (candidate.role === "owner" || candidate.role === "tenant") &&
    (typeof candidate.tenantId === "string" || candidate.tenantId === null)
  );
}

/** Reads the UI-safe identity stored after login or GET /auth/me. */
export function getAuthenticatedUser(): AuthUser | null {
  const serializedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
  if (!serializedUser) return null;

  try {
    const parsed: unknown = JSON.parse(serializedUser);
    return isAuthUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Returns a role only when the persisted session has an explicit supported role. */
export function getCurrentUserRole(): UserRole | null {
  return getAuthenticatedUser()?.role ?? null;
}

/** Returns the correct landing route for an explicit backend-issued role. */
export function getHomeRouteForRole(role?: UserRole | null): string {
  if (role === "owner") return ROUTES.OWNER_DASHBOARD;
  if (role === "tenant") return ROUTES.TENANT_DASHBOARD;
  return ROUTES.LOGIN;
}

/** Returns the landing route for the currently stored user, or login if legacy data is incomplete. */
export function getHomeRouteForCurrentUser(): string {
  return getHomeRouteForRole(getCurrentUserRole());
}

/** Dispatches a same-tab notification when local session data changes. */
export function notifyAuthSessionChanged(): void {
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED));
}

/** Persists the access token and backend-provided identity after login. */
export function saveAuthSession(accessToken: string, user: AuthUser): void {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  notifyAuthSessionChanged();
}

/** Refreshes the stored identity without changing the current access token. */
export function saveAuthenticatedUser(user: AuthUser): void {
  localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  notifyAuthSessionChanged();
}

/** Clears the local session and notifies subscribers. */
export function clearAuthSession(): void {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  notifyAuthSessionChanged();
}

/** Subscribes to same-tab and cross-tab authentication changes. */
export function subscribeToAuthSession(callback: () => void): () => void {
  window.addEventListener(AUTH_SESSION_CHANGED, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(AUTH_SESSION_CHANGED, callback);
    window.removeEventListener("storage", callback);
  };
}
