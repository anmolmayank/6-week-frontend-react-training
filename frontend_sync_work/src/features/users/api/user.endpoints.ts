/** RTK Query endpoints for public registration and owner-managed user accounts. */
import { baseApi } from "@/app/api/baseApi";
import type {
  CreateUserRequest,
  CreateUserResponse,
  GetUsersResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from "../models";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
      query: (body) => ({ url: "/users", method: "POST", body }),
    }),

    getUsers: builder.query<GetUsersResponse, void>({
      query: () => ({ url: "/users", method: "GET" }),
      providesTags: ["User"],
    }),

    updateUser: builder.mutation<UpdateUserResponse, { id: string; body: UpdateUserRequest }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: "PATCH", body }),
      invalidatesTags: ["User", "Auth"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} = userApi;
