/**
 * Provider Service - Backend Integration through API Gateway
 * Handles service provider related operations integrating with User microservice
 */

import { userApiClient, tokenManager } from "@/lib/api";
import type { User, ApiResponse, PaginatedResponse, Job } from "@/types";

export interface ProviderStats {
  totalEarnings: number;
  completedJobs: number;
  averageRating: number;
  activeJobs: number;
}

export interface ServiceProvider extends User {
  businessName?: string;
  businessAddress?: string;
  category?: string;
  experienceYears?: number;
  rating?: number;
  completedJobs?: number;
  activeJobs?: number;
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  services?: string[];
  availability?: Record<string, boolean | string>;
  portfolioImages?: string[];
  certifications?: string[];
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProviderProfile {
  userId: string;
  category: string;
  location: string;
  experienceYears: number;
  latitude: number;
  longitude: number;
  businessName?: string;
  bio?: string;
  services?: string[];
  hourlyRate?: number;
  availability?: Record<string, boolean | string>;
  portfolioImages?: string[];
  certifications?: string[];
}

export interface ProviderSearchParams {
  category?: string;
  location?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  minRating?: number;
  maxPrice?: number;
  availability?: string;
  services?: string[];
  page?: number;
  limit?: number;
}

export interface ProviderStats {
  totalProviders: number;
  activeProviders: number;
  averageRating: number;
  topCategories: Array<{
    category: string;
    count: number;
  }>;
}

class ProviderService {
  /**
   * Get all service providers with filtering
   */
  async getAllProviders(
    params?: ProviderSearchParams
  ): Promise<PaginatedResponse<ServiceProvider>> {
    try {
      const queryParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/providers?${queryString}` : "/providers";

      return await userApiClient.get<PaginatedResponse<ServiceProvider>>(
        endpoint,
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch providers"
      );
    }
  }

  /**
   * Get service provider by ID
   */
  async getProviderById(id: string): Promise<ApiResponse<ServiceProvider>> {
    try {
      return await userApiClient.get<ApiResponse<ServiceProvider>>(
        `/providers/${id}`,
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch provider"
      );
    }
  }

  /**
   * Get providers by category
   */
  async getProvidersByCategory(
    category: string
  ): Promise<ApiResponse<ServiceProvider[]>> {
    try {
      const endpoint = `/providers?category=${encodeURIComponent(category)}`;
      return await userApiClient.get<ApiResponse<ServiceProvider[]>>(
        endpoint,
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch providers by category"
      );
    }
  }

  /**
   * Search providers by location and radius
   */
  async searchProvidersByLocation(
    lat: number,
    lng: number,
    radius: number = 10,
    category?: string
  ): Promise<ApiResponse<ServiceProvider[]>> {
    try {
      const queryParams = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        radius: radius.toString(),
      });

      if (category) {
        queryParams.append("category", category);
      }

      const endpoint = `/providers/nearby?${queryParams.toString()}`;
      return await userApiClient.get<ApiResponse<ServiceProvider[]>>(
        endpoint,
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to search providers by location"
      );
    }
  }

  /**
   * Create service provider profile (requires authentication)
   */
  async createProviderProfile(
    profileData: ProviderProfile
  ): Promise<ApiResponse<ServiceProvider>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to create provider profile");
      }

      return await userApiClient.post<ApiResponse<ServiceProvider>>(
        "/profiles/service-providers/me",
        profileData,
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to create provider profile"
      );
    }
  }

  /**
   * Update service provider profile (requires authentication)
   */
  async updateProviderProfile(
    profileData: Partial<ProviderProfile>
  ): Promise<ApiResponse<ServiceProvider>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to update provider profile");
      }

      return await userApiClient.patch<ApiResponse<ServiceProvider>>(
        "/profiles/service-providers/me",
        profileData,
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update provider profile"
      );
    }
  }

  /**
   * Get current provider's comprehensive dashboard data (requires authentication)
   * This matches the backend endpoint: GET /users/me/dashboard
   */
  async getMyProviderDashboard(): Promise<
    ApiResponse<
      ServiceProvider & {
        jobs: Job[];
        earnings: number;
        stats: ProviderStats;
      }
    >
  > {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to fetch provider dashboard");
      }

      // This calls the backend endpoint: GET /users/me/dashboard
      // which returns role-specific dashboard data
      return await userApiClient.get<
        ApiResponse<
          ServiceProvider & {
            jobs: Job[];
            earnings: number;
            stats: ProviderStats;
          }
        >
      >("/me/dashboard", true);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch provider dashboard"
      );
    }
  }

  /**
   * Get current provider's comprehensive data (requires authentication)
   */
  async getMyProviderData(): Promise<
    ApiResponse<
      ServiceProvider & {
        jobs: Job[];
        earnings: number;
        stats: ProviderStats;
      }
    >
  > {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to fetch provider data");
      }

      return await userApiClient.get<
        ApiResponse<
          ServiceProvider & {
            jobs: Job[];
            earnings: number;
            stats: ProviderStats;
          }
        >
      >("/me/provider-data", true);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch provider data"
      );
    }
  }

  /**
   * Get provider statistics
   */
  async getProviderStats(): Promise<ApiResponse<ProviderStats>> {
    try {
      return await userApiClient.get<ApiResponse<ProviderStats>>(
        "/providers/stats",
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch provider statistics"
      );
    }
  }

  /**
   * Get provider reviews/ratings
   */
  async getProviderReviews(providerId: string): Promise<
    ApiResponse<
      Array<{
        id: string;
        rating: number;
        comment: string;
        customerName: string;
        jobTitle: string;
        createdAt: string;
      }>
    >
  > {
    try {
      return await userApiClient.get<
        ApiResponse<
          Array<{
            id: string;
            rating: number;
            comment: string;
            customerName: string;
            jobTitle: string;
            createdAt: string;
          }>
        >
      >(`/providers/${providerId}/reviews`, false);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch provider reviews"
      );
    }
  }

  /**
   * Add review for a provider (requires authentication)
   */
  async addProviderReview(
    providerId: string,
    reviewData: {
      rating: number;
      comment: string;
      jobId: string;
    }
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to add review");
      }

      return await userApiClient.post<ApiResponse<{ message: string }>>(
        `/providers/${providerId}/reviews`,
        reviewData,
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to add review"
      );
    }
  }

  /**
   * Get provider portfolio
   */
  async getProviderPortfolio(providerId: string): Promise<
    ApiResponse<
      Array<{
        id: string;
        title: string;
        description: string;
        images: string[];
        category: string;
        completedAt: string;
      }>
    >
  > {
    try {
      return await userApiClient.get<
        ApiResponse<
          Array<{
            id: string;
            title: string;
            description: string;
            images: string[];
            category: string;
            completedAt: string;
          }>
        >
      >(`/providers/${providerId}/portfolio`, false);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch provider portfolio"
      );
    }
  }

  /**
   * Update provider availability (requires authentication)
   */
  async updateAvailability(availability: {
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    saturday?: boolean;
    sunday?: boolean;
    startTime?: string;
    endTime?: string;
  }): Promise<ApiResponse<{ message: string }>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to update availability");
      }

      return await userApiClient.patch<ApiResponse<{ message: string }>>(
        "/me/availability",
        availability,
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update availability"
      );
    }
  }

  /**
   * Get featured providers
   */
  async getFeaturedProviders(): Promise<ApiResponse<ServiceProvider[]>> {
    try {
      return await userApiClient.get<ApiResponse<ServiceProvider[]>>(
        "/providers/featured",
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch featured providers"
      );
    }
  }

  /**
   * Get top-rated providers
   */
  async getTopRatedProviders(
    limit: number = 10
  ): Promise<ApiResponse<ServiceProvider[]>> {
    try {
      const endpoint = `/providers/top-rated?limit=${limit}`;
      return await userApiClient.get<ApiResponse<ServiceProvider[]>>(
        endpoint,
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch top-rated providers"
      );
    }
  }
}

export const providerService = new ProviderService();
