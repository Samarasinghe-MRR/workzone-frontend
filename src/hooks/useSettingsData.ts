/**
 * useSettingsData Hook
 * Custom hook for managing user settings data and operations
 */

import { useState, useEffect, useCallback } from "react";
import { userService } from "@/features/user/services/userService";
import { authPasswordService } from "@/features/auth/services/authPasswordService";
import type { User } from "@/types";

// Simple form data types for settings
interface ProfileSettingsFormData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  avatar?: File;
}

interface SecuritySettingsFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProviderSettingsFormData {
  category?: string;
  location?: string;
  experienceYears?: number;
  latitude?: number;
  longitude?: number;
}

interface UseSettingsDataReturn {
  user: User | null;
  loading: boolean;
  saving: boolean;
  error: string | null;

  // Actions
  fetchUserData: () => Promise<void>;
  updateProfile: (data: ProfileSettingsFormData) => Promise<boolean>;
  changePassword: (data: SecuritySettingsFormData) => Promise<boolean>;
  updateNotifications: () => Promise<boolean>;
  updatePrivacy: () => Promise<boolean>;
  updateProviderSettings: (data: ProviderSettingsFormData) => Promise<boolean>;
  updateCustomerSettings: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
}

export const useSettingsData = (): UseSettingsDataReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data
  const fetchUserData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await userService.getProfile();

      if (response.success && response.data) {
        setUser(response.data);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch user data";
      setError(errorMessage);
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile settings
  const updateProfile = useCallback(
    async (data: ProfileSettingsFormData): Promise<boolean> => {
      try {
        setSaving(true);
        setError(null);

        // Convert form data to User partial, matching the User interface
        const profileData: Partial<User> = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          location: data.location,
          // Note: avatar file upload would need separate handling
        };

        const response = await userService.updateProfile(profileData);

        if (response.success) {
          // Refresh user data to get updated profile
          await fetchUserData();
          return true;
        } else {
          throw new Error("Failed to update profile");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update profile";
        setError(errorMessage);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [fetchUserData]
  );

  // Change password
  const changePassword = useCallback(
    async (data: SecuritySettingsFormData): Promise<boolean> => {
      try {
        setSaving(true);
        setError(null);

        const response = await authPasswordService.changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });

        if (response.success) {
          return true;
        } else {
          throw new Error("Failed to change password");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to change password";
        setError(errorMessage);
        return false;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  // Update notification settings
  const updateNotifications = useCallback(async (): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);

      // For now, just simulate success - implement actual notification API later
      await new Promise((resolve) => setTimeout(resolve, 500));

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update notification settings";
      setError(errorMessage);
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  // Update privacy settings
  const updatePrivacy = useCallback(async (): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);

      // For now, just simulate success - implement actual privacy API later
      await new Promise((resolve) => setTimeout(resolve, 500));

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update privacy settings";
      setError(errorMessage);
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  // Update service provider-specific settings
  const updateProviderSettings = useCallback(
    async (data: ProviderSettingsFormData): Promise<boolean> => {
      try {
        setSaving(true);
        setError(null);

        const response = await userService.updateServiceProviderProfile({
          category: data.category || "",
          location: data.location || user?.location || "",
          experienceYears: data.experienceYears || 0,
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
        });

        if (response.success) {
          // Refresh user data to get updated profile
          await fetchUserData();
          return true;
        } else {
          throw new Error("Failed to update provider settings");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update provider settings";
        setError(errorMessage);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [user, fetchUserData]
  );

  // Update customer-specific settings
  const updateCustomerSettings = useCallback(async (): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);

      const response = await userService.updateCustomerProfile({
        address: user?.location || "",
      });

      if (response.success) {
        // Refresh user data to get updated profile
        await fetchUserData();
        return true;
      } else {
        throw new Error("Failed to update customer settings");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update customer settings";
      setError(errorMessage);
      return false;
    } finally {
      setSaving(false);
    }
  }, [user, fetchUserData]);

  // Refresh user data alias
  const refreshUserData = useCallback(async (): Promise<void> => {
    await fetchUserData();
  }, [fetchUserData]);

  // Initial data fetch
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    user,
    loading,
    saving,
    error,

    // Actions
    fetchUserData,
    updateProfile,
    changePassword,
    updateNotifications,
    updatePrivacy,
    updateProviderSettings,
    updateCustomerSettings,
    refreshUserData,
  };
};

export default useSettingsData;
