import { gatewayServices } from "@/lib/gatewayApi";
import type { ApiResponse, UserAligned } from "@/types";

// Dashboard response type that matches backend
interface DashboardData {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  location?: string;
  businessName?: string;
  businessAddress?: string;
  role: string;
  rating?: number;
  completedJobs?: number;
  createdAt?: string;
  memberSince?: string;
  // Provider-specific data returned by getProviderComprehensiveData
  jobs?: Record<string, unknown>[];
  earnings?: number;
  stats?: Record<string, unknown>;
}

class UserService {
  // Get current user dashboard (role-specific data)
  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    return gatewayServices.users.get<ApiResponse<DashboardData>>(
      "/me/dashboard",
      true
    );
  }

  // Get current user profile
  async getProfile(): Promise<ApiResponse<UserAligned.User>> {
    return gatewayServices.users.get<ApiResponse<UserAligned.User>>(
      "/profile",
      true
    );
  }

  // Update user profile
  async updateProfile(
    profileData: UserAligned.UpdateUserProfileData
  ): Promise<ApiResponse<UserAligned.User>> {
    return gatewayServices.users.put<ApiResponse<UserAligned.User>>(
      "/profile",
      profileData,
      true
    );
  }

  // Change password
  async changePassword(
    passwordData: UserAligned.ChangePasswordData
  ): Promise<ApiResponse<{ message: string }>> {
    return gatewayServices.users.post<ApiResponse<{ message: string }>>(
      "/change-password",
      passwordData,
      true
    );
  }

  // Upload profile picture
  async uploadProfilePicture(
    file: File
  ): Promise<ApiResponse<{ profilePictureUrl: string }>> {
    const formData = new FormData();
    formData.append("profilePicture", file);

    // For file uploads, we need to use a different approach
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/users/profile/picture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    return response.json();
  }

  // Get user by ID (for admin or public profiles)
  async getUserById(userId: string): Promise<ApiResponse<UserAligned.User>> {
    return gatewayServices.users.get<ApiResponse<UserAligned.User>>(
      `/${userId}`,
      true
    );
  }

  // Get all users (admin only)
  async getAllUsers(
    page = 1,
    limit = 10,
    search?: string,
    role?: string
  ): Promise<
    ApiResponse<{
      users: UserAligned.User[];
      total: number;
      page: number;
      limit: number;
    }>
  > {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (search) queryParams.append("search", search);
    if (role) queryParams.append("role", role);

    const endpoint = `/?${queryParams.toString()}`;
    return gatewayServices.users.get<
      ApiResponse<{
        users: UserAligned.User[];
        total: number;
        page: number;
        limit: number;
      }>
    >(endpoint, true);
  }

  // Update user role (admin only)
  async updateUserRole(
    userId: string,
    role: string
  ): Promise<ApiResponse<UserAligned.User>> {
    return gatewayServices.users.patch<ApiResponse<UserAligned.User>>(
      `/${userId}/role`,
      { role },
      true
    );
  }

  // Deactivate user account (admin only)
  async deactivateUser(
    userId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return gatewayServices.users.patch<ApiResponse<{ message: string }>>(
      `/${userId}/deactivate`,
      {},
      true
    );
  }

  // Activate user account (admin only)
  async activateUser(
    userId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return gatewayServices.users.patch<ApiResponse<{ message: string }>>(
      `/${userId}/activate`,
      {},
      true
    );
  }

  // Delete user account (admin only)
  async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return gatewayServices.users.delete<ApiResponse<{ message: string }>>(
      `/${userId}`,
      true
    );
  }

  // Get user statistics (admin only)
  async getUserStats(): Promise<
    ApiResponse<{
      totalUsers: number;
      activeUsers: number;
      newUsersThisMonth: number;
      usersByRole: Record<string, number>;
    }>
  > {
    return gatewayServices.users.get<
      ApiResponse<{
        totalUsers: number;
        activeUsers: number;
        newUsersThisMonth: number;
        usersByRole: Record<string, number>;
      }>
    >("/stats", true);
  }

  // Search users by skills or location
  async searchUsers(
    query: string,
    filters?: {
      skills?: string[];
      location?: string;
      role?: string;
    }
  ): Promise<ApiResponse<UserAligned.User[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append("q", query);

    if (filters) {
      if (filters.skills) {
        filters.skills.forEach((skill) => queryParams.append("skills", skill));
      }
      if (filters.location) queryParams.append("location", filters.location);
      if (filters.role) queryParams.append("role", filters.role);
    }

    const endpoint = `/search?${queryParams.toString()}`;
    return gatewayServices.users.get<ApiResponse<UserAligned.User[]>>(
      endpoint,
      true
    );
  }

  // Get user notifications settings
  async getNotificationSettings(): Promise<
    ApiResponse<{
      emailNotifications: boolean;
      pushNotifications: boolean;
      smsNotifications: boolean;
      jobAlerts: boolean;
      messageAlerts: boolean;
    }>
  > {
    return gatewayServices.users.get<
      ApiResponse<{
        emailNotifications: boolean;
        pushNotifications: boolean;
        smsNotifications: boolean;
        jobAlerts: boolean;
        messageAlerts: boolean;
      }>
    >("/settings/notifications", true);
  }

  // Update notification settings
  async updateNotificationSettings(settings: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    smsNotifications?: boolean;
    jobAlerts?: boolean;
    messageAlerts?: boolean;
  }): Promise<ApiResponse<{ message: string }>> {
    return gatewayServices.users.patch<ApiResponse<{ message: string }>>(
      "/settings/notifications",
      settings,
      true
    );
  }

  // Request account deletion
  async requestAccountDeletion(): Promise<ApiResponse<{ message: string }>> {
    return gatewayServices.users.post<ApiResponse<{ message: string }>>(
      "/delete-request",
      {},
      true
    );
  }

  // Cancel account deletion request
  async cancelAccountDeletion(): Promise<ApiResponse<{ message: string }>> {
    return gatewayServices.users.delete<ApiResponse<{ message: string }>>(
      "/delete-request",
      true
    );
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
