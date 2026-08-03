/**
 * ============================================================================
 * Redux Selector Hook
 * ============================================================================
 *
 * Purpose
 * -------
 * Provides a typed version of the Redux selector hook.
 *
 * ============================================================================
 */

import { useSelector } from "react-redux";

import type { RootState } from "../store";

/**
 * ============================================================================
 * Typed Redux Selector Hook
 * ============================================================================
 */
export const useAppSelector =
    useSelector.withTypes<RootState>();