import type {
  GetServiceProvidersParams,
  ServiceProvidersResponse,
  ServiceProvider,
} from "@/types/serviceProviders";

const API_BASE_URL = "/api"; // Use Next.js API routes

interface ServiceProviderDetailsResponse {
  success: boolean;
  data: ServiceProvider | null;
  message: string;
}

class ServiceProvidersService {
  private getHeaders(): HeadersInit {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async getServiceProviders(
    params?: GetServiceProvidersParams
  ): Promise<ServiceProvidersResponse> {
    try {
      // Build query string
      const queryParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/service-providers${
        queryString ? `?${queryString}` : ""
      }`;

      console.log("Fetching service providers from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to fetch service providers"
        );
      }

      const result = await response.json();

      // Check if the API response has the expected format
      if (result.success && result.data) {
        return {
          success: true,
          data: result.data,
          message: result.message || "Service providers fetched successfully",
        };
      } else {
        throw new Error(result.message || "Failed to fetch service providers");
      }
    } catch (error) {
      console.error(
        "ServiceProvidersService.getServiceProviders error:",
        error
      );

      // Return error response format that matches expected type
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch service providers",
        data: null,
      };
    }
  }

  async getServiceProviderById(
    id: string
  ): Promise<ServiceProviderDetailsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/service-providers/${id}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to fetch service provider details"
        );
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        message:
          result.message || "Service provider details fetched successfully",
      };
    } catch (error) {
      console.error(
        "ServiceProvidersService.getServiceProviderById error:",
        error
      );
      return {
        success: false,
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch service provider details",
      };
    }
  }

  async searchServiceProviders(
    searchTerm: string,
    filters?: Partial<GetServiceProvidersParams>
  ): Promise<ServiceProvidersResponse> {
    return this.getServiceProviders({
      search: searchTerm,
      ...filters,
    });
  }

  async getServiceProvidersByCategory(
    category: string,
    filters?: Partial<GetServiceProvidersParams>
  ): Promise<ServiceProvidersResponse> {
    return this.getServiceProviders({
      category,
      ...filters,
    });
  }

  async getNearbyServiceProviders(
    latitude: number,
    longitude: number,
    radius: number = 25,
    filters?: Partial<GetServiceProvidersParams>
  ): Promise<ServiceProvidersResponse> {
    return this.getServiceProviders({
      latitude,
      longitude,
      radius,
      ...filters,
    });
  }
}

// Export singleton instance
export const serviceProvidersService = new ServiceProvidersService();
export default serviceProvidersService;
