import { useState, useEffect, useCallback } from "react";
import { serviceProviderProfileService } from "../services/serviceProviderProfileService";
import type {
  ServiceProviderProfile,
  UpdateServiceProviderProfileDto,
} from "@/types/serviceProvider";

export function useProviderProfile() {
  const [profile, setProfile] = useState<ServiceProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await serviceProviderProfileService.getProfile();
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        setError(response.message || "Failed to fetch profile");
        setProfile(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
      setProfile(null);
      console.error("Failed to fetch provider profile", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (profileData: UpdateServiceProviderProfileDto) => {
      try {
        setUpdating(true);
        setError(null);
        const response = await serviceProviderProfileService.updateProfile(
          profileData
        );
        if (response.success && response.data) {
          setProfile(response.data);
          return { success: true, message: response.message };
        } else {
          setError(response.message || "Failed to update profile");
          return {
            success: false,
            message: response.message || "Failed to update profile",
          };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update profile";
        setError(errorMessage);
        console.error("Failed to update provider profile", err);
        return { success: false, message: errorMessage };
      } finally {
        setUpdating(false);
      }
    },
    []
  );

  const uploadPortfolioImage = useCallback(
    async (file: File) => {
      try {
        const response =
          await serviceProviderProfileService.uploadPortfolioImage(file);
        if (response.success) {
          // Refresh profile to get updated portfolio images
          await fetchProfile();
          return {
            success: true,
            imageUrl: response.imageUrl,
            message: response.message,
          };
        } else {
          return {
            success: false,
            message: response.message || "Failed to upload image",
          };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to upload image";
        console.error("Failed to upload portfolio image", err);
        return { success: false, message: errorMessage };
      }
    },
    [fetchProfile]
  );

  const removePortfolioImage = useCallback(
    async (imageUrl: string) => {
      try {
        const response =
          await serviceProviderProfileService.removePortfolioImage(imageUrl);
        if (response.success) {
          // Refresh profile to get updated portfolio images
          await fetchProfile();
          return { success: true, message: response.message };
        } else {
          return {
            success: false,
            message: response.message || "Failed to remove image",
          };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to remove image";
        console.error("Failed to remove portfolio image", err);
        return { success: false, message: errorMessage };
      }
    },
    [fetchProfile]
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updating,
    updateProfile,
    uploadPortfolioImage,
    removePortfolioImage,
    refetch: fetchProfile,
  };
}
