/**
 * ============================================================================
 * File: SnackbarProvider.tsx
 * ============================================================================
 *
 * Purpose
 * -------
 * Provides a global Snackbar notification system for the application.
 *
 * Responsibilities
 * ----------------
 * - Manage Snackbar state.
 * - Display success notifications.
 * - Display error notifications.
 * - Display warning notifications.
 * - Display informational notifications.
 * - Expose notification methods through React Context.
 *
 * ============================================================================
 */

import {
    Alert,
    Snackbar,
} from "@mui/material";

import {
    useCallback,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import {
    SnackbarContext,
    type SnackbarContextValue,
} from "./SnackbarContext";

/**
 * ============================================================================
 * Types
 * ============================================================================
 */

/**
 * Supported Snackbar severity levels.
 */
type SnackbarSeverity =
    | "success"
    | "error"
    | "warning"
    | "info";

/**
 * Internal Snackbar state.
 */
interface SnackbarState {
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
}

/**
 * Props accepted by SnackbarProvider.
 */
interface SnackbarProviderProps {
    children: ReactNode;
}

/**
 * ============================================================================
 * Provider
 * ============================================================================
 */

/**
 * Provides global Snackbar functionality to the application.
 */
export const SnackbarProvider = ({
    children,
}: SnackbarProviderProps) => {
    /**
     * ------------------------------------------------------------------------
     * Snackbar state
     * ------------------------------------------------------------------------
     */
    const [snackbar, setSnackbar] =
        useState<SnackbarState>({
            open: false,
            message: "",
            severity: "info",
        });

    /**
     * ------------------------------------------------------------------------
     * Close Snackbar
     * ------------------------------------------------------------------------
     */
    const close = useCallback(() => {
        setSnackbar((current) => ({
            ...current,
            open: false,
        }));
    }, []);

    /**
     * ------------------------------------------------------------------------
     * Show Snackbar
     * ------------------------------------------------------------------------
     *
     * Central function used by all notification methods.
     */
    const show = useCallback(
        (
            message: string,
            severity: SnackbarSeverity,
        ) => {
            setSnackbar({
                open: true,
                message,
                severity,
            });
        },
        [],
    );

    /**
     * ------------------------------------------------------------------------
     * Success notification
     * ------------------------------------------------------------------------
     */
    const success = useCallback(
        (message: string) => {
            show(message, "success");
        },
        [show],
    );

    /**
     * ------------------------------------------------------------------------
     * Error notification
     * ------------------------------------------------------------------------
     */
    const error = useCallback(
        (message: string) => {
            show(message, "error");
        },
        [show],
    );

    /**
     * ------------------------------------------------------------------------
     * Warning notification
     * ------------------------------------------------------------------------
     */
    const warning = useCallback(
        (message: string) => {
            show(message, "warning");
        },
        [show],
    );

    /**
     * ------------------------------------------------------------------------
     * Information notification
     * ------------------------------------------------------------------------
     */
    const info = useCallback(
        (message: string) => {
            show(message, "info");
        },
        [show],
    );

    /**
     * ------------------------------------------------------------------------
     * Context value
     * ------------------------------------------------------------------------
     *
     * Memoization prevents unnecessary Context value changes.
     */
    const contextValue: SnackbarContextValue =
        useMemo(
            () => ({
                success,
                error,
                warning,
                info,
                close,
            }),
            [
                success,
                error,
                warning,
                info,
                close,
            ],
        );

    return (
        <SnackbarContext.Provider
            value={contextValue}
        >
            {children}

            {/* --------------------------------------------------------------
                Global Snackbar
                -------------------------------------------------------------- */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={close}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert
                    onClose={close}
                    severity={snackbar.severity}
                    variant="filled"
                    elevation={6}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};