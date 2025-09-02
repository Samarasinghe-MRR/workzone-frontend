import { DashboardResponse } from "@/types/dashboard";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}

class DashboardService {
  private baseUrl = "/api/users/me";

  // Get authentication headers
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Get current user profile
  async getCurrentUser(): Promise<UserResponse> {
    const response = await fetch(this.baseUrl, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  // Get role-specific dashboard data
  async getDashboardData(): Promise<DashboardResponse> {
    const response = await fetch(`${this.baseUrl}/dashboard`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }
}

// Export a singleton instance
export const dashboardService = new DashboardService();
export default dashboardService;
