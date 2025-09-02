import type { ApiResponse, AuthAligned } from "@/types";
import { gatewayServices } from "@/lib/gatewayApi";
import { tokenManager } from "@/lib/api";

export const authService = {
  async login(
    credentials: AuthAligned.LoginCredentials
  ): Promise<ApiResponse<AuthAligned.AuthUser>> {
    try {
      console.log("AuthService.login called with:", credentials); // Debug log

      // Use Next.js API route to avoid CORS issues
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Next.js API response:", result); // Debug log

      if (!result.success) {
        throw new Error(result.message || "Login failed");
      }

      // Transform the response to match our frontend types
      const authUser: AuthAligned.AuthUser = {
        id: result.data.id,
        email: result.data.email,
        role: result.data.role as "CUSTOMER" | "SERVICE_PROVIDER" | "ADMIN",
        status: "ACTIVE" as const,
        token: result.data.token,
        refreshToken: result.data.refreshToken || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store tokens using the centralized token manager
      tokenManager.setTokens(result.data.token, result.data.refreshToken || "");

      // Return in the expected ApiResponse format
      return {
        success: true,
        data: authUser,
        message: result.message || "Login successful",
      };
    } catch (error) {
      console.error("Login error:", error); // Debug log
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  },

  async signup(
    userData: AuthAligned.SignupData
  ): Promise<ApiResponse<AuthAligned.AuthUser>> {
    console.log("authService.signup - Called with userData:", userData);
    try {
      // Use Next.js API route to avoid CORS issues
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
          role: userData.role,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Next.js API signup response:", result); // Debug log

      if (!result.success) {
        throw new Error(result.message || "Signup failed");
      }

      // Transform response to match our frontend types
      const authUser: AuthAligned.AuthUser = {
        id: result.data.id,
        email: result.data.email,
        role: result.data.role as "CUSTOMER" | "SERVICE_PROVIDER" | "ADMIN",
        status: "ACTIVE" as const,
        token: result.data.token,
        refreshToken: result.data.refreshToken || "",
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store tokens if registration includes auto-login
      tokenManager.setTokens(result.data.token, result.data.refreshToken || "");

      return {
        success: true,
        data: authUser,
        message: result.message || "Registration successful",
      };
    } catch (error) {
      console.error("Signup error:", error); // Debug log
      throw new Error(error instanceof Error ? error.message : "Signup failed");
    }
  },

  async forgotPassword(
    email: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      return await gatewayServices.auth.post<ApiResponse<{ message: string }>>(
        "/forgot-password",
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
    resetData: AuthAligned.ResetPasswordData
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      // Transform to match backend ResetPasswordDto
      const resetDto = {
        token: resetData.token,
        newPassword: resetData.password, // Backend expects 'newPassword', frontend has 'password'
      };

      return await gatewayServices.auth.post<ApiResponse<{ message: string }>>(
        "/reset-password",
        resetDto,
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

      // Note: Backend doesn't have refresh endpoint yet
      // You may need to add this to your backend controller
      const response = await gatewayServices.auth.post<
        ApiResponse<{ token: string; refreshToken: string }>
      >(
        "/refresh",
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
        // Note: Backend doesn't have logout endpoint yet
        // You may need to add this to your backend controller
        await gatewayServices.auth.post("/logout", {}, true);
      }
    } catch (error) {
      // Continue with local logout even if server logout fails
      console.warn("Server logout failed:", error);
    } finally {
      // Always clear local tokens
      tokenManager.clearTokens();
    }
  },

  // Note: Backend doesn't have /auth/me endpoint yet
  // Use validateToken() or decode JWT token for user info instead
  /*
  async getCurrentUser(): Promise<ApiResponse<AuthAligned.AuthUser>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Not authenticated");
      }

      // Note: Backend doesn't have /me endpoint yet
      // You may need to add this to your backend controller
      return await gatewayServices.auth.get<ApiResponse<AuthAligned.AuthUser>>("/me", true);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to get current user"
      );
    }
  },
  */

  // New method to validate token (matching your backend /validate endpoint)
  async validateToken(): Promise<
    ApiResponse<{
      valid: boolean;
      user: {
        userId: string;
        email: string;
        userType: string;
        role: string;
      };
    }>
  > {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Not authenticated");
      }

      // Debug: Check token before making request
      const token = tokenManager.getToken();
      console.log("validateToken - Token exists:", !!token);
      console.log(
        "validateToken - Token preview:",
        token?.substring(0, 20) + "..."
      );
      console.log("validateToken - Making request to /auth/validate");

      return await gatewayServices.auth.post<
        ApiResponse<{
          valid: boolean;
          user: {
            userId: string;
            email: string;
            userType: string;
            role: string;
          };
        }>
      >("/validate", {}, true);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to validate token"
      );
    }
  },

  // Remove resendVerificationEmail as it's not in the backend

  // Google OAuth methods (matching your backend Google OAuth endpoints)
  async googleLogin(): Promise<void> {
    // Redirect to Google OAuth
    const API_GATEWAY_BASE_URL =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8081/api";
    const googleAuthUrl = `${API_GATEWAY_BASE_URL}/auth/google`;
    window.location.href = googleAuthUrl;
  },

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      // Use Next.js API route to avoid CORS issues
      const response = await fetch("/api/auth/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenManager.getToken()}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Change password response:", result); // Debug log

      if (!result.success) {
        throw new Error(result.message || "Password change failed");
      }

      return {
        success: true,
        data: { message: result.message || "Password changed successfully" },
        message: result.message || "Password changed successfully",
      };
    } catch (error) {
      console.error("Change password error:", error); // Debug log
      throw new Error(
        error instanceof Error ? error.message : "Password change failed"
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
