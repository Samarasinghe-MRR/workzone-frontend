/**
 * User related types and interfaces
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

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  status?: "Active" | "Inactive" | "Pending";
  memberSince?: string;
  role: FrontendUserRole; // Use frontend roles for consistency
  verified?: boolean;
  rating?: number;
  completedJobs?: number;
  // Business-specific fields for providers
  businessName?: string;
  businessAddress?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  address?: string;
  preferences?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile extends UserProfile {
  address: string;
}

export interface ServiceProviderProfile extends UserProfile {
  category: string;
  location: string;
  experienceYears: number;
  latitude: number;
  longitude: number;
}

export interface AdminProfile extends UserProfile {
  permissions?: string[];
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  skills: string[];
  workRadius: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  responseTime: number;
  status: "available" | "busy" | "offline";
  verificationStatus: "verified" | "pending" | "unverified";
  portfolio?: PortfolioItem[];
  availability?: AvailabilitySlot[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  completedDate: string;
  customerReview?: string;
  rating?: number;
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
}
