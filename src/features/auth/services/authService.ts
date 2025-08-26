import type {
  LoginCredentials,
  SignupData,
  ResetPasswordData,
  AuthUser,
  ApiResponse,
} from "@/types";
import { authApiClient, tokenManager } from "@/lib/api";

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> {
    try {
      console.log("AuthService.login called with:", credentials); // Debug log
      const response = await authApiClient.post<ApiResponse<AuthUser>>(
        "/auth/login",
        credentials,
        false // No auth required for login
      );

      // Store tokens using the centralized token manager
      if (response.data?.token) {
        tokenManager.setTokens(response.data.token, response.data.refreshToken);
      }

      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  },

  async signup(userData: SignupData): Promise<ApiResponse<AuthUser>> {
    console.log("authService.signup - Called with userData:", userData);
    try {
      const response = await authApiClient.post<ApiResponse<AuthUser>>(
        "/auth/signup",
        userData,
        false // No auth required for signup
      );

      // Store tokens if registration includes auto-login
      if (response.data?.token) {
        tokenManager.setTokens(response.data.token, response.data.refreshToken);
      }

      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Signup failed");
    }
  },

  async forgotPassword(
    email: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      return await authApiClient.post<ApiResponse<{ message: string }>>(
        "/auth/forgot-password",
        { email },
        false // No auth required for forgot password
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to send reset email"
      );
    }
  },

  async resetPassword(
    resetData: ResetPasswordData
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      return await authApiClient.post<ApiResponse<{ message: string }>>(
        "/auth/reset-password",
        resetData,
        false // No auth required for reset password
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to reset password"
      );
    }
  },

  async refreshToken(): Promise<
    ApiResponse<{ token: string; refreshToken: string }>
  > {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await authApiClient.post<
        ApiResponse<{ token: string; refreshToken: string }>
      >(
        "/auth/refresh",
        { refreshToken },
        false // No auth required for refresh
      );

      // Update tokens
      if (response.data?.token) {
        tokenManager.setTokens(response.data.token, response.data.refreshToken);
      }

      return response;
    } catch (error) {
      // Clear tokens if refresh fails
      tokenManager.clearTokens();
      throw new Error(
        error instanceof Error ? error.message : "Failed to refresh token"
      );
    }
  },

  async logout(): Promise<void> {
    try {
      const token = tokenManager.getToken();
      if (token) {
        // Attempt to logout on server
        await authApiClient.post("/auth/logout", {}, true);
      }
    } catch (error) {
      // Continue with local logout even if server logout fails
      console.warn("Server logout failed:", error);
    } finally {
      // Always clear local tokens
      tokenManager.clearTokens();
    }
  },

  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Not authenticated");
      }

      return await authApiClient.get<ApiResponse<AuthUser>>("/auth/me", true);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to get current user"
      );
    }
  },

  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await authApiClient.post<ApiResponse<{ message: string }>>(
        "/auth/verify-email",
        { token },
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to verify email"
      );
    }
  },

  async resendVerificationEmail(
    email: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      return await authApiClient.post<ApiResponse<{ message: string }>>(
        "/auth/resend-verification",
        { email },
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to resend verification email"
      );
    }
  },

  // Utility functions
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  },

  getToken(): string | null {
    return tokenManager.getToken();
  },

  clearAuth(): void {
    tokenManager.clearTokens();
  },
};
