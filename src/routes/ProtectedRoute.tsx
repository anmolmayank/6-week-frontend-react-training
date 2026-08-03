/**
 * ============================================================================
 * Protected Route
 * ============================================================================
 *
 * Purpose
 * -------
 * Guards routes that require authentication.
 *
 * Learning Notes
 * --------------
 * Authentication logic will be implemented after the
 * Login feature is completed.
 *
 * ============================================================================
 */

import type { PropsWithChildren } from "react";

/**
 * ============================================================================
 * Protected Route
 * ============================================================================
 */
const ProtectedRoute = ({
    children,
}: PropsWithChildren) => {
    return children;
};

export default ProtectedRoute;