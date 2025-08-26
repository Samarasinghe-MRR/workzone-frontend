/**
 * Utility functions for handling user roles and role mapping
 */

import {
  ROLE_MAPPING,
  REVERSE_ROLE_MAPPING,
  type FrontendUserRole,
  type BackendUserRole,
} from "@/types/user";

/**
 * Convert frontend role to backend role for API calls
 */
export function frontendToBackendRole(
  frontendRole: FrontendUserRole
): BackendUserRole {
  return ROLE_MAPPING[frontendRole];
}

/**
 * Convert backend role to frontend role for UI display
 */
export function backendToFrontendRole(
  backendRole: BackendUserRole
): FrontendUserRole {
  return REVERSE_ROLE_MAPPING[backendRole];
}

/**
 * Validate if a string is a valid frontend role
 */
export function isValidFrontendRole(role: string): role is FrontendUserRole {
  return role in ROLE_MAPPING;
}

/**
 * Validate if a string is a valid backend role
 */
export function isValidBackendRole(role: string): role is BackendUserRole {
  return role in REVERSE_ROLE_MAPPING;
}

/**
 * Get all valid frontend roles
 */
export function getAllFrontendRoles(): FrontendUserRole[] {
  return Object.keys(ROLE_MAPPING) as FrontendUserRole[];
}

/**
 * Get all valid backend roles
 */
export function getAllBackendRoles(): BackendUserRole[] {
  return Object.keys(REVERSE_ROLE_MAPPING) as BackendUserRole[];
}

/**
 * Check if user has permission based on role hierarchy
 * Admin > Provider > Customer
 */
export function hasRolePermission(
  userRole: FrontendUserRole,
  requiredRole: FrontendUserRole
): boolean {
  const roleHierarchy: Record<FrontendUserRole, number> = {
    customer: 1,
    provider: 2,
    admin: 3,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
