
/**
 * ============================================================================
 * Authentication API Endpoints
 * ============================================================================
 *
 * Purpose
 * -------
 * Registers authentication-related API endpoints.
 *
 * Responsibilities
 * ----------------
 * - Authenticate users through the login endpoint.
 * - Persist the access token after successful login.
 * - Notify the application when authentication changes.
 *
 * Learning Notes
 * --------------
 * RTK Query remains responsible for the login request lifecycle.
 * Session utilities synchronize UI visibility with token changes.
 *
 * ============================================================================
 */

import { baseApi } from "@/app/api/baseApi";
import { STORAGE_KEYS } from "@/shared/constants";

import { notifyAuthSessionChanged } from "../utils/authSession";

import type {
  LoginRequest,
  LoginResponse,
} from "../models";

/**
 * ============================================================================
 * Authentication Endpoints
 * ============================================================================
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * ------------------------------------------------------------------------
     * Login
     * ------------------------------------------------------------------------
     *
     * Persists the access token only after the login request succeeds.
     */
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),

      /**
       * ----------------------------------------------------------------------
       * Persist Access Token
       * ----------------------------------------------------------------------
       */
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          localStorage.setItem(
            STORAGE_KEYS.ACCESS_TOKEN,
            data.data.accessToken,
          );

          // Make the new session visible to subscribed UI components.
          notifyAuthSessionChanged();
        } catch {
          /**
           * Login errors remain available through the RTK Query mutation
           * result and are handled by the login form.
           */
        }
      },

      invalidatesTags: ["Auth"],
    }),
  }),
});

/**
 * ============================================================================
 * RTK Query Hooks
 * ============================================================================
 */
export const {
  useLoginMutation,
} = authApi;
