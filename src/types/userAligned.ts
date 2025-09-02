/**
 * Updated User types aligned with User Service Prisma Schema
 */

// Frontend role types (lowercase, user-friendly)
export type FrontendUserRole = "admin" | "customer" | "provider";

// Backend role types (matches Prisma enum)
export type BackendUserRole = "ADMIN" | "CUSTOMER" | "SERVICE_PROVIDER";

// Role mapping utilities
export const ROLE_MAPPING: Record<FrontendUserRole, BackendUserRole> = {
  admin: "ADMIN",
  customer: "CUSTOMER",
  provider: "SERVICE_PROVIDER",
};

export const REVERSE_ROLE_MAPPING: Record<BackendUserRole, FrontendUserRole> = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  SERVICE_PROVIDER: "provider",
};

// Role model aligned with User Service schema
export interface Role {
  id: string;
  name: string; // "ADMIN", "CUSTOMER", "SERVICE_PROVIDER"
}

// Main User interface aligned with User Service schema
export interface User {
  id: string;
  authUserId: string; // Link to Auth Service User.id
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isVerified: boolean;
  role: Role; // Role object instead of string
  roleId: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  passwordLastChanged?: string;

  // Computed fields for UI
  name?: string; // firstName + lastName
  avatar?: string;
  memberSince?: string;

  // Role-specific profiles
  serviceProviderProfile?: ServiceProviderProfile;
  customerProfile?: CustomerProfile;
  adminProfile?: AdminProfile;
}

// Base User Profile aligned with schema
export interface UserProfile {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Customer Profile aligned with schema
export interface CustomerProfile extends UserProfile {
  address: string;
}

// Service Provider Profile aligned with schema
export interface ServiceProviderProfile extends UserProfile {
  category: string;
  experienceYears: number;
  location: string;
  latitude: number; // Geographic location
  longitude: number; // Geographic location
  serviceRadius: number; // Service area radius in km
  averageResponseTime: number; // Response time in hours
  rating: number;
  availability: boolean;
  isAvailable: boolean;

  // Provider specializations
  specializations: ProviderSpecialization[];
}

// Provider Specialization aligned with schema
export interface ProviderSpecialization {
  id: string;
  providerId: string;
  categoryId: string; // References Category Service categories
  isActive: boolean;
  createdAt: string;
}

// Admin Profile aligned with schema
export interface AdminProfile extends UserProfile {
  // Admin-specific fields can be added here
  permissions?: string[]; // UI enhancement
}

// Enhanced Provider interface for UI (combines User + ServiceProviderProfile)
export interface Provider {
  // User fields
  id: string;
  authUserId: string;
  firstName: string;
  lastName: string;
  name: string; // Computed
  email: string;
  phone: string;
  isVerified: boolean;
  isActive: boolean;
  avatar?: string;

  // ServiceProviderProfile fields
  category: string;
  location: string;
  latitude: number;
  longitude: number;
  experienceYears: number;
  serviceRadius: number;
  averageResponseTime: number;
  rating: number;
  availability: boolean;
  isAvailable: boolean;

  // Enhanced UI fields
  skills: string[]; // Derived from specializations
  workRadius: number; // Alias for serviceRadius
  reviewCount: number;
  completedJobs: number;
  responseTime: number; // Alias for averageResponseTime
  status: "available" | "busy" | "offline";
  verificationStatus: "verified" | "pending" | "unverified";

  // Optional UI enhancements
  portfolio?: PortfolioItem[];
  availabilitySlots?: AvailabilitySlot[];
  specializations: ProviderSpecialization[];
}

// Portfolio items (UI enhancement - not in schema yet)
export interface PortfolioItem {
  id: string;
  providerId: string;
  title: string;
  description: string;
  images: string[];
  completedDate: string;
  customerReview?: string;
  rating?: number;
  category?: string;
}

// Availability slots (UI enhancement - not in schema yet)
export interface AvailabilitySlot {
  id: string;
  providerId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isAvailable: boolean;
  date?: string; // For specific date overrides
}

// Update profile data structures
export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

export interface UpdateCustomerProfileData {
  address?: string;
}

export interface UpdateServiceProviderProfileData {
  category?: string;
  experienceYears?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  serviceRadius?: number;
  availability?: boolean;
  isAvailable?: boolean;
}

export interface UpdateProviderSpecializationData {
  categoryId: string;
  isActive: boolean;
}

// Change password request
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// User search and filtering
export interface UserSearchFilters {
  role?: FrontendUserRole;
  isVerified?: boolean;
  isActive?: boolean;
  location?: string;
  skills?: string[]; // For providers
  serviceRadius?: number; // For providers
  minRating?: number; // For providers
  maxDistance?: number; // From specific location
}

export interface UserSearchResult {
  users: User[];
  providers?: Provider[];
  total: number;
  page: number;
  limit: number;
  filters: UserSearchFilters;
}

// User statistics (for admin dashboard)
export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: Record<string, number>;
  verifiedUsers: number;
  unverifiedUsers: number;

  // Provider-specific stats
  totalProviders: number;
  availableProviders: number;
  averageProviderRating: number;
  topCategories: Array<{
    category: string;
    count: number;
  }>;
}

// Notification settings (UI enhancement)
export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  jobAlerts: boolean;
  messageAlerts: boolean;
  quotationAlerts: boolean;
  assignmentAlerts: boolean;
}

// User preferences (UI enhancement)
export interface UserPreferences {
  language: string;
  timezone: string;
  currency: string;
  units: "metric" | "imperial";
  theme: "light" | "dark" | "system";
  notifications: NotificationSettings;
}

// Privacy settings (UI enhancement)
export interface PrivacySettings {
  profileVisibility: "public" | "private" | "verified-only";
  showLocation: boolean;
  showPhone: boolean;
  showEmail: boolean;
  allowDirectMessages: boolean;
  allowJobInvitations: boolean;
}

// Complete user profile for UI
export interface CompleteUserProfile {
  user: User;
  preferences?: UserPreferences;
  privacySettings?: PrivacySettings;
  statistics?: {
    jobsPosted?: number;
    jobsCompleted?: number;
    totalSpent?: number;
    totalEarned?: number;
    averageRating?: number;
    responseRate?: number;
  };
}
