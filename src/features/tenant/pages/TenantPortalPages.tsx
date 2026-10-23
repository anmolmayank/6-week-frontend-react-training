/**
 * ============================================================================
 * Tenant Portal Pages
 * ============================================================================
 * All tenancy details come from GET /tenants/me, which derives tenantId from
 * the authenticated user. Agreement download and ticket status use dedicated
 * tenant-scoped endpoints; tenant screens never call the owner tenant list.
 * ============================================================================
 */
import type { ReactNode } from "react";
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
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { ROUTES } from "@/shared/constants";
import { getAuthenticatedUser } from "@/features/auth/utils/authSession";
import { useGetMyTenantQuery, useDownloadMyAgreementMutation } from "@/features/tenant/api";
import { useGetMyTicketStatusesQuery } from "@/features/maintenance/api";
import { getApiErrorMessage } from "@/shared/utils";
import { useSnackbar } from "@/feedback/useSnackbar";

function profileInitials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase() || "T";
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value?: string): string {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleDateString();
}

function QueryErrorAlert({ message }: { readonly message: string }) {
  return <Alert severity="error">{message}</Alert>;
}

function LoadingPanel() {
  return <Box sx={{ minHeight: 160, display: "grid", placeItems: "center" }}><CircularProgress size={28} /></Box>;
}

export function TenantDashboardPage() {
  const user = getAuthenticatedUser();
  const profileQuery = useGetMyTenantQuery();
  const ticketsQuery = useGetMyTicketStatusesQuery();
  const tenant = profileQuery.data?.data;
  const tickets = ticketsQuery.data?.data ?? [];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontSize: { xs: 25, md: 30 }, fontWeight: 800, letterSpacing: -1, color: "#142844" }}>Welcome back, {user?.name || "there"}!</Typography>
        <Typography sx={{ mt: 0.5, fontSize: 13.5, color: "text.secondary" }}>Your rental information and maintenance request statuses in one place.</Typography>
      </Box>

      {profileQuery.isError && <QueryErrorAlert message={getApiErrorMessage(profileQuery.error, "Your login account is not linked to a tenant record yet. Please contact the property owner.")} />}
      {!user?.tenantId && <Alert severity="warning">Your account is registered, but it is not linked to a tenant record yet. Please contact the property owner to activate tenant services.</Alert>}
      {ticketsQuery.isError && <QueryErrorAlert message={getApiErrorMessage(ticketsQuery.error, "Your maintenance ticket statuses could not be loaded.")} />}

      <Paper elevation={0} sx={{ border: "1px solid #E6ECF3", borderRadius: 3, p: { xs: 2.5, sm: 3 }, background: "linear-gradient(115deg, #FFFFFF 0%, #F5FBF9 100%)" }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} sx={{ alignItems: { xs: "flex-start", sm: "center" } }}>
          <Avatar sx={{ width: 62, height: 62, bgcolor: "#CFF3E9", color: "#087B6A", fontSize: 19, fontWeight: 800 }}>{profileInitials(user?.name || "Tenant")}</Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 17 }}>{user?.name || "Tenant account"}</Typography>
            <Typography sx={{ mt: 0.4, color: "text.secondary", fontSize: 12.5 }}>{user?.email || "Email not available"}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1.25, flexWrap: "wrap" }}>
              <Chip size="small" label="Tenant portal" sx={{ bgcolor: "#DFF7EF", color: "#087B6A", fontWeight: 700 }} />
              <Chip size="small" variant="outlined" label="Read-only profile" sx={{ borderColor: "#D5E4E0", color: "#42685F" }} />
            </Stack>
          </Box>
          <Button component={RouterLink} to={ROUTES.TENANT_DETAILS} variant="outlined" endIcon={<ArrowForwardRoundedIcon />}>View my details</Button>
        </Stack>
      </Paper>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: 2.5 }}>
        <SummaryCard label="Apartment" value={profileQuery.isLoading ? "Loading…" : tenant?.apartmentNumber ?? "Not linked"} />
        <SummaryCard label="Monthly rent" value={profileQuery.isLoading ? "Loading…" : tenant ? formatCurrency(tenant.monthlyRent) : "Not available"} />
        <SummaryCard label="Maintenance requests" value={ticketsQuery.isLoading ? "Loading…" : String(tickets.length)} note="Status only" />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2.5 }}>
        <PortalAction icon={<DescriptionOutlinedIcon />} title="My rental agreement" detail="View and download the agreement linked to your tenancy." to={ROUTES.TENANT_AGREEMENT} />
        <PortalAction icon={<ConfirmationNumberOutlinedIcon />} title="Maintenance tickets" detail="Create a request and track its latest status." to={ROUTES.TENANT_TICKETS} />
      </Box>
    </Stack>
  );
}

export function TenantDetailsPage() {
  const user = getAuthenticatedUser();
  const { data, isLoading, isError, error } = useGetMyTenantQuery();
  const tenant = data?.data;
  const fields = [
    { label: "Full name", value: user?.name || "Not available" },
    { label: "Email address", value: user?.email || "Not available" },
    { label: "Tenant record name", value: tenant?.tenantName ?? "Not available" },
    { label: "Apartment number", value: tenant?.apartmentNumber ?? "Not available" },
    { label: "Monthly rent", value: tenant ? formatCurrency(tenant.monthlyRent) : "Not available" },
    { label: "Tenant since", value: formatDate(tenant?.createdAt) },
  ];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontSize: { xs: 25, md: 30 }, fontWeight: 800, letterSpacing: -1, color: "#142844" }}>My Details</Typography>
        <Typography sx={{ mt: 0.5, fontSize: 13.5, color: "text.secondary" }}>Review your account and tenancy information.</Typography>
      </Box>
      {isError && <QueryErrorAlert message={getApiErrorMessage(error, "Your login account is not linked to a tenant record yet. Please contact the property owner.")} />}
      {isLoading ? <LoadingPanel /> : (
        <Paper elevation={0} sx={{ border: "1px solid #E6ECF3", borderRadius: 3, overflow: "hidden" }}>
          <Box sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 42, height: 42, borderRadius: 2.5, display: "grid", placeItems: "center", bgcolor: "#E3F7F0", color: "#0F8B73" }}><PersonOutlineRoundedIcon /></Box>
            <Box><Typography sx={{ fontWeight: 750, fontSize: 15 }}>Personal and tenancy details</Typography><Typography sx={{ color: "text.secondary", fontSize: 11.5 }}>Read-only information for your account</Typography></Box>
          </Box>
          <Divider />
          {fields.map((field, index) => <Box key={field.label}><Box sx={{ px: 2.5, py: 2, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "200px minmax(0, 1fr)" }, gap: 1 }}><Typography sx={{ color: "text.secondary", fontSize: 12.5 }}>{field.label}</Typography><Typography sx={{ overflowWrap: "anywhere", fontSize: 13, fontWeight: 600 }}>{field.value}</Typography></Box>{index < fields.length - 1 && <Divider sx={{ borderColor: "#EEF1F5" }} />}</Box>)}
        </Paper>
      )}
    </Stack>
  );
}

export function TenantAgreementPage() {
  const { data, isLoading, isError, error } = useGetMyTenantQuery();
  const [downloadMyAgreement, downloadState] = useDownloadMyAgreementMutation();
  const { success, error: showError } = useSnackbar();
  const agreement = data?.data.rentalAgreement;

  const handleDownload = async () => {
    try {
      const blob = await downloadMyAgreement().unwrap();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = agreement?.originalName || "rental-agreement.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      success("Your rental agreement download has started.");
    } catch (downloadError: unknown) {
      showError(getApiErrorMessage(downloadError, "Unable to download your rental agreement."));
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontSize: { xs: 25, md: 30 }, fontWeight: 800, letterSpacing: -1, color: "#142844" }}>My Agreement</Typography>
        <Typography sx={{ mt: 0.5, fontSize: 13.5, color: "text.secondary" }}>Read-only access to your rental agreement.</Typography>
      </Box>
      {isError && <QueryErrorAlert message={getApiErrorMessage(error, "Your login account is not linked to a tenant record yet. Please contact the property owner.")} />}
      {isLoading ? <LoadingPanel /> : (
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: "1px solid #E6ECF3", borderRadius: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { xs: "flex-start", sm: "center" } }}>
            <Box sx={{ width: 60, height: 60, display: "grid", placeItems: "center", borderRadius: 3, bgcolor: "#E7F0FF", color: "#206CCB" }}><DescriptionOutlinedIcon sx={{ fontSize: 30 }} /></Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 750, fontSize: 15 }}>Rental agreement</Typography>
              {agreement ? (
                <>
                  <Typography sx={{ mt: 0.5, fontSize: 13, overflowWrap: "anywhere" }}>{agreement.originalName}</Typography>
                  <Typography sx={{ mt: 0.4, fontSize: 11.5, color: "text.secondary" }}>Uploaded {formatDate(agreement.uploadedAt)} · {(agreement.size / (1024 * 1024)).toFixed(2)} MB</Typography>
                </>
              ) : <Typography sx={{ mt: 0.5, fontSize: 12.5, color: "text.secondary" }}>No agreement has been uploaded for your tenancy yet. Please contact the property owner.</Typography>}
            </Box>
            <Button variant="contained" disabled={!agreement || downloadState.isLoading} onClick={() => { void handleDownload(); }} startIcon={<DownloadRoundedIcon />} sx={{ boxShadow: "none" }}>
              {downloadState.isLoading ? "Preparing…" : "Download agreement"}
            </Button>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}

function SummaryCard({ label, value, note }: { readonly label: string; readonly value: string; readonly note?: string }) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, border: "1px solid #E6ECF3", borderRadius: 3 }}>
      <Typography sx={{ color: "text.secondary", fontSize: 12 }}>{label}</Typography>
      <Typography sx={{ mt: 1, fontSize: 21, color: "#142844", fontWeight: 800, overflowWrap: "anywhere" }}>{value}</Typography>
      {note && <Typography sx={{ mt: 0.6, color: "text.secondary", fontSize: 11.5 }}>{note}</Typography>}
    </Paper>
  );
}

/** Props for a navigable action card on the tenant dashboard. */
type PortalActionProps = {
  readonly icon: ReactNode;
  readonly title: string;
  readonly detail: string;
  readonly to: string;
};

function PortalAction({ icon, title, detail, to }: PortalActionProps) {
  return (
    <Paper component={RouterLink} to={to} elevation={0} sx={{ textDecoration: "none", color: "inherit", p: 2.5, border: "1px solid #E6ECF3", borderRadius: 3, display: "flex", gap: 1.75, alignItems: "flex-start", transition: "border-color 160ms ease, transform 160ms ease", "&:hover": { borderColor: "#9FCFC4", transform: "translateY(-2px)" } }}>
      <Box sx={{ width: 44, height: 44, borderRadius: 2.5, flexShrink: 0, display: "grid", placeItems: "center", bgcolor: "#E3F7F0", color: "#0F8B73" }}>{icon}</Box>
      <Box sx={{ minWidth: 0, flex: 1 }}><Typography sx={{ fontWeight: 750, fontSize: 14 }}>{title}</Typography><Typography sx={{ mt: 0.5, lineHeight: 1.65, color: "text.secondary", fontSize: 12 }}>{detail}</Typography></Box>
      <ArrowForwardRoundedIcon fontSize="small" sx={{ color: "#73869A", mt: 0.25 }} />
    </Paper>
  );
}
