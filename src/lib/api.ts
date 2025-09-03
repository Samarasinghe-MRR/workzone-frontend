/**
 * Centralized API configuration and utilities
 * This file consolidates all API-related configurations and provides
 * a consistent interface for making HTTP requests across the application.
 * Updated to route through API Gateway on port 8081
 */

// API Gateway Configuration
const API_GATEWAY_BASE_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8081/api";

// API Configuration - Now routes through API Gateway
export const API_CONFIG = {
  // API Gateway routes - these will be forwarded to respective microservices
  AUTH_SERVICE: `${API_GATEWAY_BASE_URL}/auth`,
  USER_SERVICE: `${API_GATEWAY_BASE_URL}/users`,
  JOB_SERVICE: `${API_GATEWAY_BASE_URL}/jobs`,
  QUOTATION_SERVICE: `${API_GATEWAY_BASE_URL}/quotations`,
  CATEGORY_SERVICE: `${API_GATEWAY_BASE_URL}/categories`,
  GATEWAY_HEALTH: `${API_GATEWAY_BASE_URL}/health`,
  // Legacy Next.js API routes (for gradual migration if needed)
  MAIN_API: "/api",
} as const;

// Common headers factory
export const getAuthHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${
    typeof window !== "undefined" ? localStorage.getItem("token") : ""
  }`,
});

export const getHeaders = (includeAuth = false): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth && typeof window !== "undefined") {
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

// Pre-configured API clients for microservices via API Gateway
export const authApiClient = new ApiClient(API_CONFIG.AUTH_SERVICE);
export const userApiClient = new ApiClient(API_CONFIG.USER_SERVICE);
export const jobApiClient = new ApiClient(API_CONFIG.JOB_SERVICE);
export const quotationApiClient = new ApiClient(API_CONFIG.QUOTATION_SERVICE);
export const categoryApiClient = new ApiClient(API_CONFIG.CATEGORY_SERVICE);
export const mainApiClient = new ApiClient(API_CONFIG.MAIN_API); // Legacy support

// Health check utilities
export const healthApiClient = {
  checkAllServices: async () => {
    const response = await fetch(API_CONFIG.GATEWAY_HEALTH);
    return response.json();
  },
  checkSpecificService: async (service: string) => {
    const response = await fetch(`${API_GATEWAY_BASE_URL}/health/${service}`);
    return response.json();
  },
};

// Token management utilities
export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },
  getRefreshToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refreshToken");
    }
    return null;
  },
  setTokens: (token: string, refreshToken?: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    }
  },
  clearTokens: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  },
  isAuthenticated: (): boolean => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token");
    }
    return false;
  },
};
