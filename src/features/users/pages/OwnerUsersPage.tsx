/** Owner-only account directory for linking login accounts to tenant records. */
import { useState, type FormEvent } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { useGetUsersQuery, useUpdateUserMutation } from "@/features/users/api";
import { useGetTenantsQuery } from "@/features/tenant/api";
import type { AuthUser, UserRole } from "@/features/auth/models";
import type { Tenant } from "@/features/tenant/models";
import { getAuthenticatedUser } from "@/features/auth/utils/authSession";
import { getApiErrorMessage } from "@/shared/utils";
import { useSnackbar } from "@/feedback/useSnackbar";

export default function OwnerUsersPage() {
  const usersQuery = useGetUsersQuery();
  const tenantsQuery = useGetTenantsQuery();
  const users = usersQuery.data?.data ?? [];
  const tenants = tenantsQuery.data?.data ?? [];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontSize: { xs: 25, md: 30 }, fontWeight: 800, letterSpacing: -1, color: "#142844" }}>
          User Accounts
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: 13.5, color: "text.secondary" }}>
          Link a tenant login to the corresponding rental record. Public registrations cannot assign their own role or tenant association.
        </Typography>
      </Box>

      {(usersQuery.isError || tenantsQuery.isError) && (
        <Alert severity="error">Unable to load account and tenant records. Verify that you are signed in as an owner and retry.</Alert>
      )}

      {usersQuery.isLoading || tenantsQuery.isLoading ? (
        <Box sx={{ minHeight: 180, display: "grid", placeItems: "center" }}><CircularProgress size={30} /></Box>
      ) : users.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, border: "1px solid #E6ECF3", borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 700 }}>No user accounts found</Typography>
          <Typography sx={{ mt: 0.5, color: "text.secondary", fontSize: 13 }}>When users register, their accounts will appear here for owner review and tenant linking.</Typography>
        </Paper>
      ) : (
        <Stack spacing={1.5}>
          {users.map((user) => {
            const linkedElsewhere = new Set(
              users
                .filter((candidate) => candidate._id !== user._id && candidate.role === "tenant" && candidate.tenantId)
                .map((candidate) => candidate.tenantId as string),
            );
            const availableTenants = tenants.filter((tenant) => !linkedElsewhere.has(tenant._id));
            return (
              <UserAccountCard key={user._id} user={user} tenants={availableTenants} />
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

type UserAccountCardProps = {
  readonly user: AuthUser;
  readonly tenants: readonly Tenant[];
};

function UserAccountCard({ user, tenants }: UserAccountCardProps) {
  const signedInUser = getAuthenticatedUser();
  const [role, setRole] = useState<UserRole>(user.role);
  const [tenantId, setTenantId] = useState(user.tenantId ?? "");
  const [updateUser, updateState] = useUpdateUserMutation();
  const { success, error: showError } = useSnackbar();
  const isCurrentAccount = signedInUser?._id === user._id;
  const roleChanged = role !== user.role;
  const tenantChanged = (role === "tenant" ? tenantId || null : null) !== user.tenantId;
  const hasChanges = roleChanged || tenantChanged;

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await updateUser({
        id: user._id,
        body: {
          role,
          tenantId: role === "tenant" ? tenantId || null : null,
        },
      }).unwrap();
      setRole(response.data.role);
      setTenantId(response.data.tenantId ?? "");
      success("User account updated successfully.");
    } catch (error: unknown) {
      showError(getApiErrorMessage(error, "Unable to update this user account."));
    }
  };

  return (
    <Paper component="form" onSubmit={handleSave} elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, border: "1px solid #E6ECF3", borderRadius: 3 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { xs: "stretch", md: "center" } }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: { md: 245 }, flex: { md: "0 0 245px" } }}>
          <Avatar sx={{ bgcolor: user.role === "owner" ? "#DCEBFF" : "#DFF7EF", color: user.role === "owner" ? "#1769AA" : "#087B6A", fontWeight: 750 }}>
            {user.name.trim().charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap sx={{ fontWeight: 750, fontSize: 13.5 }}>{user.name}</Typography>
            <Typography noWrap sx={{ color: "text.secondary", fontSize: 11.5 }}>{user.email}</Typography>
          </Box>
        </Stack>

        <Box sx={{ minWidth: { xs: "100%", md: 145 }, flex: 1 }}>
          <Typography sx={{ mb: 0.6, color: "text.secondary", fontSize: 11.5 }}>Role</Typography>
          <Select fullWidth size="small" value={role} disabled={isCurrentAccount} onChange={(event) => setRole(event.target.value as UserRole)}>
            <MenuItem value="owner">Owner</MenuItem>
            <MenuItem value="tenant">Tenant</MenuItem>
          </Select>
        </Box>

        <Box sx={{ minWidth: { xs: "100%", md: 240 }, flex: 1.4 }}>
          <Typography sx={{ mb: 0.6, color: "text.secondary", fontSize: 11.5 }}>Linked tenant record</Typography>
          <Select
            fullWidth
            size="small"
            value={role === "tenant" ? tenantId : ""}
            disabled={role !== "tenant"}
            onChange={(event) => setTenantId(String(event.target.value))}
            displayEmpty
          >
            <MenuItem value=""><em>Not linked</em></MenuItem>
            {tenants.map((tenant) => (
              <MenuItem key={tenant._id} value={tenant._id}>{tenant.tenantName} · {tenant.apartmentNumber}</MenuItem>
            ))}
          </Select>
        </Box>

        <Stack spacing={1} sx={{ alignItems: { xs: "stretch", md: "flex-end" }, minWidth: 125 }}>
          <Chip size="small" label={user.tenantId ? "Linked" : "Unlinked"} color={user.tenantId ? "success" : "warning"} variant="outlined" />
          <Button type="submit" size="small" variant="contained" startIcon={<SaveOutlinedIcon />} disabled={!hasChanges || updateState.isLoading || (role === "tenant" && Boolean(tenantId) && !tenants.some((tenant) => tenant._id === tenantId))} sx={{ boxShadow: "none" }}>
            {updateState.isLoading ? "Saving…" : "Save"}
          </Button>
        </Stack>
      </Stack>
      {isCurrentAccount && <Typography sx={{ mt: 1.5, color: "text.secondary", fontSize: 11.5 }}>Your own role cannot be changed here to prevent accidentally locking yourself out of the owner workspace.</Typography>}
    </Paper>
  );
}
