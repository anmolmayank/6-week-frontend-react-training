/**
 * ============================================================================
 * Route Constants
 * ============================================================================
 * Centralized route paths for authentication and the two role-based workspaces.
 * ============================================================================
 */
export const ROUTES = {
  ROOT: "/",
  LOGIN: "/login",
  OWNER: "/owner",
  OWNER_DASHBOARD: "/owner/dashboard",
  TENANTS: "/owner/tenants",
  OWNER_AGREEMENTS: "/owner/agreements",
  OWNER_MAINTENANCE: "/owner/maintenance-tickets",
  OWNER_USERS: "/owner/users",
  OWNER_REPORTS: "/owner/reports",
  OWNER_SETTINGS: "/owner/settings",
  TENANT: "/tenant",
  TENANT_DASHBOARD: "/tenant/dashboard",
  TENANT_DETAILS: "/tenant/my-details",
  TENANT_AGREEMENT: "/tenant/my-agreement",
  TENANT_TICKETS: "/tenant/maintenance-tickets",
  TENANT_NEW_TICKET: "/tenant/maintenance-tickets/new",
  /** Backward-compatible alias for existing bookmarks. */
  LEGACY_TENANTS: "/tenants",
} as const;
