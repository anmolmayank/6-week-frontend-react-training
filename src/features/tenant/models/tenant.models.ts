/**
 * ============================================================================
 * Tenant Models
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines the Tenant domain models used throughout the application.
 *
 * These interfaces mirror the backend API contract.
 *
 * ============================================================================
 */

import type { ApiResponse } from "@/shared/models";

/**
 * ============================================================================
 * Rental Agreement
 * ============================================================================
 */
export interface RentalAgreement {
    /** Original upload name returned by the Node.js tenant model. */
    originalName: string;

    mimeType: string;

    size: number;

    uploadedAt: string;
}

/**
 * ============================================================================
 * Tenant
 * ============================================================================
 */
export interface Tenant {
    _id: string;

    tenantName: string;

    apartmentNumber: string;

    monthlyRent: number;

    rentalAgreement: RentalAgreement | null;

    createdAt: string;

    updatedAt: string;
}

/**
 * ============================================================================
 * Get Tenants Response
 * ============================================================================
 */
export type GetTenantsResponse = ApiResponse<Tenant[]>;

/**
 * ============================================================================
 * Create Tenant Request
 * ============================================================================
 */
export interface CreateTenantRequest {
    tenantName: string;

    apartmentNumber: string;

    monthlyRent: number;
}

/**
 * ============================================================================
 * Create Tenant Response
 * ============================================================================
 */
export type CreateTenantResponse = ApiResponse<Tenant>;

/**
 * ============================================================================
 * Update Tenant Request
 * ============================================================================
 *
 * Used for partial tenant updates.
 *
 * Rental agreement is intentionally excluded.
 * Agreement operations use dedicated endpoints.
 *
 * ============================================================================
 */
export interface UpdateTenantRequest {
    tenantName?: string;

    apartmentNumber?: string;

    monthlyRent?: number;
}

/**
 * ============================================================================
 * Update Tenant Response
 * ============================================================================
 */
export type UpdateTenantResponse = ApiResponse<Tenant>;

/** Sanitized profile returned by GET /api/v1/tenants/me. */
export interface TenantSelfProfile {
    _id: string;
    tenantName: string;
    apartmentNumber: string;
    monthlyRent: number;
    rentalAgreement: TenantSelfAgreement | null;
    createdAt: string;
    updatedAt: string;
}

/** Agreement metadata shown to the tenant; it intentionally has no disk path. */
export interface TenantSelfAgreement {
    originalName: string;
    mimeType: string;
    size: number;
    uploadedAt: string;
}
