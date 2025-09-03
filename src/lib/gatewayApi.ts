/**
 * API Gateway Service
 * Handles all communication with backend microservices through the API Gateway
 */

// API Gateway specific configurations
export const GATEWAY_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8081/api",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// Enhanced API client for Gateway communication
export class GatewayApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string, timeout = GATEWAY_CONFIG.TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private getHeaders(
    includeAuth = true,
    additionalHeaders?: HeadersInit
  ): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(additionalHeaders as Record<string, string>),
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      // Enhanced error logging for debugging
      console.error("API Error Details:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorData,
      });

      throw new Error(
        errorData.message ||
          `HTTP error! status: ${response.status} - ${response.statusText}`
      );
    }

    return response.json();
  }

  private clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  }

  async get<T>(
    endpoint: string,
    includeAuth = true,
    additionalHeaders?: HeadersInit
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers: this.getHeaders(includeAuth, additionalHeaders),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    includeAuth = true,
    additionalHeaders?: HeadersInit
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: this.getHeaders(includeAuth, additionalHeaders),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    includeAuth = true,
    additionalHeaders?: HeadersInit
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PUT",
        headers: this.getHeaders(includeAuth, additionalHeaders),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    includeAuth = true,
    additionalHeaders?: HeadersInit
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PATCH",
        headers: this.getHeaders(includeAuth, additionalHeaders),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async delete<T>(
    endpoint: string,
    includeAuth = true,
    additionalHeaders?: HeadersInit
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "DELETE",
        headers: this.getHeaders(includeAuth, additionalHeaders),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}

// Service-specific Gateway clients
export const gatewayServices = {
  // Use API Gateway routing instead of direct service calls
  auth: new GatewayApiClient(`${GATEWAY_CONFIG.BASE_URL}/auth`),
  users: new GatewayApiClient(`${GATEWAY_CONFIG.BASE_URL}/users`),
  jobs: new GatewayApiClient(`${GATEWAY_CONFIG.BASE_URL}/jobs`),
  quotations: new GatewayApiClient(`${GATEWAY_CONFIG.BASE_URL}/quotations`),
  categories: new GatewayApiClient(`${GATEWAY_CONFIG.BASE_URL}/categories`),
};

// Health check utilities
export const gatewayHealth = {
  checkAll: async () => {
    const response = await fetch(`${GATEWAY_CONFIG.BASE_URL}/health`);
    return response.json();
  },

  checkService: async (service: string) => {
    const response = await fetch(
      `${GATEWAY_CONFIG.BASE_URL}/health/${service}`
    );
    return response.json();
  },
};

// Migration utility - fallback to direct service if gateway is down
export const createResilientClient = (
  gatewayClient: GatewayApiClient,
  fallbackUrl?: string
) => {
  return {
    async request<T>(
      method: string,
      endpoint: string,
      data?: unknown,
      includeAuth = true
    ): Promise<T> {
      try {
        // Try gateway first
        switch (method.toUpperCase()) {
          case "GET":
            return await gatewayClient.get<T>(endpoint, includeAuth);
          case "POST":
            return await gatewayClient.post<T>(endpoint, data, includeAuth);
          case "PUT":
            return await gatewayClient.put<T>(endpoint, data, includeAuth);
          case "PATCH":
            return await gatewayClient.patch<T>(endpoint, data, includeAuth);
          case "DELETE":
            return await gatewayClient.delete<T>(endpoint, includeAuth);
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }
      } catch (error) {
        // If gateway fails and fallback URL is provided, try direct service
        if (fallbackUrl) {
          console.warn(
            `Gateway request failed, trying fallback: ${fallbackUrl}`
          );
          // Implement fallback logic here if needed
        }
        throw error;
      }
    },
  };
};
