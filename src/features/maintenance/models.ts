/** Models matching the Node maintenance-ticket API contracts. */
import type { ApiResponse } from "@/shared/models";

export type MaintenanceTicketStatus = "open" | "in_progress" | "resolved" | "closed";

/** Ticket payload returned to tenants; private descriptions are never included. */
export interface TenantTicketStatus {
  ticketId: string;
  status: MaintenanceTicketStatus;
}

export interface CreateMaintenanceTicketRequest {
  subject: string;
  description: string;
}

export type CreateMaintenanceTicketResponse = ApiResponse<TenantTicketStatus>;
export type GetMyTicketStatusesResponse = ApiResponse<TenantTicketStatus[]>;

/** Full ticket shape available only from the owner-authorized API. */
export interface OwnerMaintenanceTicket {
  _id: string;
  tenantId: string;
  tenantName: string;
  apartmentNumber: string;
  subject: string;
  description: string;
  status: MaintenanceTicketStatus;
  createdAt: string;
  updatedAt: string;
}

export type GetOwnerMaintenanceTicketsResponse = ApiResponse<OwnerMaintenanceTicket[]>;
export type UpdateMaintenanceTicketStatusResponse = ApiResponse<{
  ticketId: string;
  status: MaintenanceTicketStatus;
  updatedAt: string;
}>;
