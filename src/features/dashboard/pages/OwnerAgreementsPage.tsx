/**
 * ============================================================================
 * Owner Rental Agreements Overview
 * ============================================================================
 * Summarizes agreement coverage from the existing tenant API. Upload, download,
 * replace, and delete actions remain in the established TenantTable workflow.
 * ============================================================================
 */
import { type ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { ROUTES } from "@/shared/constants";
import { useGetTenantsQuery } from "@/features/tenant/api";

export default function OwnerAgreementsPage() {
  const { data, isLoading, isError, refetch } = useGetTenantsQuery();
  const tenants = data?.data ?? [];
  const withAgreement = tenants.filter((tenant) => Boolean(tenant.rentalAgreement));
  const pending = tenants.length - withAgreement.length;

  let agreementContent: ReactNode;
  if (isLoading) {
    agreementContent = (
      <Box sx={{ py: 6, display: "grid", placeItems: "center" }}>
        <CircularProgress size={28} />
      </Box>
    );
  } else if (tenants.length === 0) {
    agreementContent = (
      <Box sx={{ py: 7, px: 2, textAlign: "center" }}>
        <DescriptionOutlinedIcon sx={{ fontSize: 38, color: "#98A7B8" }} />
        <Typography sx={{ mt: 1, fontWeight: 700 }}>No tenant records yet</Typography>
        <Typography sx={{ mt: 0.5, color: "text.secondary", fontSize: 13 }}>
          Create a tenant record before managing its rental agreement.
        </Typography>
      </Box>
    );
  } else {
    agreementContent = (
      <>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0,1.3fr) minmax(90px,0.8fr)", sm: "minmax(160px,1.4fr) minmax(100px,0.8fr) minmax(150px,1fr) minmax(120px,0.8fr)" }, gap: 1.5, px: 2.5, py: 1.25, bgcolor: "#F8FAFD" }}>
          {["TENANT", "APARTMENT", "AGREEMENT FILE", "STATUS"].map((heading) => (
            <Typography
              key={heading}
              sx={{
                display: heading === "APARTMENT" || heading === "AGREEMENT FILE" ? { xs: "none", sm: "block" } : "block",
                fontSize: 9.5,
                fontWeight: 800,
                letterSpacing: 0.65,
                color: "#77869A",
              }}
            >
              {heading}
            </Typography>
          ))}
        </Box>
        {tenants.map((tenant, index) => (
          <Box key={tenant._id}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0,1.3fr) minmax(90px,0.8fr)", sm: "minmax(160px,1.4fr) minmax(100px,0.8fr) minmax(150px,1fr) minmax(120px,0.8fr)" }, gap: 1.5, alignItems: "center", px: 2.5, py: 1.6 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: 13, fontWeight: 650 }}>{tenant.tenantName}</Typography>
                <Typography sx={{ display: { xs: "block", sm: "none" }, color: "text.secondary", fontSize: 11.5 }}>
                  {tenant.apartmentNumber}
                </Typography>
              </Box>
              <Typography sx={{ display: { xs: "none", sm: "block" }, fontSize: 12.5 }}>{tenant.apartmentNumber}</Typography>
              <Typography noWrap sx={{ display: { xs: "none", sm: "block" }, fontSize: 12, color: "text.secondary" }}>
                {tenant.rentalAgreement?.originalName ?? "—"}
              </Typography>
              <Box>
                <Chip
                  size="small"
                  label={tenant.rentalAgreement ? "Uploaded" : "Not uploaded"}
                  sx={{ fontWeight: 650, fontSize: 10.5, bgcolor: tenant.rentalAgreement ? "#E5F7ED" : "#FFF2DD", color: tenant.rentalAgreement ? "#16734C" : "#96610F" }}
                />
              </Box>
            </Box>
            {index < tenants.length - 1 && <Divider sx={{ borderColor: "#EEF1F5" }} />}
          </Box>
        ))}
      </>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontSize: { xs: 25, md: 30 }, fontWeight: 800, letterSpacing: -1, color: "#142844" }}>Rental Agreements</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13.5, color: "text.secondary" }}>Track agreement coverage across your tenant records.</Typography>
        </Box>
        <Button component={RouterLink} to={ROUTES.TENANTS} variant="contained" startIcon={<PeopleAltOutlinedIcon />} sx={{ boxShadow: "none", alignSelf: { xs: "flex-start", sm: "auto" } }}>Manage agreements</Button>
      </Stack>

      {isError && <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => void refetch()}>Retry</Button>}>Agreement status could not be loaded.</Alert>}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }, gap: 2 }}>
        <Summary title="Tenant records" value={isLoading ? "—" : tenants.length} note="Records available to this owner account" tone="blue" />
        <Summary title="Agreements on file" value={isLoading ? "—" : withAgreement.length} note="A file is attached to these tenant records" tone="green" />
        <Summary title="Pending agreements" value={isLoading ? "—" : pending} note="No agreement is recorded yet" tone="amber" />
      </Box>

      <Paper elevation={0} sx={{ overflow: "hidden", border: "1px solid #E6ECF3", borderRadius: 3 }}>
        <Box sx={{ px: 2.5, py: 2 }}>
          <Typography sx={{ fontWeight: 750, fontSize: 16 }}>Agreement register</Typography>
          <Typography sx={{ mt: 0.4, color: "text.secondary", fontSize: 12 }}>File operations remain available in Tenant Management.</Typography>
        </Box>
        <Divider />
        {agreementContent}
        <Divider />
        <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, bgcolor: "#FCFDFE" }}>
          <Typography sx={{ color: "text.secondary", fontSize: 11.5 }}>{isLoading ? "Loading agreements…" : `${withAgreement.length} uploaded · ${pending} pending`}</Typography>
          <Button component={RouterLink} to={ROUTES.TENANTS} size="small" endIcon={<PeopleAltOutlinedIcon />}>Open tenant management</Button>
        </Box>
      </Paper>
    </Stack>
  );
}

type SummaryProps = Readonly<{
  title: string;
  value: number | string;
  note: string;
  tone: "blue" | "green" | "amber";
}>;

function Summary({ title, value, note, tone }: SummaryProps) {
  const styles = { blue: { bg: "#E7F0FF", text: "#206CCB" }, green: { bg: "#E2F7ED", text: "#14805E" }, amber: { bg: "#FFF2DC", text: "#B97612" } }[tone];
  return <Paper elevation={0} sx={{ p: 2.25, border: "1px solid #E6ECF3", borderRadius: 3 }}>
    <Typography sx={{ color: "text.secondary", fontSize: 12.5 }}>{title}</Typography>
    <Typography variant="h5" sx={{ my: 1, fontWeight: 800, color: styles.text }}>{value}</Typography>
    <Typography sx={{ color: "text.secondary", fontSize: 11.5 }}>{note}</Typography>
    <Box sx={{ height: 3, bgcolor: styles.bg, borderRadius: 4, mt: 2 }} />
  </Paper>;
}
