/**
 * ============================================================================
 * Root Reducer
 * ============================================================================
 *
 * Purpose
 * -------
 * Combines all application reducers into a single root reducer.
 *
 * Responsibilities
 * ----------------
 * - Register Redux slices.
 * - Register RTK Query reducer.
 *
 * ============================================================================
 */

import { combineReducers } from "@reduxjs/toolkit";

import { baseApi } from "../api/baseApi";

/**
 * ============================================================================
 * Root Reducer
 * ============================================================================
 */
const rootReducer = combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
});

export default rootReducer;