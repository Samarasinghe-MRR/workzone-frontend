import type {
  LoginCredentials,
  SignupData,
  ResetPasswordData,
  AuthUser,
  ApiResponse,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  },

  async signup(userData: SignupData): Promise<ApiResponse<AuthUser>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Signup failed");
    }
  },

  async forgotPassword(
    email: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      return data;
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
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Password reset failed"
      );
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
      });
    } catch (error) {
      // Handle logout error silently or show notification
      console.error("Logout error:", error);
    }
  },
};
