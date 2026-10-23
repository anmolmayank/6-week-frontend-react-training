/**
 * ============================================================================
 * File: SnackbarContext.ts
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines the Context contract used by the global Snackbar system.
 *
 * Responsibilities
 * ----------------
 * - Define Snackbar methods.
 * - Define the Snackbar Context.
 *
 * Note
 * ----
 * This file intentionally does not export React components.
 *
 * Keeping the Context separate from SnackbarProvider allows React Fast
 * Refresh to work correctly with the `react-refresh/only-export-components`
 * ESLint rule.
 *
 * ============================================================================
 */

import { createContext } from "react";

/**
 * ============================================================================
 * Types
 * ============================================================================
 */

/**
 * Public API exposed by the Snackbar Context.
 */
export interface SnackbarContextValue {
    /**
     * Display a success notification.
     */
    success: (message: string) => void;

    /**
     * Display an error notification.
     */
    error: (message: string) => void;

    /**
     * Display a warning notification.
     */
    warning: (message: string) => void;

    /**
     * Display an informational notification.
     */
    info: (message: string) => void;

    /**
     * Close the currently displayed Snackbar.
     */
    close: () => void;
}

/**
 * ============================================================================
 * Context
 * ============================================================================
 *
 * `undefined` is used as the default value so `useSnackbar()` can detect
 * when it is used outside of SnackbarProvider.
 */
export const SnackbarContext =
    createContext<SnackbarContextValue | undefined>(
        undefined,
    );