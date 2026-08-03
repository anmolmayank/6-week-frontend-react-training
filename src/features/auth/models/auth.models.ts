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
 * ============================================================================
 * Authenticated User
 * ============================================================================
 */
export interface AuthUser {
    _id: string;

    name: string;

    email: string;

    createdAt: string;

    updatedAt: string;
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