// src/services/accountService.ts
import axios from "axios";
import type { User } from "@/types";

// ✅ You can configure a base URL depending on your API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const accountService = {
  // Fetch user profile
  async getProfile() {
    try {
      const res = await axios.get<{
        success: boolean;
        data: User;
        error?: string;
      }>(
        `${API_URL}/users/profile`,
        { withCredentials: true } // if you're using cookies/session
      );
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Update user profile
  async updateProfile(profileData: Partial<User>) {
    try {
      const res = await axios.put<{
        success: boolean;
        data: User;
        error?: string;
      }>(`${API_URL}/users/profile`, profileData, { withCredentials: true });
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // ✅ Change password
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await axios.post<{ success: boolean; error?: string }>(
        `${API_URL}/users/change-password`,
        passwordData,
        { withCredentials: true }
      );

      if (response.data.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: response.data.error || "Failed to change password",
        };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};
