/**
 * ============================================================================
 * Base API
 * ============================================================================
 *
 * Purpose
 * -------
 * Creates the application's shared RTK Query API instance.
 *
 * Responsibilities
 * ----------------
 * - Configure the backend base URL.
 * - Automatically attach the JWT access token.
 * - Register common API configuration.
 *
 * Learning Notes
 * --------------
 * Every feature (Authentication, Tenant, etc.) injects its endpoints into this
 * shared API instance.
 *
 * This approach:
 *
 * ✔ Avoids duplicate configuration.
 * ✔ Automatically sends authentication headers.
 * ✔ Centralizes API behaviour.
 *
 * ============================================================================
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { STORAGE_KEYS } from "@/shared/constants";

/**
 * ============================================================================
 * Backend API Base URL
 * ============================================================================
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * ============================================================================
 * Base API
 * ============================================================================
 */
export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,

    prepareHeaders: (headers) => {
      /**
       * Retrieve the JWT access token from local storage.
       */
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      /**
       * Attach the Authorization header when a token exists.
       */
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Auth", "Tenant", "User", "MaintenanceTicket"],

  endpoints: () => ({}),
});
