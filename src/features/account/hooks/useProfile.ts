"use client";

import { useState } from "react";
import { accountService } from "../services/accountService";
import type { User } from "@/types";

export const useProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await accountService.getProfile();
      if (response.success && "data" in response) {
        setProfile(response.data ?? null);
      } else {
        setError(response.error || "Failed to fetch profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await accountService.updateProfile(profileData);
      if (response.success && "data" in response) {
        setProfile(response.data ?? null);
        return true;
      } else {
        setError(response.error || "Failed to update profile");
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
};
