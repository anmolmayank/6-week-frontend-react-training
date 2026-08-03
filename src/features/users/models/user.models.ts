/**
 * ============================================================================
 * User Models
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines request and response models used by the User feature.
 *
 * ============================================================================
 */

import type { AuthUser } from "@/features/auth/models";
import type { ApiResponse } from "@/shared/models";

/**
 * ============================================================================
 * Create User Request
 * ============================================================================
 */
export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
}

/**
 * ============================================================================
 * Create User Response
 * ============================================================================
 *
 * NOTE:
 * Update this if your backend returns the created user.
 */
export type CreateUserResponse = ApiResponse<AuthUser>;

