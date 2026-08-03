/**
 * ============================================================================
 * User API Endpoints
 * ============================================================================
 *
 * Purpose
 * -------
 * Registers user-related API endpoints.
 *
 * Responsibilities
 * ----------------
 * - Create user.
 *
 * ============================================================================
 */

import { baseApi } from "@/app/api/baseApi";

import type {
    CreateUserRequest,
    CreateUserResponse,
} from "../models";

/**
 * ============================================================================
 * User Endpoints
 * ============================================================================
 */
export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * --------------------------------------------------------------------
         * Create User
         * --------------------------------------------------------------------
         */
        createUser: builder.mutation<
            CreateUserResponse,
            CreateUserRequest
        >({
            query: (body) => ({
                url: "/users",
                method: "POST",
                body,
            }),
        }),
    }),
});

/**
 * ============================================================================
 * RTK Query Hooks
 * ============================================================================
 */
export const {
    useCreateUserMutation,
} = userApi;