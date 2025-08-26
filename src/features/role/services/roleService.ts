import type { ApiResponse } from "@/types";
import { userApiClient } from "@/lib/api";

export interface RoleUpdate {
  userId: string;
  role: "admin" | "customer" | "provider";
}

export interface UserRole {
  role: "admin" | "customer" | "provider";
}

export const roleService = {
  async updateUserRole(data: RoleUpdate): Promise<ApiResponse<UserRole>> {
    try {
      const response = await userApiClient.patch<ApiResponse<UserRole>>(
        `/users/${data.userId}/role`,
        { role: data.role }
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Role update failed"
      );
    }
  },

  async getUserRole(userId: string): Promise<ApiResponse<UserRole>> {
    try {
      const response = await userApiClient.get<ApiResponse<UserRole>>(
        `/users/${userId}/role`
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to get user role"
      );
    }
  },

  async getAllRoles(): Promise<ApiResponse<string[]>> {
    try {
      const response = await userApiClient.get<ApiResponse<string[]>>("/roles");
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to get roles"
      );
    }
  },
};
