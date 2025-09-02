/**
 * Post Job Service - Backend Integration through API Gateway
 * Handles job posting workflow and related operations
 */

import { jobApiClient, tokenManager } from "@/lib/api";
import type { CreateJobDto, Job, ApiResponse } from "@/types";

export interface JobCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  averagePrice?: number;
  estimatedDuration?: string;
  requiredSkills?: string[];
}

export interface JobTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedBudget: number;
  requirements: string[];
  tags: string[];
}

export interface LocationSuggestion {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: "city" | "address" | "landmark";
}

export interface PostJobData extends CreateJobDto {
  urgency?: "low" | "medium" | "high" | "urgent";
  skillsRequired?: string[];
  preferredProviders?: string[];
  allowNegotiation?: boolean;
  depositRequired?: boolean;
  materialsCovered?: boolean;
  insuranceRequired?: boolean;
}

export interface JobDraft {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  budget?: number;
  priority?: string;
  requirements?: string[];
  createdAt: string;
  updatedAt: string;
}

class PostJobService {
  /**
   * Get all available job categories
   */
  async getJobCategories(): Promise<ApiResponse<JobCategory[]>> {
    try {
      return await jobApiClient.get<ApiResponse<JobCategory[]>>(
        "/categories",
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch job categories"
      );
    }
  }

  /**
   * Get job templates for a specific category
   */
  async getJobTemplates(category: string): Promise<ApiResponse<JobTemplate[]>> {
    try {
      const endpoint = `/templates?category=${encodeURIComponent(category)}`;
      return await jobApiClient.get<ApiResponse<JobTemplate[]>>(
        endpoint,
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch job templates"
      );
    }
  }

  /**
   * Search for location suggestions
   */
  async searchLocations(
    query: string
  ): Promise<ApiResponse<LocationSuggestion[]>> {
    try {
      const endpoint = `/locations/search?q=${encodeURIComponent(query)}`;
      return await jobApiClient.get<ApiResponse<LocationSuggestion[]>>(
        endpoint,
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to search locations"
      );
    }
  }

  /**
   * Get estimated budget for a job category and location
   */
  async getEstimatedBudget(
    category: string,
    location?: string,
    complexity?: "simple" | "medium" | "complex"
  ): Promise<
    ApiResponse<{
      minimum: number;
      maximum: number;
      average: number;
      currency: string;
    }>
  > {
    try {
      const queryParams = new URLSearchParams({ category });
      if (location) queryParams.append("location", location);
      if (complexity) queryParams.append("complexity", complexity);

      const endpoint = `/estimate-budget?${queryParams.toString()}`;
      return await jobApiClient.get<
        ApiResponse<{
          minimum: number;
          maximum: number;
          average: number;
          currency: string;
        }>
      >(endpoint, false);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to get budget estimate"
      );
    }
  }

  /**
   * Create a new job posting (requires authentication)
   */
  async postJob(jobData: PostJobData): Promise<ApiResponse<Job>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to post a job");
      }

      // Transform frontend data to backend format if needed
      const backendJobData: CreateJobDto = {
        title: jobData.title,
        description: jobData.description,
        category: jobData.category,
        location: jobData.location,
        budget: jobData.budget,
        priority: jobData.priority || "MEDIUM",
        requirements: jobData.requirements,
        estimatedDuration: jobData.estimatedDuration,
        images: jobData.images,
        coordinates: jobData.coordinates,
      };

      return await jobApiClient.post<ApiResponse<Job>>(
        "/",
        backendJobData,
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to post job"
      );
    }
  }

  /**
   * Save job as draft (requires authentication)
   */
  async saveDraft(
    draftData: Partial<PostJobData>
  ): Promise<ApiResponse<JobDraft>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to save draft");
      }

      return await jobApiClient.post<ApiResponse<JobDraft>>(
        "/drafts",
        draftData,
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to save draft"
      );
    }
  }

  /**
   * Get user's job drafts (requires authentication)
   */
  async getDrafts(): Promise<ApiResponse<JobDraft[]>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to fetch drafts");
      }

      return await jobApiClient.get<ApiResponse<JobDraft[]>>("/drafts", true);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch drafts"
      );
    }
  }

  /**
   * Update a job draft (requires authentication)
   */
  async updateDraft(
    draftId: string,
    draftData: Partial<PostJobData>
  ): Promise<ApiResponse<JobDraft>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to update draft");
      }

      return await jobApiClient.patch<ApiResponse<JobDraft>>(
        `/drafts/${draftId}`,
        draftData,
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update draft"
      );
    }
  }

  /**
   * Delete a job draft (requires authentication)
   */
  async deleteDraft(
    draftId: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to delete draft");
      }

      return await jobApiClient.delete<ApiResponse<{ message: string }>>(
        `/drafts/${draftId}`,
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete draft"
      );
    }
  }

  /**
   * Publish a draft as a job (requires authentication)
   */
  async publishDraft(draftId: string): Promise<ApiResponse<Job>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to publish draft");
      }

      return await jobApiClient.post<ApiResponse<Job>>(
        `/drafts/${draftId}/publish`,
        {},
        true
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to publish draft"
      );
    }
  }

  /**
   * Upload images for job posting (requires authentication)
   */
  async uploadJobImages(
    files: File[]
  ): Promise<ApiResponse<{ urls: string[] }>> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("Authentication required to upload images");
      }

      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`images`, file);
      });

      const response = await fetch(`${jobApiClient["baseUrl"]}/upload/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenManager.getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to upload images"
      );
    }
  }

  /**
   * Get popular job categories
   */
  async getPopularCategories(): Promise<
    ApiResponse<
      Array<{
        category: string;
        count: number;
        averageBudget: number;
      }>
    >
  > {
    try {
      return await jobApiClient.get<
        ApiResponse<
          Array<{
            category: string;
            count: number;
            averageBudget: number;
          }>
        >
      >("/categories/popular", false);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch popular categories"
      );
    }
  }

  /**
   * Validate job data before posting
   */
  async validateJobData(jobData: PostJobData): Promise<
    ApiResponse<{
      isValid: boolean;
      errors: string[];
      warnings: string[];
    }>
  > {
    try {
      return await jobApiClient.post<
        ApiResponse<{
          isValid: boolean;
          errors: string[];
          warnings: string[];
        }>
      >("/validate", jobData, false);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to validate job data"
      );
    }
  }

  /**
   * Get suggested providers for a job
   */
  async getSuggestedProviders(jobData: Partial<PostJobData>): Promise<
    ApiResponse<
      Array<{
        id: string;
        name: string;
        rating: number;
        completedJobs: number;
        distance?: number;
        estimatedCost?: number;
      }>
    >
  > {
    try {
      return await jobApiClient.post<
        ApiResponse<
          Array<{
            id: string;
            name: string;
            rating: number;
            completedJobs: number;
            distance?: number;
            estimatedCost?: number;
          }>
        >
      >("/suggest-providers", jobData, false);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to get suggested providers"
      );
    }
  }
}

export const postJobService = new PostJobService();
