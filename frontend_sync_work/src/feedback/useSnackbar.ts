/**
 * ============================================================================
 * File: useSnackbar.ts
 * ============================================================================
 *
 * Purpose
 * -------
 * Provides a convenient hook for accessing the global Snackbar system.
 *
 * Usage
 * -----
 *
 * const { success, error } = useSnackbar();
 *
 * success("Tenant created successfully.");
 * error("Unable to create tenant.");
 *
 * ============================================================================
 */

import { useContext } from "react";

import { SnackbarContext } from "./SnackbarContext";

/**
 * Access the global Snackbar functionality.
 *
 * This hook must be used inside <SnackbarProvider>.
 *
 * @throws Error when used outside SnackbarProvider.
 */
export const useSnackbar = () => {
    const context =
        useContext(SnackbarContext);

    /**
     * Fail early when the hook is used outside the provider.
     *
     * This makes configuration mistakes much easier to identify.
     */
    if (!context) {
        throw new Error(
            "useSnackbar must be used inside SnackbarProvider.",
        );
    }

    return context;
};