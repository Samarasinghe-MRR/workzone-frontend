import type { Service, ApiResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const homeService = {
  async getServices(): Promise<ApiResponse<Service[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/services`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch services");
      }

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch services"
      );
    }
  },

  async getServiceById(id: string): Promise<ApiResponse<Service>> {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch service");
      }

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch service"
      );
    }
  },

  async getServicesByCategory(
    category: string
  ): Promise<ApiResponse<Service[]>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/services?category=${encodeURIComponent(category)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch services");
      }

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch services"
      );
    }
  },
};
