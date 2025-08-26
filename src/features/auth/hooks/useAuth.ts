import { useState, useEffect } from "react";
import { User } from "@/types";
import { authService } from "@/features/auth/services/authService";
import { userService } from "@/features/user/services/userService";

// Auth hook integrated with backend
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Try to get current user from auth service first
          try {
            const response = await authService.getCurrentUser();
            if (response.data) {
              // Extract User data from AuthUser
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { token, refreshToken, ...userData } = response.data;
              setUser(userData);
            }
          } catch {
            // Fallback to token decode method
            const token = authService.getToken();
            if (token) {
              try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const userId = payload.sub || payload.userId;

                if (userId) {
                  // Fetch user data from backend
                  const response = await userService.getUserById(userId);
                  if (response.data) {
                    setUser(response.data);
                  }
                }
              } catch (decodeError) {
                console.error("Token decode error:", decodeError);
                authService.clearAuth();
              }
            }
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        authService.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      if (response.data) {
        // Extract User data from AuthUser
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { token, refreshToken, ...userData } = response.data;
        setUser(userData);
      }
      return response;
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const refreshAuth = async () => {
    try {
      const response = await authService.refreshToken();
      if (response.data) {
        // Token was refreshed, get current user
        const userResponse = await authService.getCurrentUser();
        if (userResponse.data) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { token, refreshToken, ...userData } = userResponse.data;
          setUser(userData);
        }
      }
      return response;
    } catch (error) {
      // Refresh failed, clear auth
      authService.clearAuth();
      setUser(null);
      throw error;
    }
  };

  return {
    user,
    isLoading,
    login,
    logout,
    updateUser,
    refreshAuth,
    isAuthenticated: authService.isAuthenticated(),
  };
}
