import type {
  UpdateServiceProviderProfileDto,
  ServiceProviderProfileResponse,
} from "@/types/serviceProvider";

const API_BASE_URL = "/api"; // Use Next.js API routes

class ServiceProviderProfileService {
  private getHeaders(): HeadersInit {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    console.log("ServiceProviderProfileService - Token exists:", !!token);
    console.log(
      "ServiceProviderProfileService - Token (first 20 chars):",
      token?.substring(0, 20) + "..."
    );

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async getProfile(): Promise<ServiceProviderProfileResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/me/service-provider-profile`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to fetch service provider profile"
        );
      }

      const result = await response.json();

      // Check if the API response has the expected format
      if (result.success && result.data) {
        return {
          success: true,
          data: result.data,
          message: result.message || "Profile fetched successfully",
        };
      } else {
        throw new Error(result.message || "Service provider profile not found");
      }
    } catch (error) {
      console.error("ServiceProviderProfileService.getProfile error:", error);

      // Return error response format that matches expected type
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch profile",
        data: null,
      };
    }
  }

  async updateProfile(
    profileData: UpdateServiceProviderProfileDto
  ): Promise<ServiceProviderProfileResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/me/service-provider-profile`,
        {
          method: "PATCH",
          headers: this.getHeaders(),
          body: JSON.stringify(profileData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to update service provider profile"
        );
      }

      const result = await response.json();

      // Check if the API response has the expected format
      if (result.success && result.data) {
        return {
          success: true,
          data: result.data,
          message: result.message || "Profile updated successfully",
        };
      } else {
        throw new Error(
          result.message || "Failed to update service provider profile"
        );
      }
    } catch (error) {
      console.error(
        "ServiceProviderProfileService.updateProfile error:",
        error
      );

      // Return error response format that matches expected type
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update profile",
        data: null,
      };
    }
  }

  async uploadPortfolioImage(
    file: File
  ): Promise<{ success: boolean; imageUrl: string; message: string }> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";
      const response = await fetch(
        `${API_BASE_URL}/users/me/service-provider-profile/portfolio`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to upload portfolio image"
        );
      }

      return await response.json();
    } catch (error) {
      console.error(
        "ServiceProviderProfileService.uploadPortfolioImage error:",
        error
      );
      throw new Error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    }
  }

  async removePortfolioImage(
    imageUrl: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/me/service-provider-profile/portfolio`,
        {
          method: "DELETE",
          headers: this.getHeaders(),
          body: JSON.stringify({ imageUrl }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to remove portfolio image"
        );
      }

      return await response.json();
    } catch (error) {
      console.error(
        "ServiceProviderProfileService.removePortfolioImage error:",
        error
      );
      throw new Error(
        error instanceof Error ? error.message : "Failed to remove image"
      );
    }
  }
}

export const serviceProviderProfileService =
  new ServiceProviderProfileService();
