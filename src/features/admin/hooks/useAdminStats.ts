import { useState, useEffect } from "react";
import { AdminStats } from "@/types";
import { adminService } from "@/features/admin/services/adminService";

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getStats();
      setStats(response.data ?? null);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch admin stats"
      );
      // Fallback data for development
      setStats({
        totalUsers: 1247,
        totalCustomers: 892,
        totalProviders: 355,
        activeJobs: 184,
        pendingVerifications: 23,
        totalRevenue: 125430,
        monthlyRevenue: 18750,
        totalPayments: 1456,
        pendingPayments: 12,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, isLoading, error, refetch: fetchStats };
}
