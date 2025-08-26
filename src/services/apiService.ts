/**
 * General API Service
 * This service provides common API utilities and generic endpoints
 * that are used across different features of the application.
 */

import type { ApiResponse } from "@/types";

const API_BASE_URL = "/api";

// Generic HTTP client
class APIService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // Authentication methods
  async login<T>(credentials: { email: string; password: string }): Promise<T> {
    return this.request<T>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async signup<T>(userData: unknown): Promise<T> {
    return this.request<T>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout<T>(): Promise<T> {
    return this.request<T>("/auth/logout", {
      method: "POST",
    });
  }

  // File upload utility
  async uploadFile<T>(
    endpoint: string,
    file: File,
    fieldName: string = "file"
  ): Promise<T> {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append(fieldName, file);

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Upload failed! status: ${response.status}`
      );
    }

    return await response.json();
  }
}

// Create a default instance
export const apiService = new APIService();

// Health check endpoint
export const healthCheck = async (): Promise<ApiResponse<{ status: string }>> => {
  try {
    return await apiService.get<ApiResponse<{ status: string }>>("/health");
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Health check failed"
    );
  }
};

// Generic search functionality
export const search = async <T>(
  endpoint: string,
  query: string,
  filters?: Record<string, unknown>
): Promise<ApiResponse<T[]>> => {
  try {
    const params = new URLSearchParams({
      q: query,
      ...(filters && Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [key, String(value)])
      )),
    });

    return await apiService.get<ApiResponse<T[]>>(
      `${endpoint}?${params.toString()}`
    );
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Search failed"
    );
  }
};

// Export the APIService class for custom instances
export { APIService };
export default apiService;
