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
 *
 * ============================================================================
 */

import { baseApi } from "@/app/api/baseApi";

import type {
  CreateTenantRequest,
  CreateTenantResponse,
  GetTenantsResponse,
} from "../models";

/**
 * ============================================================================
 * Tenant Endpoints
 * ============================================================================
 */
export const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * --------------------------------------------------------------------
     * Get Tenants
     * --------------------------------------------------------------------
     */
    getTenants: builder.query<GetTenantsResponse, void>({
      query: () => ({
        url: "/tenants",
        method: "GET",
      }),

      providesTags: ["Tenant"],
    }),

    /**
     * --------------------------------------------------------------------
     * Create Tenant
     * --------------------------------------------------------------------
     */
    createTenant: builder.mutation<CreateTenantResponse, CreateTenantRequest>({
      query: (body) => ({
        url: "/tenants",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Tenant"],
    }),

    /**
     * --------------------------------------------------------------------
     * Upload Rental Agreement
     * --------------------------------------------------------------------
     */
    uploadAgreement: builder.mutation<
      void,
      {
        tenantId: string;
        file: File;
      }
    >({
      query: ({ tenantId, file }) => {
        const formData = new FormData();

        formData.append("agreement", file);

        return {
          url: `/tenants/${tenantId}/agreement`,
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: ["Tenant"],
    }),

    /**
     * --------------------------------------------------------------------
     * Download Rental Agreement
     * --------------------------------------------------------------------
     */
    downloadAgreement: builder.mutation<Blob, string>({
      query: (tenantId) => ({
        url: `/tenants/${tenantId}/agreement`,
        method: "GET",

        /**
         * Tell fetchBaseQuery to return a Blob.
         */
        responseHandler: (response) => response.blob(),
      }),
    }),

    /**
     * --------------------------------------------------------------------
     * Delete Rental Agreement
     * --------------------------------------------------------------------
     */
    deleteAgreement: builder.mutation<void, string>({
      query: (tenantId) => ({
        url: `/tenants/${tenantId}/agreement`,
        method: "DELETE",
      }),

      invalidatesTags: ["Tenant"],
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
  useUploadAgreementMutation,
  useDownloadAgreementMutation,
  useDeleteAgreementMutation,
} = tenantApi;
