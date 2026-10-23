/** Request and response models for owner-managed user accounts. */
import type { AuthUser } from "@/features/auth/models";
import type { ApiResponse } from "@/shared/models";

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export type CreateUserResponse = ApiResponse<AuthUser>;
export type GetUsersResponse = ApiResponse<AuthUser[]>;
export type UpdateUserResponse = ApiResponse<AuthUser>;

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: AuthUser["role"];
  tenantId?: string | null;
}
