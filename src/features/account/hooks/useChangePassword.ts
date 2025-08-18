"use client";

import { useState } from "react";
import { accountService } from "../services/accountService";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changePassword = async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await accountService.changePassword(passwordData);
      if (response.success) {
        setSuccess(true);
        return true;
      } else {
        setError(response.error || "Failed to change password");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to change password"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    changePassword,
    reset,
  };
};
