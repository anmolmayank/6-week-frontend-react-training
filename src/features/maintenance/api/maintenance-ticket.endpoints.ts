/** RTK Query endpoints for the role-protected maintenance-ticket API. */
import { baseApi } from "@/app/api/baseApi";
import type {
  CreateMaintenanceTicketRequest,
  CreateMaintenanceTicketResponse,
  GetMyTicketStatusesResponse,
  GetOwnerMaintenanceTicketsResponse,
  MaintenanceTicketStatus,
  UpdateMaintenanceTicketStatusResponse,
} from "../models";

export const maintenanceTicketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMaintenanceTicket: builder.mutation<CreateMaintenanceTicketResponse, CreateMaintenanceTicketRequest>({
      query: (body) => ({ url: "/maintenance-tickets", method: "POST", body }),
      invalidatesTags: ["MaintenanceTicket"],
    }),

    getMyTicketStatuses: builder.query<GetMyTicketStatusesResponse, void>({
      query: () => ({ url: "/maintenance-tickets/mine", method: "GET" }),
      providesTags: ["MaintenanceTicket"],
    }),

    getOwnerMaintenanceTickets: builder.query<GetOwnerMaintenanceTicketsResponse, void>({
      query: () => ({ url: "/maintenance-tickets", method: "GET" }),
      providesTags: ["MaintenanceTicket"],
    }),

    updateMaintenanceTicketStatus: builder.mutation<
      UpdateMaintenanceTicketStatusResponse,
      { ticketId: string; status: MaintenanceTicketStatus }
    >({
      query: ({ ticketId, status }) => ({
        url: `/maintenance-tickets/${ticketId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["MaintenanceTicket"],
    }),
  }),
});

export const {
  useCreateMaintenanceTicketMutation,
  useGetMyTicketStatusesQuery,
  useGetOwnerMaintenanceTicketsQuery,
  useUpdateMaintenanceTicketStatusMutation,
} = maintenanceTicketApi;
