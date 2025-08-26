import type { ApiResponse } from "@/types";

const API_BASE_URL = "/api"; // Use Next.js API routes instead of direct backend calls

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const authPasswordService = {
  // Password Management
  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      return {
        success: true,
        data: data,
        message: "Password changed successfully",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to change password"
      );
    }
  },

  // Email Management
  async updateEmail(email: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/update-email`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update email");
      }

      return {
        success: true,
        data: data,
        message: "Email updated successfully",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update email"
      );
    }
  },

  // Forgot Password
  async forgotPassword(
    email: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      return {
        success: true,
        data: data,
        message: "Password reset email sent successfully",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to send reset email"
      );
    }
  },

  // Reset Password
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      return {
        success: true,
        data: data,
        message: "Password reset successfully",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to reset password"
      );
    }
  },
};
