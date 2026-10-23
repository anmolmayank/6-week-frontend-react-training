/**
 * ============================================================================
 * Application Routes
 * ============================================================================
 * Routes are split into owner and tenant workspaces. Server-issued identity
 * from GET /auth/me selects the landing page; backend middleware remains the
 * security boundary for all protected API operations.
 * ============================================================================
 */
import { Navigate, Route, Routes } from "react-router-dom";
import { useSyncExternalStore } from "react";
import { Box, CircularProgress } from "@mui/material";
import AuthPage from "@/features/auth/AuthPage";
import TenantPage from "@/features/tenant/pages/TenantPage";
import OwnerDashboardPage from "@/features/dashboard/pages/OwnerDashboardPage";
import OwnerAgreementsPage from "@/features/dashboard/pages/OwnerAgreementsPage";
import PlaceholderPage from "@/features/dashboard/pages/PlaceholderPage";
import OwnerUsersPage from "@/features/users/pages/OwnerUsersPage";
import { TenantDashboardPage, TenantDetailsPage, TenantAgreementPage } from "@/features/tenant/pages/TenantPortalPages";
import { NewTenantTicketPage, OwnerMaintenancePage, TenantTicketsPage } from "@/features/maintenance/pages/MaintenancePages";
import WorkspaceLayout from "@/app/layouts/WorkspaceLayout";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "@/shared/constants";
import { hasAccessToken, subscribeToAuthSession, getHomeRouteForRole } from "@/features/auth/utils/authSession";
import { useGetCurrentUserQuery } from "@/features/auth/api";

function RouteLoading() {
  return (
    <Box sx={{ minHeight: "50vh", display: "grid", placeItems: "center" }}>
      <CircularProgress size={30} aria-label="Loading authenticated session" />
    </Box>
  );
}

function HomeRedirect() {
  const authenticated = useSyncExternalStore(subscribeToAuthSession, hasAccessToken, () => false);
  const identity = useGetCurrentUserQuery(undefined, { skip: !authenticated });

  if (!authenticated) return <Navigate replace to={ROUTES.LOGIN} />;
  if (identity.isLoading || identity.isFetching) return <RouteLoading />;
  if (identity.isError || !identity.data?.data?.role) return <Navigate replace to={ROUTES.LOGIN} />;
  return <Navigate replace to={getHomeRouteForRole(identity.data.data.role)} />;
}

function LegacyTenantsRedirect() {
  return <Navigate replace to={ROUTES.ROOT} />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.ROOT} element={<HomeRedirect />} />
      <Route path={ROUTES.LOGIN} element={<AuthPage />} />
      <Route path={ROUTES.LEGACY_TENANTS} element={<LegacyTenantsRedirect />} />

      <Route
        path={ROUTES.OWNER}
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <WorkspaceLayout role="owner" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate replace to="dashboard" />} />
        <Route path="dashboard" element={<OwnerDashboardPage />} />
        <Route path="tenants" element={<TenantPage />} />
        <Route path="agreements" element={<OwnerAgreementsPage />} />
        <Route path="maintenance-tickets" element={<OwnerMaintenancePage />} />
        <Route path="users" element={<OwnerUsersPage />} />
        <Route path="reports" element={<PlaceholderPage title="Reports" description="Property and financial reports will be added once the required reporting data and endpoints are defined." />} />
        <Route path="settings" element={<PlaceholderPage title="Settings" description="Property and application settings will be added in a later implementation phase." />} />
      </Route>

      <Route
        path={ROUTES.TENANT}
        element={
          <ProtectedRoute allowedRoles={["tenant"]}>
            <WorkspaceLayout role="tenant" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate replace to="dashboard" />} />
        <Route path="dashboard" element={<TenantDashboardPage />} />
        <Route path="my-details" element={<TenantDetailsPage />} />
        <Route path="my-agreement" element={<TenantAgreementPage />} />
        <Route path="maintenance-tickets" element={<TenantTicketsPage />} />
        <Route path="maintenance-tickets/new" element={<NewTenantTicketPage />} />
      </Route>

      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}
