/**
 * ============================================================================
 * Application Routes
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines the application's route configuration.
 *
 * Responsibilities
 * ----------------
 * - Register public routes.
 * - Register protected routes.
 * - Register fallback routes.
 *
 * Learning Notes
 * --------------
 * This file should only contain routing configuration.
 *
 * Business logic belongs inside feature pages.
 *
 * ============================================================================
 */

import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";
import AuthPage from "@/features/auth/AuthPage";
import { TenantPage } from "@/features/tenant";
import { ROUTES } from "@/shared/constants";

/**
 * ============================================================================
 * Placeholder Pages
 * ============================================================================
 *
 * These will be replaced by real feature pages shortly.
 * ============================================================================
 */

/**
 * ============================================================================
 * Application Routes
 * ============================================================================
 */
const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate replace to="/login" />}
            />

            <Route
                path={ROUTES.LOGIN}
                element={<AuthPage />}
            />

            <Route
                path={ROUTES.TENANTS}
                element={<TenantPage />}
            />

            <Route
                path="*"
                element={<Navigate replace to="/login" />}
            />
        </Routes>
    );
};

export default AppRoutes;