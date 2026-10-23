/**
 * ============================================================================
 * Authentication Validation
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines client-side validation schemas for authentication forms.
 *
 * Responsibilities
 * ----------------
 * - Validate login form.
 * - Validate registration form.
 *
 * Learning Notes
 * --------------
 * These schemas mirror the backend validation rules to provide immediate
 * feedback before submitting requests.
 *
 * ============================================================================
 */

import { z } from "zod";

/**
 * ============================================================================
 * Login Validation Schema
 * ============================================================================
 */
export const loginSchema = z.object({
    email: z
        .email("Invalid email address.")
        .transform((email) => email.trim().toLowerCase()),

    password: z
        .string()
        .min(1, "Password is required."),
});

/**
 * ============================================================================
 * Register Validation Schema
 * ============================================================================
 */
export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .max(100, "Name cannot exceed 100 characters."),

    email: z
        .email("Invalid email address.")
        .transform((email) => email.trim().toLowerCase()),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(100, "Password cannot exceed 100 characters."),
});

/**
 * ============================================================================
 * Validation Types
 * ============================================================================
 */

export type LoginFormData = z.infer<typeof loginSchema>;

export type RegisterFormData = z.infer<typeof registerSchema>;