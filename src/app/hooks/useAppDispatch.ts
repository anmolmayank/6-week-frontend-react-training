/**
 * ============================================================================
 * Redux Dispatch Hook
 * ============================================================================
 *
 * Purpose
 * -------
 * Provides a typed version of the Redux dispatch hook.
 *
 * ============================================================================
 */

import { useDispatch } from "react-redux";

import type { AppDispatch } from "../store";

/**
 * ============================================================================
 * Typed Redux Dispatch Hook
 * ============================================================================
 */
export const useAppDispatch =
    useDispatch.withTypes<AppDispatch>();