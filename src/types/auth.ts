/**
 * Authentication related types
 */

import type { FrontendUserRole } from "./user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

// Base User interface for auth (to avoid circular imports)
export interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  status?: "Active" | "Inactive" | "Pending";
  memberSince?: string;
  role: FrontendUserRole;
  verified?: boolean;
  rating?: number;
  completedJobs?: number;
}

export interface AuthUser extends BaseUser {
  token: string;
  refreshToken: string;
}
