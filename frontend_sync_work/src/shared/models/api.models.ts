/**
 * ============================================================================
 * API Response Models
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines reusable models shared across all backend API responses.
 *
 * Responsibilities
 * ----------------
 * - Standardize API response contracts.
 * - Eliminate duplicate response models.
 * - Provide strongly typed generic API responses.
 *
 * Learning Notes
 * --------------
 * Every backend response follows the same envelope:
 *
 * {
 *   success,
 *   message,
 *   data,
 *   meta
 * }
 *
 * Instead of redefining these properties for every feature,
 * we define them once and reuse them everywhere.
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * API Metadata
 * ============================================================================
 *
 * Reserved for future enhancements such as:
 * - Pagination
 * - Request tracing
 * - Execution time
 * - Additional metadata
 */
export type ApiMeta = Record<string, never>;

/**
 * ============================================================================
 * Generic API Response
 * ============================================================================
 */
export interface ApiResponse<T> {
    success: boolean;

    message: string;

    data: T;

    meta: ApiMeta;
}
