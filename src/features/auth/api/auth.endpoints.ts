/**
 * ============================================================================
 * Authentication API Endpoints
 * ============================================================================
 * Login persists the token and backend-issued user identity. GET /auth/me is
 * the source of truth when restoring a session from browser storage.
 * ============================================================================
 */
import { baseApi } from "@/app/api/baseApi";
import { clearAuthSession, saveAuthSession, saveAuthenticatedUser } from "../utils/authSession";
import type { LoginRequest, LoginResponse, AuthUser } from "../models";
import type { ApiResponse } from "@/shared/models";

type CurrentUserResponse = ApiResponse<AuthUser>;

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          saveAuthSession(data.data.accessToken, data.data.user);
        } catch {
          // The login form displays the RTK Query error to the user.
        }
      },
      invalidatesTags: ["Auth"],
    }),

    /** Refreshes persisted role/tenant association from the authenticated API. */
    getCurrentUser: builder.query<CurrentUserResponse, void>({
      query: () => ({ url: "/auth/me", method: "GET" }),
      providesTags: ["Auth"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          saveAuthenticatedUser(data.data);
        } catch (caught: unknown) {
          const rejection = caught as { error?: { status?: number | string } };
          if (rejection.error?.status === 401) {
            clearAuthSession();
          }
        }
      },
    }),
  }),
});

export const { useLoginMutation, useGetCurrentUserQuery } = authApi;
