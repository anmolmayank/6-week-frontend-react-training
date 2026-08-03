/**
 * ============================================================================
 * Tenant Validation
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines client-side validation for Tenant forms.
 *
 * ============================================================================
 */

import { z } from "zod";

/**
 * ============================================================================
 * Create Tenant Schema
 * ============================================================================
 */
export const createTenantSchema = z.object({
  tenantName: z
    .string()
    .trim()
    .min(2, "Tenant name must be at least 2 characters.")
    .max(100, "Tenant name cannot exceed 100 characters."),

  apartmentNumber: z
    .string()
    .trim()
    .min(1, "Apartment number is required.")
    .max(20, "Apartment number cannot exceed 20 characters."),

  monthlyRent: z
    .number({
      error: "Monthly rent is required.",
    })
    .min(0, "Monthly rent cannot be negative."),
});

/**
 * ============================================================================
 * Validation Types
 * ============================================================================
 */
export type CreateTenantFormData = z.infer<typeof createTenantSchema>;
