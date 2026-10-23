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
 * - Delete tenant.
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
  TenantSelfProfile,
} from "../models";
import type { ApiResponse } from "@/shared/models";

/**
 * ============================================================================
 * Tenant Endpoints
 * ============================================================================
 */

export const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Tenant-scoped profile: identity comes from the authenticated session. */
    getMyTenant: builder.query<ApiResponse<TenantSelfProfile>, void>({
      query: () => ({ url: "/tenants/me", method: "GET" }),
      providesTags: [{ type: "Tenant", id: "ME" }],
    }),

    /** Downloads only the agreement linked to the authenticated tenant. */
    downloadMyAgreement: builder.mutation<Blob, void>({
      query: () => ({
        url: "/tenants/me/agreement",
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),

    /**
     * --------------------------------------------------------------
     * Get Tenants
     * --------------------------------------------------------------
     */
    getTenants: builder.query<GetTenantsResponse, void>({
      query: () => ({
        url: "/tenants",
        method: "GET",
      }),

      /**
       * Provide:
       *
       * Tenant list tag
       * Individual tenant tags
       */
      providesTags: (result) => {
        if (!result) {
          return [
            {
              type: "Tenant",
              id: "LIST",
            },
          ];
        }

        return [
          {
            type: "Tenant",
            id: "LIST",
          },

          ...result.data.map((tenant) => ({
            type: "Tenant" as const,
            id: tenant._id,
          })),
        ];
      },
    }),

    /**
     * --------------------------------------------------------------
     * Create Tenant
     * --------------------------------------------------------------
     */
    createTenant: builder.mutation<CreateTenantResponse, CreateTenantRequest>({
      query: (body) => ({
        url: "/tenants",
        method: "POST",
        body,
      }),

      /**
       * Creating a tenant changes
       * the tenant list.
       */
      invalidatesTags: [
        {
          type: "Tenant",
          id: "LIST",
        },
      ],
    }),
    /**
     * --------------------------------------------------------------
     * Update Tenant
     * --------------------------------------------------------------
     */
    updateTenant: builder.mutation<
      UpdateTenantResponse,
      {
        tenantId: string;
        body: UpdateTenantRequest;
      }
    >({
      query: ({ tenantId, body }) => ({
        url: `/tenants/${tenantId}`,
        method: "PATCH",
        body,
      }),

      /**
       * ----------------------------------------------------------
       * Optimistic Cache Update
       * ----------------------------------------------------------
       *
       * Update the cached tenant list immediately instead of
       * waiting for the PATCH request to complete.
       */
      async onQueryStarted({ tenantId, body }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tenantApi.util.updateQueryData("getTenants", undefined, (draft) => {
            const tenant = draft.data.find((item) => item._id === tenantId);

            if (!tenant) {
              return;
            }

            /**
             * Update only the fields
             * supplied by the PATCH request.
             */
            Object.assign(tenant, body);
          }),
        );

        try {
          /**
           * Wait for the backend request.
           */
          await queryFulfilled;
        } catch {
          /**
           * Backend request failed.
           *
           * Roll back the optimistic
           * cache update.
           */
          patchResult.undo();
        }
      },

      /**
       * ----------------------------------------------------------
       * Cache Invalidation
       * ----------------------------------------------------------
       *
       * Keep the affected tenant cache synchronized with the
       * server after the mutation.
       */
      invalidatesTags: (_result, _error, { tenantId }) => [
        {
          type: "Tenant",
          id: tenantId,
        },
      ],
    }),

    /**
     * --------------------------------------------------------------
     * Delete Tenant
     * --------------------------------------------------------------
     *
     * Expects the backend to expose DELETE /api/v1/tenants/:tenantId.
     * The Node route must enforce owner authorization and handle linked
     * agreement/file cleanup according to the backend's retention rules.
     */
    deleteTenant: builder.mutation<void, string>({
      query: (tenantId) => ({
        url: `/tenants/${tenantId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, tenantId) => [
        { type: "Tenant", id: "LIST" },
        { type: "Tenant", id: tenantId },
      ],
    }),

    /**
     * --------------------------------------------------------------
     * Upload Rental Agreement
     * --------------------------------------------------------------
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

      /**
       * Only the affected tenant
       * needs to be refreshed.
       */
      invalidatesTags: (_result, _error, { tenantId }) => [
        {
          type: "Tenant",
          id: tenantId,
        },
        { type: "Tenant", id: "ME" },
      ],
    }),

    /**
     * --------------------------------------------------------------
     * Download Rental Agreement
     * --------------------------------------------------------------
     */
    downloadAgreement: builder.mutation<Blob, string>({
      query: (tenantId) => ({
        url: `/tenants/${tenantId}/agreement`,
        method: "GET",

        responseHandler: (response) => response.blob(),
      }),
    }),

    /**
     * --------------------------------------------------------------
     * Delete Rental Agreement
     * --------------------------------------------------------------
     */
    deleteAgreement: builder.mutation<void, string>({
      query: (tenantId) => ({
        url: `/tenants/${tenantId}/agreement`,
        method: "DELETE",
      }),

      /**
       * Only the affected tenant
       * needs to be refreshed.
       */
      invalidatesTags: (_result, _error, tenantId) => [
        {
          type: "Tenant",
          id: tenantId,
        },
        { type: "Tenant", id: "ME" },
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
  useGetMyTenantQuery,
  useDownloadMyAgreementMutation,
  useCreateTenantMutation,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
  useUploadAgreementMutation,
  useDownloadAgreementMutation,
  useDeleteAgreementMutation,
} = tenantApi;
