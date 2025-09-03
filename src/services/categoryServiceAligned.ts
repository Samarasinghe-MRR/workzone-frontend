import { gatewayServices } from "@/lib/gatewayApi";
import type { ApiResponse, CategoryAligned } from "@/types";

class CategoryService {
  // Get all categories (public endpoint)
  async getAllCategories(
    includeInactive = false
  ): Promise<CategoryAligned.CategoriesResponse> {
    const queryParams = new URLSearchParams();
    if (includeInactive) {
      queryParams.append("includeInactive", "true");
    }

    const endpoint = queryParams.toString()
      ? `/?${queryParams.toString()}`
      : "/";

    return gatewayServices.categories.get<CategoryAligned.CategoriesResponse>(
      endpoint,
      false
    );
  }

  // Get categories with hierarchy (tree structure)
  async getCategoriesTree(
    includeInactive = false
  ): Promise<CategoryAligned.CategoriesResponse> {
    const queryParams = new URLSearchParams();
    if (includeInactive) {
      queryParams.append("includeInactive", "true");
    }

    const endpoint = `/tree${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return gatewayServices.categories.get<CategoryAligned.CategoriesResponse>(
      endpoint,
      false
    );
  }

  // Get root categories only
  async getRootCategories(
    includeInactive = false
  ): Promise<CategoryAligned.CategoriesResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("parentId", "null");
    if (includeInactive) {
      queryParams.append("includeInactive", "true");
    }

    const endpoint = `/?${queryParams.toString()}`;
    return gatewayServices.categories.get<CategoryAligned.CategoriesResponse>(
      endpoint,
      false
    );
  }

  // Get subcategories of a parent category
  async getSubcategories(
    parentId: string,
    includeInactive = false
  ): Promise<CategoryAligned.CategoriesResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("parentId", parentId);
    if (includeInactive) {
      queryParams.append("includeInactive", "true");
    }

    const endpoint = `/?${queryParams.toString()}`;
    return gatewayServices.categories.get<CategoryAligned.CategoriesResponse>(
      endpoint,
      false
    );
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<CategoryAligned.CategoryResponse> {
    return gatewayServices.categories.get<CategoryAligned.CategoryResponse>(
      `/${id}`,
      false
    );
  }

  // Create category (admin only)
  async createCategory(
    categoryData: CategoryAligned.CreateServiceCategoryRequest
  ): Promise<CategoryAligned.CategoryResponse> {
    return gatewayServices.categories.post<CategoryAligned.CategoryResponse>(
      "/",
      categoryData,
      true
    );
  }

  // Update category (admin only)
  async updateCategory(
    id: string,
    categoryData: CategoryAligned.UpdateServiceCategoryRequest
  ): Promise<CategoryAligned.CategoryResponse> {
    return gatewayServices.categories.put<CategoryAligned.CategoryResponse>(
      `/${id}`,
      categoryData,
      true
    );
  }

  // Delete category (admin only)
  async deleteCategory(id: string): Promise<ApiResponse<{ message: string }>> {
    return gatewayServices.categories.delete<ApiResponse<{ message: string }>>(
      `/${id}`,
      true
    );
  }

  // Get categories with filters
  async getCategoriesWithFilters(
    filters?: CategoryAligned.CategoryFilters
  ): Promise<CategoryAligned.CategoriesResponse> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v.toString()));
          } else if (key === "parentId" && value === null) {
            queryParams.append("parentId", "null");
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/filter?${queryParams.toString()}`
      : "/filter";

    return gatewayServices.categories.get<CategoryAligned.CategoriesResponse>(
      endpoint,
      false
    );
  }

  // Search categories
  async searchCategories(
    searchTerm: string,
    filters?: CategoryAligned.CategoryFilters
  ): Promise<CategoryAligned.CategoriesResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("q", searchTerm);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v.toString()));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    return gatewayServices.categories.get<CategoryAligned.CategoriesResponse>(
      `/search?${queryParams.toString()}`,
      false
    );
  }

  // Get category statistics
  async getCategoryStatistics(
    id: string
  ): Promise<ApiResponse<CategoryAligned.CategoryStatistics>> {
    return gatewayServices.categories.get<
      ApiResponse<CategoryAligned.CategoryStatistics>
    >(`/${id}/statistics`, false);
  }

  // Get enhanced category with populated data
  async getEnhancedCategory(
    id: string
  ): Promise<ApiResponse<CategoryAligned.EnhancedServiceCategory>> {
    return gatewayServices.categories.get<
      ApiResponse<CategoryAligned.EnhancedServiceCategory>
    >(`/${id}/enhanced`, false);
  }

  // Provider-Category relationship management

  // Add provider to category (provider specialization)
  async addProviderToCategory(
    categoryProviderData: CategoryAligned.CreateCategoryProviderRequest
  ): Promise<ApiResponse<CategoryAligned.CategoryProvider>> {
    return gatewayServices.categories.post<
      ApiResponse<CategoryAligned.CategoryProvider>
    >("/providers", categoryProviderData, true);
  }

  // Update provider specialization in category
  async updateProviderCategory(
    id: string,
    updateData: CategoryAligned.UpdateCategoryProviderRequest
  ): Promise<ApiResponse<CategoryAligned.CategoryProvider>> {
    return gatewayServices.categories.put<
      ApiResponse<CategoryAligned.CategoryProvider>
    >(`/providers/${id}`, updateData, true);
  }

  // Remove provider from category
  async removeProviderFromCategory(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    return gatewayServices.categories.delete<ApiResponse<{ message: string }>>(
      `/providers/${id}`,
      true
    );
  }

  // Get providers in a category
  async getCategoryProviders(
    categoryId: string,
    filters?: CategoryAligned.ProviderCategoryFilters
  ): Promise<CategoryAligned.CategoryProvidersResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("categoryId", categoryId);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/providers?${queryParams.toString()}`;
    return gatewayServices.categories.get<CategoryAligned.CategoryProvidersResponse>(
      endpoint,
      false
    );
  }

  // Get provider's categories/specializations
  async getProviderCategories(
    providerId: string
  ): Promise<CategoryAligned.CategoryProvidersResponse> {
    return gatewayServices.categories.get<CategoryAligned.CategoryProvidersResponse>(
      `/providers/by-provider/${providerId}`,
      true
    );
  }

  // Certification management

  // Create provider certification
  async createProviderCertification(
    certificationData: CategoryAligned.CreateProviderCertificationRequest
  ): Promise<CategoryAligned.CertificationResponse> {
    return gatewayServices.categories.post<CategoryAligned.CertificationResponse>(
      "/certifications",
      certificationData,
      true
    );
  }

  // Update provider certification
  async updateProviderCertification(
    id: string,
    updateData: CategoryAligned.UpdateProviderCertificationRequest
  ): Promise<CategoryAligned.CertificationResponse> {
    return gatewayServices.categories.put<CategoryAligned.CertificationResponse>(
      `/certifications/${id}`,
      updateData,
      true
    );
  }

  // Delete provider certification
  async deleteProviderCertification(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    return gatewayServices.categories.delete<ApiResponse<{ message: string }>>(
      `/certifications/${id}`,
      true
    );
  }

  // Get provider certifications
  async getProviderCertifications(
    providerId: string
  ): Promise<CategoryAligned.CertificationsResponse> {
    return gatewayServices.categories.get<CategoryAligned.CertificationsResponse>(
      `/certifications/provider/${providerId}`,
      true
    );
  }

  // Get certifications for a category
  async getCategoryCertifications(
    categoryId: string
  ): Promise<CategoryAligned.CertificationsResponse> {
    return gatewayServices.categories.get<CategoryAligned.CertificationsResponse>(
      `/certifications/category/${categoryId}`,
      false
    );
  }

  // Verify certification (admin only)
  async verifyCertification(
    id: string,
    verificationData: { verified_by: string; verification_date?: string }
  ): Promise<CategoryAligned.CertificationResponse> {
    return gatewayServices.categories.patch<CategoryAligned.CertificationResponse>(
      `/certifications/${id}/verify`,
      verificationData,
      true
    );
  }

  // Upload certification document
  async uploadCertificationDocument(
    certificationId: string,
    file: File
  ): Promise<ApiResponse<{ documentUrl: string }>> {
    const formData = new FormData();
    formData.append("document", file);

    // For file uploads, we need to use a different approach
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/categories/certifications/${certificationId}/document`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    return response.json();
  }

  // Get category tree structure for UI
  async getCategoryTree(): Promise<
    ApiResponse<CategoryAligned.CategoryTree[]>
  > {
    return gatewayServices.categories.get<
      ApiResponse<CategoryAligned.CategoryTree[]>
    >("/tree-structure", false);
  }

  // Search categories and providers
  async searchCategoriesAndProviders(
    searchTerm: string
  ): Promise<ApiResponse<CategoryAligned.CategorySearchResult>> {
    const queryParams = new URLSearchParams();
    queryParams.append("q", searchTerm);

    return gatewayServices.categories.get<
      ApiResponse<CategoryAligned.CategorySearchResult>
    >(`/search-all?${queryParams.toString()}`, false);
  }

  // Get dashboard statistics for admin
  async getCategoryDashboardStats(): Promise<
    ApiResponse<CategoryAligned.CategoryDashboardStats>
  > {
    return gatewayServices.categories.get<
      ApiResponse<CategoryAligned.CategoryDashboardStats>
    >("/dashboard-stats", true);
  }

  // Bulk operations for admin

  // Bulk update categories
  async bulkUpdateCategories(
    categoryIds: string[],
    updateData: Partial<CategoryAligned.UpdateServiceCategoryRequest>
  ): Promise<ApiResponse<{ message: string; updated: number }>> {
    return gatewayServices.categories.patch<
      ApiResponse<{ message: string; updated: number }>
    >("/bulk-update", { categoryIds, updateData }, true);
  }

  // Bulk activate/deactivate categories
  async bulkToggleCategoryStatus(
    categoryIds: string[],
    isActive: boolean
  ): Promise<ApiResponse<{ message: string; updated: number }>> {
    return gatewayServices.categories.patch<
      ApiResponse<{ message: string; updated: number }>
    >("/bulk-toggle-status", { categoryIds, isActive }, true);
  }
}

// Export singleton instance
export const categoryService = new CategoryService();
export default categoryService;
