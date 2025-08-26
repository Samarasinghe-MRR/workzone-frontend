/**
 * useSettingsData Hook - Authentication related settings
 * This hook specifically handles authentication-related settings like password changes,
 * account verification status, and auth preferences.
 */

import { useState, useCallback } from "react";
import { authPasswordService } from "@/features/auth/services/authPasswordService";
import { authService } from "@/features/auth/services/authService";

interface AuthSettingsData {
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastPasswordChange: string | null;
  loginSessions: number;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface AuthSettingsReturn {
  authSettings: AuthSettingsData | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  
  // Actions
  fetchAuthSettings: () => Promise<void>;
  changePassword: (data: PasswordChangeData) => Promise<boolean>;
  enableTwoFactor: () => Promise<boolean>;
  disableTwoFactor: () => Promise<boolean>;
  resendVerificationEmail: () => Promise<boolean>;
  refreshAuthSettings: () => Promise<void>;
}

export const useSettingsData = (): AuthSettingsReturn => {
  const [authSettings, setAuthSettings] = useState<AuthSettingsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch authentication settings
  const fetchAuthSettings = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // For now, return mock data - implement actual auth settings API later
      const mockSettings: AuthSettingsData = {
        emailVerified: true,
        twoFactorEnabled: false,
        lastPasswordChange: new Date().toISOString(),
        loginSessions: 2,
      };
      
      setAuthSettings(mockSettings);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch auth settings";
      setError(errorMessage);
      console.error("Error fetching auth settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (data: PasswordChangeData): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);

      if (data.newPassword !== data.confirmPassword) {
        throw new Error("New passwords do not match");
      }

      const response = await authPasswordService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      if (response.success) {
        // Refresh auth settings to get updated last password change
        await fetchAuthSettings();
        return true;
      } else {
        throw new Error("Failed to change password");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to change password";
      setError(errorMessage);
      return false;
    } finally {
      setSaving(false);
    }
  }, [fetchAuthSettings]);

  // Enable two-factor authentication
  const enableTwoFactor = useCallback(async (): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);

      // For now, just simulate success - implement actual 2FA API later
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAuthSettings(prev => prev ? { ...prev, twoFactorEnabled: true } : null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to enable two-factor authentication";
      setError(errorMessage);
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  // Disable two-factor authentication
  const disableTwoFactor = useCallback(async (): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);

      // For now, just simulate success - implement actual 2FA API later
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAuthSettings(prev => prev ? { ...prev, twoFactorEnabled: false } : null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to disable two-factor authentication";
      setError(errorMessage);
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  // Resend email verification
  const resendVerificationEmail = useCallback(async (): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);

      const currentUser = await authService.getCurrentUser();
      if (!currentUser.data?.email) {
        throw new Error("No email address found");
      }

      // For now, just simulate success - implement actual verification API later
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send verification email";
      setError(errorMessage);
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  // Refresh auth settings alias
  const refreshAuthSettings = useCallback(async (): Promise<void> => {
    await fetchAuthSettings();
  }, [fetchAuthSettings]);

  return {
    authSettings,
    loading,
    saving,
    error,
    
    // Actions
    fetchAuthSettings,
    changePassword,
    enableTwoFactor,
    disableTwoFactor,
    resendVerificationEmail,
    refreshAuthSettings,
  };
};

export default useSettingsData;
