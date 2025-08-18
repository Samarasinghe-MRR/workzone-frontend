import type { User, PaymentMethod, Notification, ApiResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const accountService = {
  async getProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/account/profile`, {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch profile"
      );
    }
  },

  async updateProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/account/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  },

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/account/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to change password"
      );
    }
  },

  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/account/payment-methods`, {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch payment methods");
      }

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch payment methods"
      );
    }
  },

  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/account/notifications`, {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch notifications");
      }

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch notifications"
      );
    }
  },

  async markNotificationAsRead(
    notificationId: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/account/notifications/${notificationId}/read`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to mark notification as read");
      }

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to mark notification as read"
      );
    }
  },
};
