/**
 * Settings Service - Backend Integration through API Gateway
 * Handles user settings, preferences, and configuration management
 */

import { userApiClient, authApiClient, tokenManager } from "@/lib/api";
import type { User, ApiResponse } from "@/types";

export interface UserSettings {
  id: string;
  userId: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    jobUpdates: boolean;
    marketing: boolean;
    weeklyReport: boolean;
  };
  privacy: {
    profileVisibility: "public" | "limited" | "private";
    showContactInfo: boolean;
    showLocation: boolean;
    allowDirectMessages: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    currency: string;
    theme: "light" | "dark" | "auto";
    emailFrequency: "immediate" | "daily" | "weekly" | "never";
  };
  security: {
    twoFactorEnabled: boolean;
    loginNotifications: boolean;
    sessionTimeout: number;
  };
  business?: {
    businessName?: string;
    businessType?: string;
    taxId?: string;
    address?: string;
    website?: string;
    description?: string;
  };
  billing?: {
    preferredPaymentMethod?: string;
    autoPayEnabled?: boolean;
    invoiceEmail?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  jobUpdates: boolean;
  marketing: boolean;
  weeklyReport: boolean;
}

export interface PrivacySettings {
  profileVisibility: "public" | "limited" | "private";
  showContactInfo: boolean;
  showLocation: boolean;
  allowDirectMessages: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TwoFactorSetup {
  qrCode: string;
  secret: string;
  backupCodes: string[];
}

class SettingsService {
  /**
   * Get user settings (requires authentication)
   */
  async getUserSettings(): Promise<ApiResponse<UserSettings>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to fetch settings");
      }

      return await userApiClient.get<ApiResponse<UserSettings>>(
        "/me/settings",
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch user settings"
      );
    }
  }

  /**
   * Update user settings (requires authentication)
   */
  async updateUserSettings(
    settings: Partial<UserSettings>
  ): Promise<ApiResponse<UserSettings>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to update settings");
      }

      return await userApiClient.patch<ApiResponse<UserSettings>>(
        "/me/settings",
        settings,
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update user settings"
      );
    }
  }

  /**
   * Update notification preferences (requires authentication)
   */
  async updateNotificationPreferences(
    notifications: NotificationPreferences
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to update notifications");
      }

      return await userApiClient.patch<ApiResponse<{ message: string }>>(
        "/me/settings/notifications",
        { notifications },
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update notification preferences"
      );
    }
  }

  /**
   * Update privacy settings (requires authentication)
   */
  async updatePrivacySettings(
    privacy: PrivacySettings
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to update privacy settings");
      }

      return await userApiClient.patch<ApiResponse<{ message: string }>>(
        "/me/settings/privacy",
        { privacy },
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update privacy settings"
      );
    }
  }

  /**
   * Update security settings (requires authentication)
   */
  async updateSecuritySettings(
    security: SecuritySettings
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to update security settings");
      }

      return await userApiClient.patch<ApiResponse<{ message: string }>>(
        "/me/settings/security",
        { security },
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update security settings"
      );
    }
  }

  /**
   * Change password (requires authentication)
   */
  async changePassword(
    passwordData: ChangePasswordData
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to change password");
      }

      return await authApiClient.post<ApiResponse<{ message: string }>>(
        "/change-password",
        passwordData,
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to change password"
      );
    }
  }

  /**
   * Enable two-factor authentication (requires authentication)
   */
  async enableTwoFactor(): Promise<ApiResponse<TwoFactorSetup>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to enable 2FA");
      }

      return await authApiClient.post<ApiResponse<TwoFactorSetup>>(
        "/2fa/enable",
        {},
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to enable two-factor authentication"
      );
    }
  }

  /**
   * Verify and activate two-factor authentication (requires authentication)
   */
  async verifyTwoFactor(
    code: string
  ): Promise<ApiResponse<{ message: string; backupCodes: string[] }>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to verify 2FA");
      }

      return await authApiClient.post<
        ApiResponse<{ message: string; backupCodes: string[] }>
      >("/2fa/verify", { code }, true);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to verify two-factor authentication"
      );
    }
  }

  /**
   * Disable two-factor authentication (requires authentication)
   */
  async disableTwoFactor(
    password: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to disable 2FA");
      }

      return await authApiClient.post<ApiResponse<{ message: string }>>(
        "/2fa/disable",
        { password },
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to disable two-factor authentication"
      );
    }
  }

  /**
   * Get user profile data (requires authentication)
   */
  async getUserProfile(): Promise<ApiResponse<User>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to fetch profile");
      }

      return await userApiClient.get<ApiResponse<User>>("/me", true);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch user profile"
      );
    }
  }

  /**
   * Update user profile (requires authentication)
   */
  async updateUserProfile(
    profileData: Partial<User>
  ): Promise<ApiResponse<User>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to update profile");
      }

      return await userApiClient.patch<ApiResponse<User>>(
        "/me",
        profileData,
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update user profile"
      );
    }
  }

  /**
   * Upload profile avatar (requires authentication)
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to upload avatar");
      }

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`${userApiClient["baseUrl"]}/me/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenManager.getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to upload avatar"
      );
    }
  }

  /**
   * Delete user account (requires authentication)
   */
  async deleteAccount(
    password: string,
    reason?: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to delete account");
      }

      return await userApiClient.post<ApiResponse<{ message: string }>>(
        "/me/delete",
        { password, reason },
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete account"
      );
    }
  }

  /**
   * Export user data (requires authentication)
   */
  async exportUserData(): Promise<ApiResponse<{ downloadUrl: string }>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to export data");
      }

      return await userApiClient.get<ApiResponse<{ downloadUrl: string }>>(
        "/me/export",
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to export user data"
      );
    }
  }

  /**
   * Get account activity log (requires authentication)
   */
  async getActivityLog(): Promise<
    ApiResponse<
      Array<{
        id: string;
        action: string;
        details: string;
        ipAddress: string;
        userAgent: string;
        createdAt: string;
      }>
    >
  > {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to fetch activity log");
      }

      return await userApiClient.get<
        ApiResponse<
          Array<{
            id: string;
            action: string;
            details: string;
            ipAddress: string;
            userAgent: string;
            createdAt: string;
          }>
        >
      >("/me/activity", true);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch activity log"
      );
    }
  }

  /**
   * Get connected accounts/integrations (requires authentication)
   */
  async getConnectedAccounts(): Promise<
    ApiResponse<
      Array<{
        id: string;
        provider: string;
        email: string;
        connectedAt: string;
        status: "active" | "inactive";
      }>
    >
  > {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to fetch connected accounts");
      }

      return await userApiClient.get<
        ApiResponse<
          Array<{
            id: string;
            provider: string;
            email: string;
            connectedAt: string;
            status: "active" | "inactive";
          }>
        >
      >("/me/connections", true);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch connected accounts"
      );
    }
  }

  /**
   * Disconnect a connected account (requires authentication)
   */
  async disconnectAccount(
    connectionId: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to disconnect account");
      }

      return await userApiClient.delete<ApiResponse<{ message: string }>>(
        `/me/connections/${connectionId}`,
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to disconnect account"
      );
    }
  }
}

export const settingsService = new SettingsService();
