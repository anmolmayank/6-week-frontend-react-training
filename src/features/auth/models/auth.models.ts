/**
 * ============================================================================
 * Authentication Models
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines all request and response models used by the Authentication feature.
 *
 * These models mirror the backend API contract exactly.
 *
 * ============================================================================
 */

import type { ApiResponse } from "@/shared/models";

/**
 * ============================================================================
 * Login Request
 * ============================================================================
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * ============================================================================
 * Register Request
 * ============================================================================
 */
export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

/**
 * Supported application roles. The backend must return and enforce this role.
 */
export type UserRole = "owner" | "tenant";

/**
 * ============================================================================
 * Authenticated User
 * ============================================================================
 */
export interface AuthUser {
    _id: string;

    name: string;

    email: string;

    /** Persisted role returned by the Node authentication API. */
    role: UserRole;

    /** Linked tenant record ID; null when the tenant account is not linked yet. */
    tenantId: string | null;

    /** These timestamps are included in login/user responses but omitted by /auth/me. */
    createdAt?: string;

    updatedAt?: string;
}

/**
 * ============================================================================
 * Login Response Data
 * ============================================================================
 */
export interface LoginResponseData {
    user: AuthUser;

    accessToken: string;
}

/**
 * ============================================================================
 * Login Response
 * ============================================================================
 */
export type LoginResponse = ApiResponse<LoginResponseData>;

/**
 * ============================================================================
 * Register Response
 * ============================================================================
 */
export type RegisterResponse = ApiResponse<null>;