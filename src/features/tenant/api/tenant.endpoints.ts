/**
 * ============================================================================
 * Tenant API Endpoints
 * ============================================================================
 *
 * Purpose
 * -------
 * Registers tenant-related API endpoints.
 *
 * Responsibilities
 * ----------------
 * - Get tenants.
 * - Create tenant.
 * - Update tenant.
 * - Upload rental agreement.
 * - Download rental agreement.
 * - Delete rental agreement.
 *
 * ============================================================================
 */

import { baseApi } from "@/app/api/baseApi";

import type {
    CreateTenantRequest,
    CreateTenantResponse,
    GetTenantsResponse,
    UpdateTenantRequest,
    UpdateTenantResponse,
} from "../models";

/**
 * ============================================================================
 * Tenant Endpoints
 * ============================================================================
 */

export const tenantApi =
    baseApi.injectEndpoints({
        endpoints: (builder) => ({
            /**
             * --------------------------------------------------------------
             * Get Tenants
             * --------------------------------------------------------------
             */
            getTenants:
                builder.query<
                    GetTenantsResponse,
                    void
                >({
                    query: () => ({
                        url: "/tenants",
                        method: "GET",
                    }),

                    providesTags: ["Tenant"],
                }),

            /**
             * --------------------------------------------------------------
             * Create Tenant
             * --------------------------------------------------------------
             */
            createTenant:
                builder.mutation<
                    CreateTenantResponse,
                    CreateTenantRequest
                >({
                    query: (body) => ({
                        url: "/tenants",
                        method: "POST",
                        body,
                    }),

                    invalidatesTags: [
                        "Tenant",
                    ],
                }),

            /**
             * --------------------------------------------------------------
             * Update Tenant
             * --------------------------------------------------------------
             */
            updateTenant:
                builder.mutation<
                    UpdateTenantResponse,
                    {
                        tenantId: string;
                        body: UpdateTenantRequest;
                    }
                >({
                    query: ({
                        tenantId,
                        body,
                    }) => ({
                        url: `/tenants/${tenantId}`,
                        method: "PATCH",
                        body,
                    }),

                    invalidatesTags: [
                        "Tenant",
                    ],
                }),

            /**
             * --------------------------------------------------------------
             * Upload Rental Agreement
             * --------------------------------------------------------------
             */
            uploadAgreement:
                builder.mutation<
                    void,
                    {
                        tenantId: string;
                        file: File;
                    }
                >({
                    query: ({
                        tenantId,
                        file,
                    }) => {
                        const formData =
                            new FormData();

                        formData.append(
                            "agreement",
                            file,
                        );

                        return {
                            url: `/tenants/${tenantId}/agreement`,
                            method: "POST",
                            body: formData,
                        };
                    },

                    invalidatesTags: [
                        "Tenant",
                    ],
                }),

            /**
             * --------------------------------------------------------------
             * Download Rental Agreement
             * --------------------------------------------------------------
             */
            downloadAgreement:
                builder.mutation<
                    Blob,
                    string
                >({
                    query: (tenantId) => ({
                        url: `/tenants/${tenantId}/agreement`,
                        method: "GET",

                        responseHandler:
                            (response) =>
                                response.blob(),
                    }),
                }),

            /**
             * --------------------------------------------------------------
             * Delete Rental Agreement
             * --------------------------------------------------------------
             */
            deleteAgreement:
                builder.mutation<
                    void,
                    string
                >({
                    query: (tenantId) => ({
                        url: `/tenants/${tenantId}/agreement`,
                        method: "DELETE",
                    }),

                    invalidatesTags: [
                        "Tenant",
                    ],
                }),
        }),
    });

/**
 * ============================================================================
 * RTK Query Hooks
 * ============================================================================
 */

export const {
    useGetTenantsQuery,
    useCreateTenantMutation,
    useUpdateTenantMutation,
    useUploadAgreementMutation,
    useDownloadAgreementMutation,
    useDeleteAgreementMutation,
} = tenantApi;