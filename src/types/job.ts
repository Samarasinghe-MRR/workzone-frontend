/**
 * Job and task related types - Updated to align with backend microservice
 */

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Updated Job interface to match backend controller
export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  budget?: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: JobStatus;
  requirements?: string[];
  estimatedDuration?: string;
  images?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  customerId: string;
  customerEmail: string;
  serviceProviderId?: string;
  assignedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  quoteAmount?: number;
  estimatedCompletionTime?: string;
  // Legacy fields for backward compatibility
  customerName?: string;
  providerName?: string;
  providerId?: string;
  scheduledDate?: string;
  urgency?: "low" | "medium" | "high";
}

// Job Status Enum matching backend
export enum JobStatus {
  OPEN = "OPEN",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  DISPUTED = "DISPUTED",
}

// DTOs for API requests
export interface CreateJobDto {
  title: string;
  description: string;
  category: string;
  location?: string;
  budget?: number;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  requirements?: string[];
  estimatedDuration?: string;
  images?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface UpdateJobDto {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  budget?: number;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  requirements?: string[];
  estimatedDuration?: string;
  images?: string[];
  status?: JobStatus;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface AssignJobDto {
  serviceProviderId: string;
  quoteAmount?: number;
  estimatedDuration?: string;
}

export interface JobQueryParams {
  status?: JobStatus;
  category?: string;
  location?: string;
  minBudget?: number;
  maxBudget?: number;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  lat?: number;
  lng?: number;
  radius?: number;
  page?: number;
  limit?: number;
}

export interface Quotation {
  id: string;
  jobId: string;
  providerId: string;
  customerId: string;
  amount: number;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  providerName?: string;
  providerRating?: number;
  estimatedTime?: number;
}

export interface JobCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  subcategories?: string[];
}

// API Response types
export interface JobsResponse {
  success: boolean;
  data: Job[];
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface JobResponse {
  success: boolean;
  data: Job;
  message?: string;
}
