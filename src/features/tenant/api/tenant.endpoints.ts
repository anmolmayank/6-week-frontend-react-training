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

export const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
