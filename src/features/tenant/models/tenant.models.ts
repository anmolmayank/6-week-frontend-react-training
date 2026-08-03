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
    fileName: string;

    mimeType: string;

    size: number;

    path: string;
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