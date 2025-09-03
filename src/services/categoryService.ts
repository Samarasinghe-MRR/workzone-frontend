import { gatewayServices } from "@/lib/gatewayApi";
import type { ApiResponse } from "@/types";

interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
  jobCount?: number;
}

interface CreateCategoryData {
  name: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
  sortOrder?: number;
}

interface UpdateCategoryData {
  name?: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
  sortOrder?: number;
}

class CategoryService {
  // Get all categories (public endpoint)
  async getAllCategories(
    includeInactive = false
  ): Promise<ApiResponse<Category[]>> {
    const queryParams = new URLSearchParams();
    if (includeInactive) {
      queryParams.append("includeInactive", "true");
    }

    const endpoint = queryParams.toString()
      ? `/?${queryParams.toString()}`
      : "/";

    return gatewayServices.categories.get<ApiResponse<Category[]>>(
      endpoint,
      false
    );
  }

  // Get categories with hierarchy (tree structure)
  async getCategoriesTree(
    includeInactive = false
  ): Promise<ApiResponse<Category[]>> {
    const queryParams = new URLSearchParams();
    if (includeInactive) {
      queryParams.append("includeInactive", "true");
    }

    const endpoint = queryParams.toString()
      ? `/tree?${queryParams.toString()}`
      : "/tree";

    return gatewayServices.categories.get<ApiResponse<Category[]>>(
      endpoint,
      false
    );
  }

  // Get category by ID
  async getCategoryById(categoryId: string): Promise<ApiResponse<Category>> {
    return gatewayServices.categories.get<ApiResponse<Category>>(
      `/${categoryId}`,
      false
    );
  }

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    return gatewayServices.categories.get<ApiResponse<Category>>(
      `/slug/${slug}`,
      false
    );
  }

  // Search categories
  async searchCategories(query: string): Promise<ApiResponse<Category[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append("q", query);

    return gatewayServices.categories.get<ApiResponse<Category[]>>(
      `/search?${queryParams.toString()}`,
      false
    );
  }

  // Get popular categories (based on job count)
  async getPopularCategories(limit = 10): Promise<ApiResponse<Category[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append("limit", limit.toString());

    return gatewayServices.categories.get<ApiResponse<Category[]>>(
      `/popular?${queryParams.toString()}`,
      false
    );
  }

  // Admin endpoints (require authentication)

  // Create category (admin only)
  async createCategory(
    categoryData: CreateCategoryData
  ): Promise<ApiResponse<Category>> {
    return gatewayServices.categories.post<ApiResponse<Category>>(
      "/",
      categoryData,
      true
    );
  }

  // Update category (admin only)
  async updateCategory(
    categoryId: string,
    updateData: UpdateCategoryData
  ): Promise<ApiResponse<Category>> {
    return gatewayServices.categories.put<ApiResponse<Category>>(
      `/${categoryId}`,
      updateData,
      true
    );
  }

  // Delete category (admin only)
  async deleteCategory(
    categoryId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return gatewayServices.categories.delete<ApiResponse<{ message: string }>>(
      `/${categoryId}`,
      true
    );
  }

  // Activate category (admin only)
  async activateCategory(categoryId: string): Promise<ApiResponse<Category>> {
    return gatewayServices.categories.patch<ApiResponse<Category>>(
      `/${categoryId}/activate`,
      {},
      true
    );
  }

  // Deactivate category (admin only)
  async deactivateCategory(categoryId: string): Promise<ApiResponse<Category>> {
    return gatewayServices.categories.patch<ApiResponse<Category>>(
      `/${categoryId}/deactivate`,
      {},
      true
    );
  }

  // Reorder categories (admin only)
  async reorderCategories(
    categoryOrders: { categoryId: string; sortOrder: number }[]
  ): Promise<ApiResponse<{ message: string }>> {
    return gatewayServices.categories.post<ApiResponse<{ message: string }>>(
      "/reorder",
      { categoryOrders },
      true
    );
  }

  // Get category statistics (admin only)
  async getCategoryStats(): Promise<
    ApiResponse<{
      totalCategories: number;
      activeCategories: number;
      inactiveCategories: number;
      categoriesWithJobs: number;
      topCategoriesByJobs: Array<{
        category: Category;
        jobCount: number;
      }>;
    }>
  > {
    return gatewayServices.categories.get<
      ApiResponse<{
        totalCategories: number;
        activeCategories: number;
        inactiveCategories: number;
        categoriesWithJobs: number;
        topCategoriesByJobs: Array<{
          category: Category;
          jobCount: number;
        }>;
      }>
    >("/stats", true);
  }

  // Bulk import categories (admin only)
  async bulkImportCategories(categories: CreateCategoryData[]): Promise<
    ApiResponse<{
      imported: number;
      skipped: number;
      errors: string[];
    }>
  > {
    return gatewayServices.categories.post<
      ApiResponse<{
        imported: number;
        skipped: number;
        errors: string[];
      }>
    >("/bulk-import", { categories }, true);
  }

  // Export categories (admin only)
  async exportCategories(format: "json" | "csv" = "json"): Promise<Blob> {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/categories/export?format=${format}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to export categories");
    }

    return response.blob();
  }

  // Get subcategories of a category
  async getSubcategories(
    parentId: string,
    includeInactive = false
  ): Promise<ApiResponse<Category[]>> {
    const queryParams = new URLSearchParams();
    if (includeInactive) {
      queryParams.append("includeInactive", "true");
    }

    const endpoint = queryParams.toString()
      ? `/${parentId}/subcategories?${queryParams.toString()}`
      : `/${parentId}/subcategories`;

    return gatewayServices.categories.get<ApiResponse<Category[]>>(
      endpoint,
      false
    );
  }

  // Get category breadcrumb path
  async getCategoryPath(categoryId: string): Promise<ApiResponse<Category[]>> {
    return gatewayServices.categories.get<ApiResponse<Category[]>>(
      `/${categoryId}/path`,
      false
    );
  }

  // Check if category can be deleted (has no jobs or subcategories)
  async canDeleteCategory(categoryId: string): Promise<
    ApiResponse<{
      canDelete: boolean;
      reason?: string;
      jobCount?: number;
      subcategoryCount?: number;
    }>
  > {
    return gatewayServices.categories.get<
      ApiResponse<{
        canDelete: boolean;
        reason?: string;
        jobCount?: number;
        subcategoryCount?: number;
      }>
    >(`/${categoryId}/can-delete`, true);
  }
}

// Export singleton instance
export const categoryService = new CategoryService();
export default categoryService;
