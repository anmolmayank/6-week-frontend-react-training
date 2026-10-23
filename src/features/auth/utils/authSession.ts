
/**
 * ============================================================================
 * Authentication Session Utilities
 * ============================================================================
 *
 * Purpose
 * -------
 * Provides utilities for reading and observing the client authentication
 * session.
 *
 * Responsibilities
 * ----------------
 * - Read the existing access token.
 * - Notify the application when the local session changes.
 * - Subscribe to authentication changes across components and browser tabs.
 *
 * Learning Notes
 * --------------
 * Token presence is a UI visibility signal only. It does not prove that the
 * token is valid or that the server-side session remains active.
 *
 * ============================================================================
 */

import { STORAGE_KEYS } from "@/shared/constants";

/**
 * ============================================================================
 * Authentication Session Events
 * ============================================================================
 */

/** Custom event dispatched when this application changes the session. */
const AUTH_SESSION_CHANGED = "app:auth-session-changed";

/**
 * ============================================================================
 * Session Snapshot
 * ============================================================================
 */

/**
 * Returns whether an access token exists in browser storage.
 *
 * This function is intended for client-side use.
 */
export function hasAccessToken(): boolean {
  return Boolean(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));
}

/**
 * ============================================================================
 * Session Notifications
 * ============================================================================
 */

/**
 * Notifies subscribers that the local authentication session changed.
 *
 * Call this after login, logout, or clearing an invalid token.
 */
export function notifyAuthSessionChanged(): void {
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED));
}

/**
 * Clears the locally stored access token and notifies subscribers.
 *
 * Use this from the application's logout flow when that flow is implemented.
 * This function does not revoke a server-side token.
 */
export function clearAuthSession(): void {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  notifyAuthSessionChanged();
}

/**
 * ============================================================================
 * Session Subscription
 * ============================================================================
 */

/**
 * Subscribes to same-tab and cross-tab authentication changes.
 *
 * @param callback - Invoked when the session may have changed.
 * @returns A cleanup function that removes both event listeners.
 */
export function subscribeToAuthSession(
  callback: () => void,
): () => void {
  window.addEventListener(AUTH_SESSION_CHANGED, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(AUTH_SESSION_CHANGED, callback);
    window.removeEventListener("storage", callback);
  };
}
