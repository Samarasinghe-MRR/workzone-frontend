/**
 * Updated Category types aligned with Category Service Prisma Schema
 */

// Service Category aligned with schema
export interface ServiceCategory {
  id: string;
  name: string; // Category name (e.g., "Plumbing", "Electrical")
  description?: string; // Detailed description of the category
  icon?: string; // Icon name or URL for UI representation
  color?: string; // Category color code for UI (#hexcode)
  keywords: string[]; // Search keywords (array in Prisma, JSON column)
  parent_id?: string; // For hierarchical categories (subcategories)
  sort_order: number; // Display order
  is_active: boolean; // Category availability status
  created_at: string;
  updated_at: string;

  // Relations
  parent?: ServiceCategory; // Parent category for subcategories
  subcategories?: ServiceCategory[]; // Child categories
  providers?: CategoryProvider[]; // Providers specialized in this category

  // Computed fields for UI
  level?: number; // Hierarchy level (0 = root, 1 = subcategory, etc.)
  fullPath?: string; // Full category path (e.g., "Home Repair > Plumbing")
  providerCount?: number; // Number of providers in this category
  jobCount?: number; // Number of jobs in this category

  // UI compatibility aliases
  parentId?: string; // Alias for parent_id
  sortOrder?: number; // Alias for sort_order
  isActive?: boolean; // Alias for is_active
  createdAt?: string; // Alias for created_at
  updatedAt?: string; // Alias for updated_at
}

// Category Provider (many-to-many relationship) aligned with schema
export interface CategoryProvider {
  id: string;
  category_id: string; // Foreign key to ServiceCategory
  provider_id: string; // Foreign key to Provider (from User service)
  provider_email: string; // Provider email for quick access
  experience_years?: number; // Years of experience in this category
  hourly_rate?: number; // Provider's rate for this category
  max_distance_km?: number; // Maximum service distance for this category
  is_primary: boolean; // Is this the provider's primary specialization
  certification?: string; // Professional certification/license
  certification_verified: boolean; // Whether certification is verified
  available: boolean; // Currently accepting jobs in this category
  created_at: string;
  updated_at: string;

  // Relations
  category?: ServiceCategory;

  // UI compatibility aliases
  categoryId?: string; // Alias for category_id
  providerId?: string; // Alias for provider_id
  providerEmail?: string; // Alias for provider_email
  experienceYears?: number; // Alias for experience_years
  hourlyRate?: number; // Alias for hourly_rate
  maxDistanceKm?: number; // Alias for max_distance_km
  isPrimary?: boolean; // Alias for is_primary
  certificationVerified?: boolean; // Alias for certification_verified
  createdAt?: string; // Alias for created_at
  updatedAt?: string; // Alias for updated_at
}

// Category Statistics aligned with schema
export interface CategoryStatistics {
  id: string;
  category_id: string;

  // Provider metrics
  total_providers: number; // Total providers in this category
  active_providers: number; // Currently available providers
  verified_providers: number; // Providers with verified certifications

  // Job metrics
  total_jobs: number; // Total jobs posted in this category
  active_jobs: number; // Currently open jobs
  completed_jobs: number; // Successfully completed jobs

  // Financial metrics
  average_hourly_rate?: number; // Average rate for this category
  total_value?: number; // Total value of jobs in this category

  // Performance metrics
  average_completion_time?: number; // Average job completion time (hours)
  average_rating?: number; // Average provider rating in this category
  success_rate?: number; // Percentage of jobs completed successfully

  // Time-based metrics
  last_job_posted?: string; // When was the last job posted
  last_provider_joined?: string; // When did a provider last join this category

  created_at: string;
  updated_at: string;

  // UI compatibility aliases
  categoryId?: string; // Alias for category_id
  totalProviders?: number; // Alias for total_providers
  activeProviders?: number; // Alias for active_providers
  verifiedProviders?: number; // Alias for verified_providers
  totalJobs?: number; // Alias for total_jobs
  activeJobs?: number; // Alias for active_jobs
  completedJobs?: number; // Alias for completed_jobs
  averageHourlyRate?: number; // Alias for average_hourly_rate
  totalValue?: number; // Alias for total_value
  averageCompletionTime?: number; // Alias for average_completion_time
  averageRating?: number; // Alias for average_rating
  successRate?: number; // Alias for success_rate
  lastJobPosted?: string; // Alias for last_job_posted
  lastProviderJoined?: string; // Alias for last_provider_joined
  createdAt?: string; // Alias for created_at
  updatedAt?: string; // Alias for updated_at
}

// Provider Certification aligned with schema
export interface ProviderCertification {
  id: string;
  provider_id: string;
  category_id: string;
  certification_name: string; // Name of certification/license
  certification_number?: string; // Certificate/license number
  issuing_authority: string; // Who issued the certification
  issue_date: string;
  expiry_date?: string; // When certification expires
  is_verified: boolean; // Admin verification status
  verification_date?: string; // When it was verified
  verified_by?: string; // Admin who verified it
  document_url?: string; // URL to uploaded certificate document
  created_at: string;
  updated_at: string;

  // Relations
  category?: ServiceCategory;

  // Computed fields
  isExpired?: boolean; // Whether certification is expired
  daysUntilExpiry?: number; // Days until expiration

  // UI compatibility aliases
  providerId?: string; // Alias for provider_id
  categoryId?: string; // Alias for category_id
  certificationName?: string; // Alias for certification_name
  certificationNumber?: string; // Alias for certification_number
  issuingAuthority?: string; // Alias for issuing_authority
  issueDate?: string; // Alias for issue_date
  expiryDate?: string; // Alias for expiry_date
  isVerified?: boolean; // Alias for is_verified
  verificationDate?: string; // Alias for verification_date
  verifiedBy?: string; // Alias for verified_by
  documentUrl?: string; // Alias for document_url
  createdAt?: string; // Alias for created_at
  updatedAt?: string; // Alias for updated_at
}

// DTOs for API requests
export interface CreateServiceCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  keywords?: string[];
  parent_id?: string;
  sort_order?: number;
  is_active?: boolean;

  // UI compatibility aliases
  parentId?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateServiceCategoryRequest {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  keywords?: string[];
  parent_id?: string;
  sort_order?: number;
  is_active?: boolean;

  // UI compatibility aliases
  parentId?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateCategoryProviderRequest {
  category_id: string;
  provider_id: string;
  experience_years?: number;
  hourly_rate?: number;
  max_distance_km?: number;
  is_primary?: boolean;
  certification?: string;
  certification_verified?: boolean;
  available?: boolean;

  // UI compatibility aliases
  categoryId?: string;
  providerId?: string;
  experienceYears?: number;
  hourlyRate?: number;
  maxDistanceKm?: number;
  isPrimary?: boolean;
  certificationVerified?: boolean;
}

export interface UpdateCategoryProviderRequest {
  experience_years?: number;
  hourly_rate?: number;
  max_distance_km?: number;
  is_primary?: boolean;
  certification?: string;
  certification_verified?: boolean;
  available?: boolean;

  // UI compatibility aliases
  experienceYears?: number;
  hourlyRate?: number;
  maxDistanceKm?: number;
  isPrimary?: boolean;
  certificationVerified?: boolean;
}

export interface CreateProviderCertificationRequest {
  provider_id: string;
  category_id: string;
  certification_name: string;
  certification_number?: string;
  issuing_authority: string;
  issue_date: string;
  expiry_date?: string;
  document_url?: string;

  // UI compatibility aliases
  providerId?: string;
  categoryId?: string;
  certificationName?: string;
  certificationNumber?: string;
  issuingAuthority?: string;
  issueDate?: string;
  expiryDate?: string;
  documentUrl?: string;
}

export interface UpdateProviderCertificationRequest {
  certification_name?: string;
  certification_number?: string;
  issuing_authority?: string;
  issue_date?: string;
  expiry_date?: string;
  is_verified?: boolean;
  verification_date?: string;
  verified_by?: string;
  document_url?: string;

  // UI compatibility aliases
  certificationName?: string;
  certificationNumber?: string;
  issuingAuthority?: string;
  issueDate?: string;
  expiryDate?: string;
  isVerified?: boolean;
  verificationDate?: string;
  verifiedBy?: string;
  documentUrl?: string;
}

// Category Filters
export interface CategoryFilters {
  parent_id?: string | null; // null for root categories, string for subcategories
  is_active?: boolean;
  keywords?: string[];
  has_providers?: boolean; // Only categories with providers
  has_active_jobs?: boolean; // Only categories with active jobs
  provider_id?: string; // Categories a specific provider is in

  // UI compatibility aliases
  parentId?: string | null;
  isActive?: boolean;
  hasProviders?: boolean;
  hasActiveJobs?: boolean;
  providerId?: string;
}

export interface ProviderCategoryFilters {
  category_id?: string;
  provider_id?: string;
  is_primary?: boolean;
  available?: boolean;
  certification_verified?: boolean;
  min_experience?: number;
  max_hourly_rate?: number;

  // UI compatibility aliases
  categoryId?: string;
  providerId?: string;
  isPrimary?: boolean;
  certificationVerified?: boolean;
  minExperience?: number;
  maxHourlyRate?: number;
}

// API Response structures
export interface CategoryResponse {
  success: boolean;
  message: string;
  data?: ServiceCategory;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data?: {
    categories: ServiceCategory[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface CategoryProvidersResponse {
  success: boolean;
  message: string;
  data?: {
    providers: CategoryProvider[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface CertificationResponse {
  success: boolean;
  message: string;
  data?: ProviderCertification;
}

export interface CertificationsResponse {
  success: boolean;
  message: string;
  data?: {
    certifications: ProviderCertification[];
    total: number;
    page: number;
    limit: number;
  };
}

// Enhanced category with populated data for UI
export interface EnhancedServiceCategory extends ServiceCategory {
  statistics?: CategoryStatistics;
  recentJobs?: Array<{
    id: string;
    title: string;
    created_at: string;
    budget_min?: number;
    budget_max?: number;
    location?: string;
  }>;
  topProviders?: Array<{
    id: string;
    name: string;
    rating?: number;
    completed_jobs?: number;
    hourly_rate?: number;
    avatar?: string;
  }>;
}

// Category hierarchy tree structure for UI
export interface CategoryTree {
  category: ServiceCategory;
  children: CategoryTree[];
  depth: number;
  path: string[];
}

// Category search and suggestions
export interface CategorySearchResult {
  categories: ServiceCategory[];
  providers: Array<{
    id: string;
    name: string;
    categories: string[];
    rating?: number;
    location?: string;
  }>;
  suggestions: string[];
}

// Legacy support for existing UI components
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  children?: Category[];
  providerCount?: number;
  jobCount?: number;
  isActive?: boolean;
  sortOrder?: number;
}

export interface CategoryOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  children?: CategoryOption[];
}

// Provider category specialization for profile
export interface ProviderSpecialization {
  categoryId: string;
  categoryName: string;
  experienceYears?: number;
  hourlyRate?: number;
  maxDistance?: number;
  isPrimary: boolean;
  certification?: string;
  isVerified: boolean;
  available: boolean;
  successRate?: number;
  completedJobs?: number;
  averageRating?: number;
}

// Dashboard statistics
export interface CategoryDashboardStats {
  totalCategories: number;
  activeCategories: number;
  totalProviders: number;
  totalJobs: number;
  topCategories: Array<{
    id: string;
    name: string;
    jobCount: number;
    providerCount: number;
    averageRate: number;
  }>;
  recentActivity: Array<{
    type: "job_posted" | "provider_joined" | "category_created";
    categoryId: string;
    categoryName: string;
    timestamp: string;
    details?: Record<string, unknown>;
  }>;
}
