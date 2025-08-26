/**
 * Main types index - exports all types from modular files
 * This provides a single entry point for importing types across the application
 */

// Authentication types
export * from "./auth";

// User types
export * from "./user";

// Job types
export * from "./job";

// Payment types
export * from "./payment";

// Common types
export * from "./common";

// Legacy compatibility - these will be moved to appropriate files
export interface AdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalProviders: number;
  activeJobs: number;
  pendingVerifications: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalPayments: number;
  pendingPayments: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  imageUrl?: string;
}

// Legacy Transaction type for backward compatibility
export interface LegacyTransaction {
  id: string;
  jobId: string;
  customerId: string;
  providerId: string;
  amount: number;
  commission: number;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  createdAt: string;
  customerName?: string;
  providerName?: string;
  jobTitle?: string;
}
