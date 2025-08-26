/**
 * Centralized API configuration and utilities
 * This file consolidates all API-related configurations and provides
 * a consistent interface for making HTTP requests across the application.
 */

// API Configuration
export const API_CONFIG = {
  AUTH_SERVICE: "/api", // Use Next.js API routes instead of external service
  USER_SERVICE: "/api", // Use Next.js API routes instead of external service
  MAIN_API: "/api",
} as const;

// Common headers factory
export const getAuthHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getHeaders = (includeAuth = false): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request handler with error handling
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return response.json();
  }

  async get<T>(endpoint: string, includeAuth = true): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: getHeaders(includeAuth),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    includeAuth = true
  ): Promise<T> {
    console.log("ApiClient.post called with:", { endpoint, data, includeAuth }); // Debug log
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    includeAuth = true
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    includeAuth = true
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PATCH",
      headers: getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, includeAuth = true): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(includeAuth),
    });
    return this.handleResponse<T>(response);
  }
}

// Pre-configured API clients
export const authApiClient = new ApiClient(API_CONFIG.AUTH_SERVICE);
export const userApiClient = new ApiClient(API_CONFIG.USER_SERVICE);
export const mainApiClient = new ApiClient(API_CONFIG.MAIN_API);

// Token management utilities
export const tokenManager = {
  getToken: (): string | null => localStorage.getItem("token"),
  getRefreshToken: (): string | null => localStorage.getItem("refreshToken"),
  setTokens: (token: string, refreshToken?: string): void => {
    localStorage.setItem("token", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  },
  clearTokens: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },
  isAuthenticated: (): boolean => !!localStorage.getItem("token"),
};
