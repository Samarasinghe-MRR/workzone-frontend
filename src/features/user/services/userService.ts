import type { ApiResponse, User } from "@/types";

const API_BASE_URL = "/api"; // Use Next.js API routes instead of direct backend calls

// Mock API client for existing functionality (to be replaced with actual implementation)
const userApiClient = {
  async get<T>(url: string): Promise<T> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Request failed");
    }

    return await response.json();
  },

  async post<T>(url: string, data: unknown): Promise<T> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Request failed");
    }

    return await response.json();
  },

  async put<T>(url: string, data?: unknown): Promise<T> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Request failed");
    }

    return await response.json();
  },

  async delete<T>(url: string): Promise<T> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Request failed");
    }

    return await response.json();
  },
};

// Token manager for avatar upload
const tokenManager = {
  getToken(): string | null {
    return localStorage.getItem("token");
  },
};

export const userService = {
  // Profile Management - using new backend endpoints
  async getProfile(): Promise<ApiResponse<User>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      return {
        success: true,
        data: data,
        message: "Profile fetched successfully",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch profile"
      );
    }
  },

  async updateProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      return {
        success: true,
        data: data,
        message: "Profile updated successfully",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  },

  // Customer Profile Management
  async updateCustomerProfile(profileData: {
    address: string;
  }): Promise<ApiResponse<{ address: string }>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/users/me/customer-profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update customer profile");
      }

      return {
        success: true,
        data: data,
        message: "Customer profile updated successfully",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update customer profile"
      );
    }
  },

  // Service Provider Profile Management
  async updateServiceProviderProfile(profileData: {
    category: string;
    location: string;
    experienceYears: number;
    latitude: number;
    longitude: number;
  }): Promise<
    ApiResponse<{
      category: string;
      location: string;
      experienceYears: number;
      latitude: number;
      longitude: number;
    }>
  > {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/users/me/service-provider-profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update service provider profile"
        );
      }

      return {
        success: true,
        data: data,
        message: "Service provider profile updated successfully",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update service provider profile"
      );
    }
  },

  // User Management (existing functionality)
  async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      return await userApiClient.get<ApiResponse<User>>(`/users/${id}`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch user"
      );
    }
  },

  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    try {
      return await userApiClient.get<ApiResponse<User>>(
        `/users/email/${encodeURIComponent(email)}`
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch user"
      );
    }
  },

  async getAllUsers(): Promise<ApiResponse<User[]>> {
    try {
      return await userApiClient.get<ApiResponse<User[]>>("/users");
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch users"
      );
    }
  },

  async createUser(userData: Omit<User, "id">): Promise<ApiResponse<User>> {
    try {
      return await userApiClient.post<ApiResponse<User>>("/users", userData);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to create user"
      );
    }
  },

  async updateUser(
    id: string,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> {
    try {
      return await userApiClient.put<ApiResponse<User>>(
        `/users/${id}`,
        userData
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update user"
      );
    }
  },

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    try {
      return await userApiClient.delete<ApiResponse<void>>(`/users/${id}`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    }
  },

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> {
    try {
      return await userApiClient.put<ApiResponse<void>>(
        "/profile/password",
        passwordData
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to change password"
      );
    }
  },

  async uploadAvatar(file: File): Promise<ApiResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      // Note: We need to use fetch directly for FormData
      const response = await fetch(`/api/users/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenManager.getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload avatar");
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to upload avatar"
      );
    }
  },

  // Verification Management
  async verifyUser(id: string): Promise<ApiResponse<User>> {
    try {
      return await userApiClient.put<ApiResponse<User>>(`/users/${id}/verify`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to verify user"
      );
    }
  },

  async unverifyUser(id: string): Promise<ApiResponse<User>> {
    try {
      return await userApiClient.put<ApiResponse<User>>(
        `/users/${id}/unverify`
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to unverify user"
      );
    }
  },

  async updateVerificationStatus(
    userId: string,
    isVerified: boolean
  ): Promise<ApiResponse<User>> {
    try {
      return await userApiClient.put<ApiResponse<User>>(
        `/users/${userId}/verification`,
        {
          verified: isVerified,
        }
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update verification status"
      );
    }
  },

  // Role Management
  async getUsersByRole(
    role: "admin" | "customer" | "provider"
  ): Promise<ApiResponse<User[]>> {
    try {
      return await userApiClient.get<ApiResponse<User[]>>(
        `/users/role/${role}`
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch users by role"
      );
    }
  },

  // Statistics
  async getUserStats(): Promise<
    ApiResponse<{
      totalUsers: number;
      activeUsers: number;
      newUsersThisMonth: number;
      usersByRole: Record<string, number>;
    }>
  > {
    try {
      return await userApiClient.get<
        ApiResponse<{
          totalUsers: number;
          activeUsers: number;
          newUsersThisMonth: number;
          usersByRole: Record<string, number>;
        }>
      >("/users/stats");
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch user statistics"
      );
    }
  },
};
