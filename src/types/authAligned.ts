/**
 * Updated Authentication types aligned with Auth Service Prisma Schema
 */

import type { FrontendUserRole } from "./user";

export interface LoginCredentials {
  email: string;
  password: string;
}

// Updated to match Auth Service schema requirements
export interface SignupData {
  email?: string; // Optional for phone signup
  phone?: string; // Optional for email signup
  password: string;
  confirmPassword: string;
  firstName: string; // Split from name to match User Service
  lastName: string; // Split from name to match User Service
  role: FrontendUserRole;
  googleId?: string; // Support OAuth signup
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

// Updated to match Auth Service User model
export interface AuthUser {
  // Auth Service fields
  id: string; // Auth Service User.id
  email?: string;
  phone?: string;
  googleId?: string;
  role: "CUSTOMER" | "SERVICE_PROVIDER" | "ADMIN"; // Match schema enum
  status: "ACTIVE" | "INACTIVE"; // Match schema enum
  createdAt: string;
  updatedAt: string;

  // Token fields
  token: string;
  refreshToken: string;

  // User Service fields (populated after auth)
  firstName?: string; // From User Service
  lastName?: string; // From User Service
  isVerified?: boolean; // From User Service
  profileComplete?: boolean;

  // Computed fields
  name?: string; // firstName + lastName computed
  avatar?: string;
  memberSince?: string;
}

// Base User interface for auth (to avoid circular imports)
export interface BaseUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: FrontendUserRole;
  status?: "Active" | "Inactive" | "Pending";
  verified?: boolean;
  avatar?: string;
  memberSince?: string;
  rating?: number;
  completedJobs?: number;
}

// Verification token types matching schema
export interface VerificationToken {
  id: string;
  userId: string;
  token: string;
  type: "EMAIL_VERIFICATION" | "PASSWORD_RESET";
  expiresAt: string;
  createdAt: string;
}

// Failed login tracking
export interface FailedLogin {
  id: string;
  userId: string;
  attemptAt: string;
}

// OAuth provider support
export interface OAuthProvider {
  provider: "google" | "facebook" | "apple";
  providerId: string;
  email?: string;
  name?: string;
  avatar?: string;
}

// Enhanced signup for OAuth
export interface OAuthSignupData
  extends Omit<SignupData, "password" | "confirmPassword"> {
  provider: OAuthProvider;
  accessToken: string;
}

// Auth response structure
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: AuthUser;
  requiresVerification?: boolean;
  verificationSent?: boolean;
}

// Phone/Email verification
export interface VerificationRequest {
  email?: string;
  phone?: string;
}

export interface VerificationConfirm {
  token: string;
  email?: string;
  phone?: string;
}

// Password strength requirements
export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

// Session management
export interface UserSession {
  id: string;
  userId: string;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
  lastActive: string;
  expiresAt: string;
  isActive: boolean;
}

// Multi-factor authentication
export interface MFASetup {
  enabled: boolean;
  method: "sms" | "email" | "app";
  backupCodes?: string[];
}

// Account security
export interface SecuritySettings {
  mfaEnabled: boolean;
  passwordLastChanged: string;
  failedLoginCount: number;
  accountLocked: boolean;
  lockoutExpiresAt?: string;
}
