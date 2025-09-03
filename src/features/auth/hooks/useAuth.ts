import { useState, useEffect } from "react";
import { User } from "@/types";
import { authService } from "@/features/auth/services/authService";
import { userService } from "@/features/user/services/userService";

// Fixed Auth hook - removed the getCurrentUser call that was causing 404s
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Skip getCurrentUser since /auth/me doesn't exist - use token decode instead
          const token = authService.getToken();
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split(".")[1]));
              const userId = payload.sub || payload.userId;
              const userRole = payload.role;

              if (userId) {
                // Try to get user details from user service
                try {
                  const response = await userService.getUserById(userId);
                  if (response.data) {
                    // Ensure required fields are present
                    setUser({
                      ...response.data,
                      name: response.data.name || response.data.email || "",
                      email: response.data.email || "",
                      status:
                        String(response.data.status) === "ACTIVE"
                          ? ("Active" as const)
                          : ("Inactive" as const),
                      role:
                        String(response.data.role) === "CUSTOMER"
                          ? ("customer" as const)
                          : String(response.data.role) === "SERVICE_PROVIDER"
                          ? ("provider" as const)
                          : String(response.data.role) === "ADMIN"
                          ? ("admin" as const)
                          : ("customer" as const),
                    });
                  }
                } catch (userError) {
                  console.error("Failed to get user details:", userError);
                  // Fallback to token data if user service fails
                  setUser({
                    id: userId,
                    email: payload.email || "",
                    name: payload.email || "User",
                    status: "Active" as const,
                    role:
                      userRole === "CUSTOMER"
                        ? ("customer" as const)
                        : userRole === "SERVICE_PROVIDER"
                        ? ("provider" as const)
                        : userRole === "ADMIN"
                        ? ("admin" as const)
                        : ("customer" as const),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  });
                }
              }
            } catch (decodeError) {
              console.error("Token decode error:", decodeError);
              authService.clearAuth();
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
        const userData = response.data;
        setUser({
          id: userData.id,
          email: userData.email || "",
          name: userData.name || userData.email || "",
          status:
            String(userData.status) === "ACTIVE"
              ? ("Active" as const)
              : ("Inactive" as const),
          role:
            String(userData.role) === "CUSTOMER"
              ? ("customer" as const)
              : String(userData.role) === "SERVICE_PROVIDER"
              ? ("provider" as const)
              : String(userData.role) === "ADMIN"
              ? ("admin" as const)
              : ("customer" as const),
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        });
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
        // Token was refreshed, decode new token
        const token = authService.getToken();
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const userId = payload.sub || payload.userId;

          if (userId) {
            const userResponse = await userService.getUserById(userId);
            if (userResponse.data) {
              setUser({
                ...userResponse.data,
                name: userResponse.data.name || userResponse.data.email || "",
                email: userResponse.data.email || "",
                status:
                  String(userResponse.data.status) === "ACTIVE"
                    ? ("Active" as const)
                    : ("Inactive" as const),
                role:
                  String(userResponse.data.role) === "CUSTOMER"
                    ? ("customer" as const)
                    : String(userResponse.data.role) === "SERVICE_PROVIDER"
                    ? ("provider" as const)
                    : String(userResponse.data.role) === "ADMIN"
                    ? ("admin" as const)
                    : ("customer" as const),
              });
            }
          }
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
