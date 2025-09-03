import { useState, useEffect, useCallback } from "react";
import { dashboardService } from "@/services/dashboardService";
import { DashboardData } from "@/types/dashboard";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

// Hook for fetching current user profile
export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getCurrentUser();

      if (response.success) {
        setUser(response.data);
      } else {
        setError(response.message || "Failed to fetch user profile");
      }
    } catch (err) {
      setError("An error occurred while fetching user profile");
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refetch: fetchUser };
};

// Hook for fetching dashboard data
export const useDashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getDashboardData();

      if (response.success) {
        setDashboard(response.data);
      } else {
        setError(response.message || "Failed to fetch dashboard data");
      }
    } catch (err) {
      setError("An error occurred while fetching dashboard data");
      console.error("Error fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboard, loading, error, refetch: fetchDashboard };
};

// Combined hook for user authentication state and dashboard
export const useAuthDashboard = () => {
  const {
    user,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useCurrentUser();
  const {
    dashboard,
    loading: dashLoading,
    error: dashError,
    refetch: refetchDashboard,
  } = useDashboard();

  const loading = userLoading || dashLoading;
  const error = userError || dashError;

  const refetchAll = useCallback(() => {
    refetchUser();
    refetchDashboard();
  }, [refetchUser, refetchDashboard]);

  return {
    user,
    dashboard,
    loading,
    error,
    refetch: refetchAll,
  };
};
