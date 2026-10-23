/**
 * ============================================================================
 * Owner Dashboard
 * ============================================================================
 * Portfolio overview derived from the tenant and maintenance-ticket APIs.
 * Historical income trends remain outside the current API contract.
 * ============================================================================
 */
import type { ElementType, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import { ROUTES } from "@/shared/constants";
import { useGetTenantsQuery } from "@/features/tenant/api";
import { useGetOwnerMaintenanceTicketsQuery } from "@/features/maintenance/api";
import type { Tenant } from "@/features/tenant/models";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

function getInitials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase();
}

interface MetricCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly note: string;
  readonly icon: ElementType;
  readonly tone: "blue" | "green" | "amber" | "violet";
}

const metricTones = {
  blue: { background: "#E7F0FF", color: "#206CCB" },
  green: { background: "#E2F7ED", color: "#14805E" },
  amber: { background: "#FFF2DC", color: "#B97612" },
  violet: { background: "#F0E9FF", color: "#7552C8" },
};

function MetricCard({ title, value, note, icon: Icon, tone }: MetricCardProps) {
  const colors = metricTones[tone];
  return (
    <Paper elevation={0} sx={{ p: 2.25, minWidth: 0, border: "1px solid #E6ECF3", borderRadius: 3, background: "#FFFFFF" }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 550, color: "text.secondary" }}>{title}</Typography>
          <Typography variant="h5" sx={{ mt: 1, fontSize: { xs: 22, sm: 26 }, fontWeight: 760, letterSpacing: -0.8, color: "#172B48", overflowWrap: "anywhere" }}>
            {value}
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "text.secondary" }}>{note}</Typography>
        </Box>
        <Box sx={{ width: 44, height: 44, flexShrink: 0, display: "grid", placeItems: "center", borderRadius: 2.5, bgcolor: colors.background, color: colors.color }}>
          <Icon />
        </Box>
      </Stack>
    </Paper>
  );
}

function TenantMiniRow({ tenant }: Readonly<{ tenant: Tenant }>) {
  const hasAgreement = Boolean(tenant.rentalAgreement);
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1.4fr) minmax(70px, 0.7fr)", sm: "minmax(180px, 1.5fr) minmax(90px, 0.7fr) minmax(100px, 0.8fr) minmax(110px, 0.9fr)" }, alignItems: "center", gap: 1.5, px: { xs: 1.5, sm: 2 }, py: 1.6 }}>
      <Stack direction="row" spacing={1.25} sx={{ minWidth: 0, alignItems: "center" }}>
        <Avatar sx={{ width: 34, height: 34, bgcolor: "#E4EEFF", color: "#2167B7", fontSize: 11.5, fontWeight: 750 }}>{getInitials(tenant.tenantName)}</Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography noWrap sx={{ fontSize: 13, fontWeight: 650 }}>{tenant.tenantName}</Typography>
          <Typography sx={{ display: { xs: "block", sm: "none" }, color: "text.secondary", fontSize: 11.5 }}>{tenant.apartmentNumber}</Typography>
        </Box>
      </Stack>
      <Typography sx={{ display: { xs: "none", sm: "block" }, fontSize: 12.5 }}>{tenant.apartmentNumber}</Typography>
      <Typography noWrap sx={{ fontSize: 12.5, fontWeight: 600 }}>{formatCurrency(tenant.monthlyRent)}</Typography>
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <Chip size="small" label={hasAgreement ? "Uploaded" : "Not uploaded"} sx={{ fontWeight: 650, fontSize: 10.5, bgcolor: hasAgreement ? "#E5F7ED" : "#FFF2DD", color: hasAgreement ? "#16734C" : "#96610F" }} />
      </Box>
    </Box>
  );
}

export default function OwnerDashboardPage() {
  const { data, isLoading, isError, refetch, isFetching } = useGetTenantsQuery();
  const ticketsQuery = useGetOwnerMaintenanceTicketsQuery();
  const tickets = ticketsQuery.data?.data ?? [];
  const openTickets = tickets.filter((ticket) => ticket.status === "open" || ticket.status === "in_progress").length;
  const tenants = data?.data ?? [];
  const totalTenants = tenants.length;
  const agreementsUploaded = tenants.filter((tenant) => Boolean(tenant.rentalAgreement)).length;
  const agreementsPending = totalTenants - agreementsUploaded;
  const monthlyRent = tenants.reduce((total, tenant) => total + (Number(tenant.monthlyRent) || 0), 0);
  const recentTenants = [...tenants].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);
  const tenantNoun = totalTenants === 1 ? "tenant" : "tenants";
  const recentTenantsSummary = isLoading
    ? "Loading portfolio data…"
    : `Showing ${recentTenants.length} of ${totalTenants} ${tenantNoun}`;
  let ticketsSummary: string;
  if (ticketsQuery.isLoading) {
    ticketsSummary = "Loading maintenance ticket summary…";
  } else if (ticketsQuery.isError) {
    ticketsSummary = "Ticket summary could not be loaded. Open the workspace to retry.";
  } else {
    ticketsSummary = `${tickets.length} total request${tickets.length === 1 ? "" : "s"}; ${openTickets} open or in progress.`;
  }

  let recentTenantsContent: ReactNode;
  if (isLoading) {
    recentTenantsContent = (
      <Box sx={{ py: 6, display: "grid", placeItems: "center" }}>
        <CircularProgress size={28} />
      </Box>
    );
  } else if (recentTenants.length === 0) {
    recentTenantsContent = (
      <Box sx={{ py: 6, px: 3, textAlign: "center" }}>
        <ApartmentOutlinedIcon sx={{ fontSize: 36, color: "#9AAABC" }} />
        <Typography sx={{ mt: 1, fontWeight: 700 }}>No tenant records yet</Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
          Add your first tenant to start managing rental information.
        </Typography>
        <Button component={RouterLink} to={ROUTES.TENANTS} sx={{ mt: 1.5 }}>
          Add a tenant
        </Button>
      </Box>
    );
  } else {
    recentTenantsContent = (
      <>
        {recentTenants.map((tenant, index) => (
          <Box key={tenant._id}>
            <TenantMiniRow tenant={tenant} />
            {index < recentTenants.length - 1 && <Divider sx={{ borderColor: "#EEF1F5" }} />}
          </Box>
        ))}
      </>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontSize: { xs: 25, md: 30 }, fontWeight: 800, letterSpacing: -1, color: "#142844" }}>Welcome back!</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13.5, color: "text.secondary" }}>Here’s what’s happening across your property portfolio.</Typography>
        </Box>
        <Stack direction="row" spacing={1.25}>
          <Button variant="outlined" startIcon={<RefreshRoundedIcon />} onClick={() => void refetch()} disabled={isFetching} sx={{ borderColor: "#D8E1EC", color: "#35516E", bgcolor: "#FFFFFF" }}>Refresh</Button>
          <Button component={RouterLink} to={ROUTES.TENANTS} variant="contained" startIcon={<PeopleAltOutlinedIcon />} sx={{ boxShadow: "none" }}>Manage tenants</Button>
        </Stack>
      </Stack>

      {isError && <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => void refetch()}>Retry</Button>}>Tenant summary could not be loaded. Check that the Node API is running and that your account is authorized.</Alert>}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", xl: "repeat(4, minmax(0, 1fr))" }, gap: 2 }}>
        <MetricCard title="Total tenants" value={isLoading ? "—" : totalTenants} note="Tenant records in the portfolio" icon={PeopleAltOutlinedIcon} tone="blue" />
        <MetricCard title="Agreements uploaded" value={isLoading ? "—" : agreementsUploaded} note="Tenants with an agreement on file" icon={DescriptionOutlinedIcon} tone="green" />
        <MetricCard title="Pending agreements" value={isLoading ? "—" : agreementsPending} note="Tenants still needing an agreement" icon={PendingActionsOutlinedIcon} tone="amber" />
        <MetricCard title="Monthly rental income" value={isLoading ? "—" : formatCurrency(monthlyRent)} note="Calculated from current tenant records" icon={CurrencyRupeeOutlinedIcon} tone="violet" />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1.65fr) minmax(300px, 1fr)" }, gap: 2.5, alignItems: "start" }}>
        <Paper elevation={0} sx={{ border: "1px solid #E6ECF3", borderRadius: 3, overflow: "hidden", minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, px: 2.25, py: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 750, fontSize: 16 }}>Recent tenants</Typography>
              <Typography sx={{ mt: 0.3, color: "text.secondary", fontSize: 11.5 }}>A quick view of your latest tenant records</Typography>
            </Box>
            <Button component={RouterLink} to={ROUTES.TENANTS} endIcon={<ArrowForwardRoundedIcon />} size="small" sx={{ whiteSpace: "nowrap" }}>View all</Button>
          </Box>
          <Divider />
          <Box sx={{ display: { xs: "none", sm: "grid" }, gridTemplateColumns: "minmax(180px, 1.5fr) minmax(90px, 0.7fr) minmax(100px, 0.8fr) minmax(110px, 0.9fr)", gap: 1.5, px: 2, py: 1.1, bgcolor: "#F8FAFD" }}>
            {["TENANT", "APARTMENT", "MONTHLY RENT", "AGREEMENT"].map((label) => <Typography key={label} sx={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.65, color: "#77869A" }}>{label}</Typography>)}
          </Box>
          {recentTenantsContent}
          <Divider />
          <Box sx={{ px: 2.25, py: 1.5, bgcolor: "#FCFDFE" }}>
            <Typography sx={{ color: "text.secondary", fontSize: 11.5 }}>{recentTenantsSummary}</Typography>
          </Box>
        </Paper>

        <Stack spacing={2.5}>
          <Paper elevation={0} sx={{ p: 2.5, border: "1px solid #E6ECF3", borderRadius: 3 }}>
            <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
              <Box sx={{ width: 42, height: 42, borderRadius: 2.5, display: "grid", placeItems: "center", bgcolor: "#E7F0FF", color: "#206CCB" }}><BuildCircleOutlinedIcon /></Box>
              <Box>
                <Typography sx={{ fontWeight: 750, fontSize: 15 }}>Maintenance tickets</Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 11.5 }}>Tenant issue tracking</Typography>
              </Box>
            </Stack>
            <Typography sx={{ mt: 2, color: "text.secondary", fontSize: 12.5, lineHeight: 1.7 }}>
              {ticketsSummary}
            </Typography>
            <Button component={RouterLink} to={ROUTES.OWNER_MAINTENANCE} variant="outlined" fullWidth endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 2, borderColor: "#D9E3EF" }}>
              Open ticket workspace
            </Button>
          </Paper>

          <Paper elevation={0} sx={{ p: 2.5, border: "1px solid #E6ECF3", borderRadius: 3, bgcolor: "#F8FBFF" }}>
            <Typography sx={{ fontWeight: 750, fontSize: 14.5 }}>Quick actions</Typography>
            <Typography sx={{ mt: 0.5, mb: 1.5, color: "text.secondary", fontSize: 12 }}>Common property-management tasks</Typography>
            <Stack spacing={1}>
              <Button component={RouterLink} to={ROUTES.TENANTS} variant="outlined" startIcon={<PeopleAltOutlinedIcon />} sx={{ justifyContent: "flex-start", bgcolor: "#FFFFFF", borderColor: "#E0E8F2" }}>View tenant records</Button>
              <Button component={RouterLink} to={ROUTES.OWNER_AGREEMENTS} variant="outlined" startIcon={<DescriptionOutlinedIcon />} sx={{ justifyContent: "flex-start", bgcolor: "#FFFFFF", borderColor: "#E0E8F2" }}>Review agreements</Button>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Stack>
  );
}
