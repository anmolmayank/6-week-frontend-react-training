/**
 * ============================================================================
 * Maintenance Ticket Screens
 * ============================================================================
 * Owner endpoints expose full ticket detail and status management. Tenant
 * endpoints return only ticket IDs/status; this UI deliberately renders status
 * only and never shows a ticket subject, description, or identifier to tenants.
 * ============================================================================
 */
import { useState, type FormEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import { ROUTES } from "@/shared/constants";
import {
  useCreateMaintenanceTicketMutation,
  useGetMyTicketStatusesQuery,
  useGetOwnerMaintenanceTicketsQuery,
  useUpdateMaintenanceTicketStatusMutation,
} from "../api";
import type { MaintenanceTicketStatus, OwnerMaintenanceTicket } from "../models";
import { useSnackbar } from "@/feedback/useSnackbar";
import { getAuthenticatedUser } from "@/features/auth/utils/authSession";
import { getApiErrorMessage } from "@/shared/utils";

const TICKET_STATUSES: readonly MaintenanceTicketStatus[] = ["open", "in_progress", "resolved", "closed"];

function statusLabel(status: MaintenanceTicketStatus): string {
  switch (status) {
    case "open": return "Open";
    case "in_progress": return "In Progress";
    case "resolved": return "Resolved";
    case "closed": return "Closed";
  }
}

function statusColor(status: MaintenanceTicketStatus): "default" | "info" | "success" | "warning" {
  if (status === "resolved" || status === "closed") return "success";
  if (status === "in_progress") return "info";
  if (status === "open") return "warning";
  return "default";
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString();
}

export function OwnerMaintenancePage() {
  const { data, isLoading, isError, refetch } = useGetOwnerMaintenanceTicketsQuery();
  const [updateTicketStatus, updateState] = useUpdateMaintenanceTicketStatusMutation();
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
  const { success, error: showError } = useSnackbar();
  const tickets = data?.data ?? [];

  const handleStatusChange = async (ticket: OwnerMaintenanceTicket, status: MaintenanceTicketStatus) => {
    if (status === ticket.status) return;
    setUpdatingTicketId(ticket._id);
    try {
      await updateTicketStatus({ ticketId: ticket._id, status }).unwrap();
      success("Maintenance ticket status updated.");
    } catch (error: unknown) {
      showError(getApiErrorMessage(error, "Unable to update ticket status."));
    } finally {
      setUpdatingTicketId(null);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontSize: { xs: 25, md: 30 }, fontWeight: 800, letterSpacing: -1, color: "#142844" }}>Maintenance Tickets</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13.5, color: "text.secondary" }}>Review tenant requests, coordinate repairs, and update ticket status.</Typography>
        </Box>
        <Button variant="outlined" onClick={() => { void refetch(); }} disabled={isLoading}>Refresh</Button>
      </Stack>

      {isError && <Alert severity="error">Unable to load maintenance tickets. Check the API connection and owner permissions.</Alert>}
      {isLoading ? (
        <Box sx={{ minHeight: 180, display: "grid", placeItems: "center" }}><CircularProgress size={30} /></Box>
      ) : tickets.length === 0 ? (
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, border: "1px solid #E6ECF3", borderRadius: 3, textAlign: "center" }}>
          <Box sx={{ width: 60, height: 60, mx: "auto", display: "grid", placeItems: "center", borderRadius: 3, bgcolor: "#E7F0FF", color: "#206CCB" }}><BuildCircleOutlinedIcon sx={{ fontSize: 30 }} /></Box>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 750 }}>No maintenance tickets yet</Typography>
          <Typography sx={{ maxWidth: 550, mx: "auto", mt: 1, lineHeight: 1.7, fontSize: 13, color: "text.secondary" }}>Tenant requests will appear here when submitted. Only owner accounts can view the request descriptions and update their status.</Typography>
        </Paper>
      ) : (
        <Stack spacing={1.5}>
          {tickets.map((ticket) => (
            <Paper key={ticket._id} elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, border: "1px solid #E6ECF3", borderRadius: 3 }}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { xs: "stretch", md: "center" } }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ color: "#1A3454", fontWeight: 800, fontSize: 14.5 }}>{ticket.subject}</Typography>
                  <Typography sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}>{ticket.tenantName} · Apartment {ticket.apartmentNumber}</Typography>
                  <Typography sx={{ mt: 1, fontSize: 12.5, lineHeight: 1.7, overflowWrap: "anywhere" }}>{ticket.description}</Typography>
                  <Typography sx={{ mt: 1, fontSize: 11, color: "text.secondary" }}>Created {formatDate(ticket.createdAt)}</Typography>
                </Box>
                <Stack spacing={1} sx={{ minWidth: { xs: "100%", md: 190 } }}>
                  <Typography sx={{ color: "text.secondary", fontSize: 11.5 }}>Ticket status</Typography>
                  <Select
                    fullWidth
                    size="small"
                    value={ticket.status}
                    disabled={updateState.isLoading && updatingTicketId === ticket._id}
                    onChange={(event) => { void handleStatusChange(ticket, event.target.value as MaintenanceTicketStatus); }}
                  >
                    {TICKET_STATUSES.map((status) => <MenuItem key={status} value={status}>{statusLabel(status)}</MenuItem>)}
                  </Select>
                  <Chip size="small" variant="outlined" color={statusColor(ticket.status)} label={statusLabel(ticket.status)} sx={{ alignSelf: "flex-start" }} />
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export function TenantTicketsPage() {
  const user = getAuthenticatedUser();
  const isLinked = Boolean(user?.tenantId);
  const { data, isLoading, isError, refetch } = useGetMyTicketStatusesQuery();
  const tickets = data?.data ?? [];

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontSize: { xs: 25, md: 30 }, fontWeight: 800, letterSpacing: -1, color: "#142844" }}>My Maintenance Tickets</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13.5, color: "text.secondary" }}>Raise a request and track its current status.</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => { void refetch(); }} disabled={isLoading}>Refresh</Button>
          <Button component={RouterLink} to={ROUTES.TENANT_NEW_TICKET} variant="contained" disabled={!isLinked} startIcon={<AddCircleOutlineRoundedIcon />} sx={{ boxShadow: "none" }}>Create ticket</Button>
        </Stack>
      </Stack>

      <Alert severity="info">For privacy, this page shows only each request's current status. Ticket descriptions, subjects, identifiers, and owner-only notes are not displayed.</Alert>
      {!isLinked && <Alert severity="warning">Your login account has not been linked to a tenant record yet. Contact the property owner before creating maintenance requests.</Alert>}
      {isError && <Alert severity="error">Unable to load your ticket statuses. If your tenant account has not been linked to a tenant record, contact the property owner.</Alert>}
      {isLoading ? (
        <Box sx={{ minHeight: 180, display: "grid", placeItems: "center" }}><CircularProgress size={30} /></Box>
      ) : tickets.length === 0 ? (
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, border: "1px solid #E6ECF3", borderRadius: 3, textAlign: "center" }}>
          <Box sx={{ width: 58, height: 58, mx: "auto", display: "grid", placeItems: "center", borderRadius: 3, bgcolor: "#E3F7F0", color: "#0F8B73" }}><ConfirmationNumberOutlinedIcon sx={{ fontSize: 29 }} /></Box>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 750 }}>No maintenance tickets yet</Typography>
          <Typography sx={{ mt: 0.75, maxWidth: 460, mx: "auto", lineHeight: 1.7, color: "text.secondary", fontSize: 13 }}>Create a request when you need maintenance assistance. After that, you can track its status here.</Typography>
          <Button component={RouterLink} to={ROUTES.TENANT_NEW_TICKET} variant="outlined" sx={{ mt: 2.5 }}>Raise a maintenance request</Button>
        </Paper>
      ) : (
        <Stack spacing={1.25}>
          {tickets.map((ticket, index) => (
            <Paper key={ticket.ticketId} elevation={0} sx={{ p: 2.25, border: "1px solid #E6ECF3", borderRadius: 3 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 13.5 }}>Maintenance request {index + 1}</Typography>
                <Chip size="small" color={statusColor(ticket.status)} label={statusLabel(ticket.status)} />
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export function NewTenantTicketPage() {
  const navigate = useNavigate();
  const user = getAuthenticatedUser();
  const isLinked = Boolean(user?.tenantId);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [createTicket, { isLoading }] = useCreateMaintenanceTicketMutation();
  const { success, error: showError } = useSnackbar();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanedSubject = subject.trim();
    const cleanedDescription = description.trim();
    if (!cleanedSubject || !cleanedDescription) {
      showError("Enter a subject and describe the maintenance issue.");
      return;
    }

    try {
      await createTicket({ subject: cleanedSubject, description: cleanedDescription }).unwrap();
      success("Maintenance ticket submitted successfully.");
      void navigate(ROUTES.TENANT_TICKETS);
    } catch (error: unknown) {
      showError(getApiErrorMessage(error, "Unable to submit the maintenance ticket."));
    }
  };

  return (
    <Stack spacing={3}>
      <Button component={RouterLink} to={ROUTES.TENANT_TICKETS} startIcon={<ArrowBackRoundedIcon />} sx={{ alignSelf: "flex-start" }}>Back to my tickets</Button>
      <Box>
        <Typography variant="h4" sx={{ fontSize: { xs: 25, md: 30 }, fontWeight: 800, letterSpacing: -1, color: "#142844" }}>Create Maintenance Ticket</Typography>
        <Typography sx={{ mt: 0.5, fontSize: 13.5, color: "text.secondary" }}>Describe the issue so the property owner can review it.</Typography>
      </Box>
      <Alert severity="info">Only the owner can view the subject and description. You will see only the request status after submission.</Alert>
      {!isLinked && <Alert severity="warning">Your login account has not been linked to a tenant record yet. The property owner must link it before you can submit a maintenance request.</Alert>}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.5fr) minmax(280px, 0.8fr)" }, gap: 2.5, alignItems: "start" }}>
        <Paper component="form" onSubmit={handleSubmit} elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, border: "1px solid #E6ECF3", borderRadius: 3 }}>
          <Typography sx={{ mb: 2.5, fontWeight: 750, fontSize: 15 }}>Request details</Typography>
          <Stack spacing={2.25}>
            <TextField label="Subject" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="e.g. Kitchen tap is leaking" required fullWidth disabled={!isLinked} slotProps={{ htmlInput: { maxLength: 120 } }} />
            <TextField label="Describe the issue" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add the details the property owner needs to understand the issue." required fullWidth multiline minRows={5} disabled={!isLinked} slotProps={{ htmlInput: { maxLength: 2000 } }} />
            <Stack direction="row" spacing={1.25} sx={{ justifyContent: "flex-end" }}>
              <Button component={RouterLink} to={ROUTES.TENANT_TICKETS} variant="outlined">Cancel</Button>
              <Button type="submit" variant="contained" disabled={!isLinked || isLoading} sx={{ boxShadow: "none" }}>{isLoading ? "Submitting…" : "Submit ticket"}</Button>
            </Stack>
          </Stack>
        </Paper>
        <Paper elevation={0} sx={{ p: 2.5, border: "1px solid #E6ECF3", borderRadius: 3, bgcolor: "#F9FBFE" }}>
          <Typography sx={{ fontWeight: 750, fontSize: 14.5 }}>What happens next?</Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Step number="1" title="Submit your request" detail="Describe the issue for the property owner." />
            <Step number="2" title="Owner review" detail="The owner reviews the details and updates the ticket status." />
            <Step number="3" title="Track status" detail="You can see the latest status from your tickets page." />
          </Stack>
          <Typography sx={{ mt: 2.5, lineHeight: 1.7, color: "text.secondary", fontSize: 11.5 }}>Your ticket description is visible to the owner only. Other tenants cannot view your request.</Typography>
        </Paper>
      </Box>
    </Stack>
  );
}

type StepProps = {
  readonly number: string;
  readonly title: string;
  readonly detail: string;
};

function Step({ number, title, detail }: StepProps) {
  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: "flex-start" }}>
      <Box sx={{ width: 26, height: 26, borderRadius: "50%", display: "grid", placeItems: "center", flexShrink: 0, bgcolor: "#E3F7F0", color: "#0F8B73", fontSize: 11.5, fontWeight: 800 }}>{number}</Box>
      <Box>
        <Typography sx={{ fontSize: 12.5, fontWeight: 700 }}>{title}</Typography>
        <Typography sx={{ mt: 0.35, lineHeight: 1.6, color: "text.secondary", fontSize: 11.5 }}>{detail}</Typography>
      </Box>
    </Stack>
  );
}
