/**
 * useUserSettings Hook
 * Custom hook for managing user-specific settings and preferences
 * This hook focuses on user interface preferences, notifications, and privacy settings
 */

import { useState, useEffect, useCallback } from "react";
import { userService } from "@/features/user/services/userService";
import type { User } from "@/types";

interface UserSettings {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showEmail: boolean;
    showPhone: boolean;
    allowIndexing: boolean;
  };
  preferences: {
    autoSave: boolean;
    compactView: boolean;
    showTips: boolean;
  };
}

interface UseUserSettingsReturn {
  user: User | null;
  settings: UserSettings | null;
  loading: boolean;
  saving: boolean;
  error: string | null;

  // Actions
  fetchUserSettings: () => Promise<void>;
  updateTheme: (theme: UserSettings["theme"]) => Promise<boolean>;
  updateLanguage: (language: string) => Promise<boolean>;
  updateNotificationSettings: (
    notifications: UserSettings["notifications"]
  ) => Promise<boolean>;
  updatePrivacySettings: (privacy: UserSettings["privacy"]) => Promise<boolean>;
  updatePreferences: (
    preferences: UserSettings["preferences"]
  ) => Promise<boolean>;
  resetSettingsToDefault: () => Promise<boolean>;
  exportSettings: () => UserSettings | null;
  importSettings: (settings: UserSettings) => Promise<boolean>;
}

const defaultSettings: UserSettings = {
  theme: "system",
  language: "en",
  timezone: "UTC",
  currency: "USD",
  notifications: {
    email: true,
    push: true,
    sms: false,
    marketing: false,
  },
  privacy: {
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowIndexing: true,
  },
  preferences: {
    autoSave: true,
    compactView: false,
    showTips: true,
  },
};

export const useUserSettings = (): UseUserSettingsReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user and settings data
  const fetchUserSettings = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user profile
      const userResponse = await userService.getProfile();
      if (userResponse.success && userResponse.data) {
        setUser(userResponse.data);
      }

      // For now, use default settings - implement actual settings API later
      // In a real app, this would fetch from user preferences stored in backend
      const savedSettings = localStorage.getItem("userSettings");
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsedSettings });
        } catch {
          setSettings(defaultSettings);
        }
      } else {
        setSettings(defaultSettings);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch user settings";
      setError(errorMessage);
      console.error("Error fetching user settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update theme setting
  const updateTheme = useCallback(
    async (theme: UserSettings["theme"]): Promise<boolean> => {
      try {
        setSaving(true);
        setError(null);

        // Update local state
        setSettings((prev) => (prev ? { ...prev, theme } : null));

        // Save to localStorage (in real app, save to backend)
        if (settings) {
          const updatedSettings = { ...settings, theme };
          localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update theme";
        setError(errorMessage);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [settings]
  );

  // Update language setting
  const updateLanguage = useCallback(
    async (language: string): Promise<boolean> => {
      try {
        setSaving(true);
        setError(null);

        // Update local state
        setSettings((prev) => (prev ? { ...prev, language } : null));

        // Save to localStorage (in real app, save to backend)
        if (settings) {
          const updatedSettings = { ...settings, language };
          localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update language";
        setError(errorMessage);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [settings]
  );

  // Update notification settings
  const updateNotificationSettings = useCallback(
    async (notifications: UserSettings["notifications"]): Promise<boolean> => {
      try {
        setSaving(true);
        setError(null);

        // Update local state
        setSettings((prev) => (prev ? { ...prev, notifications } : null));

        // Save to localStorage (in real app, save to backend)
        if (settings) {
          const updatedSettings = { ...settings, notifications };
          localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
        }

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
    },
    [settings]
  );

  // Update privacy settings
  const updatePrivacySettings = useCallback(
    async (privacy: UserSettings["privacy"]): Promise<boolean> => {
      try {
        setSaving(true);
        setError(null);

        // Update local state
        setSettings((prev) => (prev ? { ...prev, privacy } : null));

        // Save to localStorage (in real app, save to backend)
        if (settings) {
          const updatedSettings = { ...settings, privacy };
          localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
        }

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
    },
    [settings]
  );

  // Update user preferences
  const updatePreferences = useCallback(
    async (preferences: UserSettings["preferences"]): Promise<boolean> => {
      try {
        setSaving(true);
        setError(null);

        // Update local state
        setSettings((prev) => (prev ? { ...prev, preferences } : null));

        // Save to localStorage (in real app, save to backend)
        if (settings) {
          const updatedSettings = { ...settings, preferences };
          localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update preferences";
        setError(errorMessage);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [settings]
  );

  // Reset settings to default
  const resetSettingsToDefault = useCallback(async (): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);

      // Reset to default settings
      setSettings(defaultSettings);
      localStorage.setItem("userSettings", JSON.stringify(defaultSettings));

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reset settings";
      setError(errorMessage);
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  // Export current settings
  const exportSettings = useCallback((): UserSettings | null => {
    return settings;
  }, [settings]);

  // Import settings from backup
  const importSettings = useCallback(
    async (importedSettings: UserSettings): Promise<boolean> => {
      try {
        setSaving(true);
        setError(null);

        // Validate and merge with default settings
        const validatedSettings = { ...defaultSettings, ...importedSettings };
        setSettings(validatedSettings);
        localStorage.setItem("userSettings", JSON.stringify(validatedSettings));

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to import settings";
        setError(errorMessage);
        return false;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  // Initialize settings on mount
  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  return {
    user,
    settings,
    loading,
    saving,
    error,

    // Actions
    fetchUserSettings,
    updateTheme,
    updateLanguage,
    updateNotificationSettings,
    updatePrivacySettings,
    updatePreferences,
    resetSettingsToDefault,
    exportSettings,
    importSettings,
  };
};

export default useUserSettings;
