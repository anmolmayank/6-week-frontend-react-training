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
 * - User login.
 * - Persist JWT access token after successful login.
 *
 * Learning Notes
 * --------------
 * Registration is handled by the User feature because it creates
 * a new application user.
 *
 * ============================================================================
 */

import { baseApi } from "@/app/api/baseApi";
import { STORAGE_KEYS } from "@/shared/constants";

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
         * --------------------------------------------------------------------
         * Login
         * --------------------------------------------------------------------
         */
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }),

            /**
             * ----------------------------------------------------------------
             * Persist Access Token
             * ----------------------------------------------------------------
             */
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    localStorage.setItem(
                        STORAGE_KEYS.ACCESS_TOKEN,
                        data.data.accessToken
                    );
                } catch {
                    /**
                     * Errors are handled by RTK Query.
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