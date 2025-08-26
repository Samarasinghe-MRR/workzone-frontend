import type { AdminStats, ApiResponse, User, Job, Transaction } from "@/types";
import { userService } from "@/features/user/services/userService";
import { userApiClient } from "@/lib/api";

export const adminService = {
  async getStats(): Promise<ApiResponse<AdminStats>> {
    try {
      // Get real user statistics from backend
      const userStatsResponse = await userService.getUserStats();
      const userStats = userStatsResponse.data;

      // Get additional admin stats
      const adminStatsResponse = await userApiClient.get<
        ApiResponse<{
          activeJobs: number;
          totalRevenue: number;
          monthlyRevenue: number;
          totalPayments: number;
          pendingPayments: number;
        }>
      >("/admin/stats");

      const stats: AdminStats = {
        totalUsers: userStats?.totalUsers ?? 0,
        totalCustomers: userStats?.usersByRole?.customer ?? 0,
        totalProviders: userStats?.usersByRole?.provider ?? 0,
        activeJobs: adminStatsResponse.data?.activeJobs || 0,
        pendingVerifications: 0, // TODO: Implement pending verifications endpoint
        totalRevenue: adminStatsResponse.data?.totalRevenue || 0,
        monthlyRevenue: adminStatsResponse.data?.monthlyRevenue || 0,
        totalPayments: adminStatsResponse.data?.totalPayments || 0,
        pendingPayments: adminStatsResponse.data?.pendingPayments || 0,
      };

      return {
        data: stats,
        success: true,
        message: "Admin stats fetched successfully",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch admin stats"
      );
    }
  },

  async getUsers(
    page = 1,
    limit = 10,
    role?: string
  ): Promise<ApiResponse<User[]>> {
    try {
      // Use the user service to get all users
      const response = await userService.getAllUsers();
      let users = response.data;

      // Filter by role if specified
      if (role) {
        users = (users ?? []).filter((user) => user.role === role);
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const paginatedUsers = (users ?? []).slice(
        startIndex,
        startIndex + limit
      );

      return {
        data: paginatedUsers,
        success: true,
        message: "Users fetched successfully",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch users"
      );
    }
  },

  async updateUserStatus(
    userId: string,
    status: string
  ): Promise<ApiResponse<User>> {
    try {
      // Map status to verification status
      const isVerified = status === "Active";
      return await userService.updateVerificationStatus(userId, isVerified);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update user status"
      );
    }
  },

  async getPendingVerifications(): Promise<ApiResponse<User[]>> {
    try {
      const response = await userService.getAllUsers();
      const pendingUsers = (response.data ?? []).filter(
        (user) => !user.verified && user.role === "provider"
      );

      return {
        data: pendingUsers,
        success: true,
        message: "Pending verifications fetched successfully",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch pending verifications"
      );
    }
  },

  async approveProvider(providerId: string): Promise<ApiResponse<User>> {
    try {
      return await userService.updateVerificationStatus(providerId, true);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to approve provider"
      );
    }
  },

  async rejectProvider(
    providerId: string,
    reason: string
  ): Promise<ApiResponse<User>> {
    try {
      // For now, we'll just set verification to false
      // TODO: Add rejection reason handling in the backend
      console.log("Rejection reason:", reason); // Log for now
      return await userService.updateVerificationStatus(providerId, false);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to reject provider"
      );
    }
  },

  // Mock functions for jobs and transactions - replace with actual service calls
  async getJobs(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    page = 1,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    limit = 10,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    status?: string
  ): Promise<ApiResponse<Job[]>> {
    try {
      // TODO: Replace with actual job service call
      const mockJobs: Job[] = [];

      return {
        data: mockJobs,
        success: true,
        message: "Jobs fetched successfully",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch jobs"
      );
    }
  },

  async getTransactions(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    page = 1,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    limit = 10
  ): Promise<ApiResponse<Transaction[]>> {
    try {
      // TODO: Replace with actual payment service call
      const mockTransactions: Transaction[] = [];

      return {
        data: mockTransactions,
        success: true,
        message: "Transactions fetched successfully",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch transactions"
      );
    }
  },

  //   async processRefund(
  //     transactionId: string,
  //     amount: number
  //   ): Promise<ApiResponse<Transaction>> {
  //     try {
  //       // TODO: Replace with actual payment service call
  //       const mockTransaction: Transaction = {
  //         id: transactionId,
  //         jobId: "",
  //        // customerId: "",
  //        // providerId: "",
  //         amount: amount,
  //         //commission: 0,
  //         status: "refunded",
  //         //paymentMethod: "",
  //         createdAt: new Date().toISOString(),
  //       };

  //       return {
  //         data: mockTransaction,
  //         success: true,
  //         message: "Refund processed successfully",
  //       };
  //     } catch (error) {
  //       throw new Error(
  //         error instanceof Error ? error.message : "Failed to process refund"
  //       );
  //     }
  //   },
};
