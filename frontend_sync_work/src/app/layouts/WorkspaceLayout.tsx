/**
 * ============================================================================
 * Workspace Layout
 * ============================================================================
 * Shared responsive shell for Owner and Tenant areas. Feature pages render in
 * the Outlet; this component owns navigation, header, and session actions.
 * ============================================================================
 */
import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Breadcrumbs,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/app/hooks/useAppDispatch";
import { baseApi } from "@/app/api/baseApi";
import { ROUTES } from "@/shared/constants";
import { clearAuthSession, getAuthenticatedUser } from "@/features/auth/utils/authSession";
import type { UserRole } from "@/features/auth/models";

const SIDEBAR_WIDTH = 256;

interface NavigationItem {
  label: string;
  path: string;
  icon: typeof DashboardRoundedIcon;
}

const ownerNavigation: NavigationItem[] = [
  { label: "Overview", path: ROUTES.OWNER_DASHBOARD, icon: DashboardRoundedIcon },
  { label: "Tenants", path: ROUTES.TENANTS, icon: PeopleAltRoundedIcon },
  { label: "Rental Agreements", path: ROUTES.OWNER_AGREEMENTS, icon: DescriptionRoundedIcon },
  { label: "Maintenance Tickets", path: ROUTES.OWNER_MAINTENANCE, icon: BuildRoundedIcon },
  { label: "Users", path: ROUTES.OWNER_USERS, icon: GroupRoundedIcon },
  { label: "Reports", path: ROUTES.OWNER_REPORTS, icon: BarChartRoundedIcon },
  { label: "Settings", path: ROUTES.OWNER_SETTINGS, icon: SettingsRoundedIcon },
];

const tenantNavigation: NavigationItem[] = [
  { label: "My Dashboard", path: ROUTES.TENANT_DASHBOARD, icon: HomeRoundedIcon },
  { label: "My Details", path: ROUTES.TENANT_DETAILS, icon: PersonOutlineRoundedIcon },
  { label: "My Agreement", path: ROUTES.TENANT_AGREEMENT, icon: DescriptionRoundedIcon },
  { label: "Maintenance Tickets", path: ROUTES.TENANT_TICKETS, icon: ConfirmationNumberRoundedIcon },
];

interface WorkspaceLayoutProps {
  readonly role: UserRole;
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase() || "U";
}

export default function WorkspaceLayout({ role }: WorkspaceLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);
  const user = getAuthenticatedUser();
  const navigation = role === "tenant" ? tenantNavigation : ownerNavigation;
  const activeItem = navigation.find((item) => location.pathname === item.path)
    ?? navigation.find((item) => location.pathname.startsWith(`${item.path}/`));
  const displayName = user?.name || (role === "tenant" ? "Tenant" : "Property Owner");
  const roleLabel = role === "tenant" ? "Tenant Portal" : "Owner Workspace";

  const handleLogout = () => {
    clearAuthSession();
    dispatch(baseApi.util.resetApiState());
    setProfileAnchor(null);
    void navigate(ROUTES.LOGIN, { replace: true });
  };

  const renderNavigation = () => (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", color: "#E8F0F8" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, px: 2.5, py: 2.5, minHeight: 78 }}>
        <ApartmentRoundedIcon sx={{ color: role === "tenant" ? "#50D5BA" : "#66B2FF", fontSize: 31 }} />
        <Box>
          <Typography sx={{ color: "#FFFFFF", fontSize: 20, lineHeight: 1.1, fontWeight: 750, letterSpacing: -0.5 }}>
            EstateFlow
          </Typography>
          <Typography sx={{ color: "#9EB3C9", fontSize: 10.5, mt: 0.4 }}>
            {roleLabel}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
      <Typography sx={{ px: 2.5, pt: 2.75, pb: 1, color: "#829BB4", fontSize: 10, letterSpacing: 1.4, fontWeight: 700 }}>
        WORKSPACE
      </Typography>

      <List sx={{ px: 1.25, py: 0, flex: 1 }}>
        {navigation.map((item) => {
          const Icon = item.icon;
          const selected = location.pathname === item.path
            || (item.path !== ROUTES.OWNER_DASHBOARD && item.path !== ROUTES.TENANT_DASHBOARD && location.pathname.startsWith(`${item.path}/`));

          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => {
                void navigate(item.path);
                setMobileNavigationOpen(false);
              }}
              sx={{
                minHeight: 44,
                mb: 0.5,
                px: 1.5,
                borderRadius: 2,
                color: selected ? "#FFFFFF" : "#CDDAE7",
                "& .MuiListItemIcon-root": { minWidth: 36, color: "inherit" },
                "&.Mui-selected": {
                  color: "#FFFFFF",
                  backgroundColor: role === "tenant" ? "rgba(22, 171, 142, 0.28)" : "rgba(39, 129, 230, 0.28)",
                  boxShadow: `inset 3px 0 0 ${role === "tenant" ? "#41D0B0" : "#64B5FF"}`,
                },
                "&.Mui-selected:hover": { backgroundColor: role === "tenant" ? "rgba(22, 171, 142, 0.34)" : "rgba(39, 129, 230, 0.35)" },
                "&:hover": { backgroundColor: "rgba(255,255,255,0.07)" },
              }}
            >
              <ListItemIcon><Icon fontSize="small" /></ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: 13,
                      fontWeight: selected ? 700 : 500,
                    },
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.25 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: role === "tenant" ? "#0F8D7A" : "#2A7ED0", fontSize: 13, fontWeight: 700 }}>
          {initials(displayName)}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography noWrap sx={{ color: "white", fontSize: 12.5, fontWeight: 700 }}>{displayName}</Typography>
          <Typography sx={{ color: "#9EB3C9", fontSize: 11 }}>{role === "tenant" ? "Tenant" : "Owner"}</Typography>
        </Box>
        <Tooltip title="Account options">
          <IconButton size="small" onClick={(event) => setProfileAnchor(event.currentTarget)} aria-label="Account options" sx={{ color: "#C9D8E6" }}>
            <KeyboardArrowDownRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F3F6FA", color: "#14253F" }}>
      <Box component="nav" aria-label="Primary navigation" sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileNavigationOpen}
          onClose={() => setMobileNavigationOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH, boxSizing: "border-box", bgcolor: role === "tenant" ? "#073F3B" : "#102B46", border: 0 } }}
        >
          {renderNavigation()}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH, boxSizing: "border-box", bgcolor: role === "tenant" ? "#073F3B" : "#102B46", border: 0, position: "fixed" } }}
        >
          {renderNavigation()}
        </Drawer>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #E5EBF2", bgcolor: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)" }}>
          <Toolbar sx={{ minHeight: "64px !important", px: { xs: 1.5, sm: 3 } }}>
            <IconButton onClick={() => setMobileNavigationOpen(true)} aria-label="Open navigation" sx={{ display: { md: "none" }, mr: 1 }}>
              <MenuRoundedIcon />
            </IconButton>
            <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ color: "text.secondary", fontSize: 12.5 }}>Property Management</Typography>
              <Typography noWrap sx={{ color: "text.primary", fontSize: 12.5, fontWeight: 650 }}>{activeItem?.label ?? roleLabel}</Typography>
            </Breadcrumbs>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "right" }}>
                <Typography sx={{ fontSize: 12.5, fontWeight: 700 }}>{displayName}</Typography>
                <Typography sx={{ fontSize: 10.5, color: "text.secondary" }}>{role === "tenant" ? "Tenant account" : "Property owner"}</Typography>
              </Box>
              <Avatar sx={{ width: 34, height: 34, bgcolor: role === "tenant" ? "#C8F2E8" : "#DCEBFF", color: role === "tenant" ? "#087B6A" : "#1769AA", fontSize: 12.5, fontWeight: 800 }}>
                {initials(displayName)}
              </Avatar>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ width: "100%", maxWidth: 1680, mx: "auto", p: { xs: 2, sm: 3, lg: 3.5 }, flex: 1 }}>
          <Outlet />
        </Box>
      </Box>

      <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={() => setProfileAnchor(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}>
        <MenuItem onClick={handleLogout} sx={{ gap: 1.25 }}>
          <LogoutRoundedIcon fontSize="small" />
          <Typography sx={{ fontSize: 13 }}>Sign out</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
