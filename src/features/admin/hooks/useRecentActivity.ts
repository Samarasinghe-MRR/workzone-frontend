import { useState, useEffect } from "react";

interface Activity {
  title: string;
  time: string;
  type: "success" | "warning" | "error" | "info";
}

export function useRecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        // Simulate API call - replace with actual API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data for development
        setActivities([
          {
            title: "New provider registration submitted",
            time: "2 minutes ago",
            type: "info",
          },
          {
            title: "Payment dispute resolved",
            time: "15 minutes ago",
            type: "success",
          },
          {
            title: "High-value job completed",
            time: "1 hour ago",
            type: "success",
          },
          {
            title: "Provider verification pending",
            time: "2 hours ago",
            type: "warning",
          },
          {
            title: "Payment failed - requires attention",
            time: "3 hours ago",
            type: "error",
          },
        ]);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch activities"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { activities, isLoading, error };
}
