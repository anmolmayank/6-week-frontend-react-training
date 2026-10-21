/**
 * ============================================================================
 * API Error Utilities
 * ============================================================================
 *
 * Purpose
 * -------
 * Provides reusable utilities for extracting meaningful error messages from
 * RTK Query API errors.
 *
 * Responsibilities
 * ----------------
 * - Extract backend API error messages.
 * - Provide a fallback message when no backend message is available.
 *
 * ============================================================================
 */

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import type { ApiErrorResponse } from "../models";

/**
 * ============================================================================
 * Get API Error Message
 * ============================================================================
 *
 * Extracts the error message returned by the backend.
 *
 * If the backend does not provide a usable message, the supplied fallback
 * message is returned.
 *
 * ============================================================================
 */

export const getApiErrorMessage = (
    error: unknown,
    fallbackMessage: string,
): string => {
    const apiResponse =
        error as FetchBaseQueryError & {
            data?: ApiErrorResponse;
        };

    return (
        apiResponse.data?.message ??
        fallbackMessage
    );
};