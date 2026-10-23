/**
 * ============================================================================
 * Protected Route
 * ============================================================================
 * The authenticated identity and role are refreshed from GET /auth/me before
 * rendering a protected workspace. These checks improve navigation UX; every
 * permission must still be enforced by the Node.js API.
 * ============================================================================
 */
import { useSyncExternalStore, type PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { hasAccessToken, subscribeToAuthSession, getHomeRouteForRole } from "@/features/auth/utils/authSession";
import { useGetCurrentUserQuery } from "@/features/auth/api";
import type { UserRole } from "@/features/auth/models";
import { ROUTES } from "@/shared/constants";

type ProtectedRouteProps = Readonly<
  PropsWithChildren<{
    allowedRoles?: readonly UserRole[];
  }>
>;

function RouteLoading() {
  return (
    <Box sx={{ minHeight: "50vh", display: "grid", placeItems: "center" }}>
      <CircularProgress size={30} aria-label="Loading authenticated session" />
    </Box>
  );
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const authenticated = useSyncExternalStore(
    subscribeToAuthSession,
    hasAccessToken,
    () => false,
  );
  const identity = useGetCurrentUserQuery(undefined, { skip: !authenticated });

  if (!authenticated) return <Navigate replace to={ROUTES.LOGIN} />;
  if (identity.isLoading || identity.isFetching) return <RouteLoading />;
  if (identity.isError || !identity.data?.data?.role) {
    return <Navigate replace to={ROUTES.LOGIN} />;
  }

  const role = identity.data.data.role;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate replace to={getHomeRouteForRole(role)} />;
  }

  return children;
}
