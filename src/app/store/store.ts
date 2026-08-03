/**
 * ============================================================================
 * Redux Store
 * ============================================================================
 *
 * Purpose
 * -------
 * Configures the application's Redux store.
 *
 * Responsibilities
 * ----------------
 * - Registers application reducers.
 * - Registers RTK Query middleware.
 * - Enables Redux DevTools during development.
 *
 * Learning Notes
 * --------------
 * This is the application's single Redux store.
 * All future reducers and RTK Query slices will be registered here.
 *
 * ============================================================================
 */

import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "@/app/api/baseApi";

import rootReducer from "./rootReducer";

/**
 * ============================================================================
 * Redux Store
 * ============================================================================
 */
export const store = configureStore({
    reducer: rootReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),

    devTools: import.meta.env.DEV,
});

/**
 * ============================================================================
 * Application Types
 * ============================================================================
 */

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;