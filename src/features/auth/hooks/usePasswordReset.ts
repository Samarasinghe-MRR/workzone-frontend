"use client";

import { useState } from "react";
import { authPasswordService } from "../services/authPasswordService";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendResetEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await authPasswordService.forgotPassword(email);
      if (response.success) {
        setSuccess(true);
        return true;
      } else {
        setError(response.error || "Failed to send reset email");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset email"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await authPasswordService.resetPassword(
        token,
        newPassword
      );
      if (response.success) {
        setSuccess(true);
        return true;
      } else {
        setError(response.error || "Failed to reset password");
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    sendResetEmail,
    resetPassword,
  };
};
