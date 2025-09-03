/**
 * Updated Job types aligned with Job Service Prisma Schema
 */

// Job Status enum matching schema exactly
export enum JobStatus {
  PENDING = "PENDING", // Job created, waiting for providers
  OPEN = "OPEN", // Job published and open for quotes
  IN_PROGRESS = "IN_PROGRESS", // Provider assigned and working
  COMPLETED = "COMPLETED", // Job finished
  CANCELLED = "CANCELLED", // Job cancelled by customer
}

// Assignment Status enum matching schema
export enum AssignmentStatus {
  ASSIGNED = "ASSIGNED", // Provider assigned to job
  ACCEPTED = "ACCEPTED", // Provider accepted the assignment
  REJECTED = "REJECTED", // Provider rejected the assignment
  COMPLETED = "COMPLETED", // Provider marked job as completed
}

// Job Priority enum matching schema
export enum JobPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

// Main Job interface aligned with Job Service schema
export interface Job {
  id: string;

  // Customer Information (from User Service)
  customer_id: string; // Link to User Service Customer ID
  customer_email: string; // Cached for quick access

  // Job Details
  title: string;
  description: string;
  category: string; // Legacy field - keep for backward compatibility
  categoryId?: string; // New field - links to Category Service

  // Location with enhanced radius support
  location?: string; // Address as string
  location_lat?: number; // Latitude for geospatial queries
  location_lng?: number; // Longitude for geospatial queries
  maxRadius?: number; // Search radius for providers (km)

  // Budget
  budget_min?: number;
  budget_max?: number;
  currency: string; // Default "LKR"

  // Scheduling
  scheduled_at?: string; // When customer wants job done
  deadline?: string; // Latest completion date

  // Status and Priority
  status: JobStatus;
  priority: JobPriority;

  // Additional Information
  notes?: string; // Customer special instructions (eco-friendly, etc.)
  requirements?: string; // Technical requirements

  // Tracking
  views: number;
  created_at: string;
  updated_at: string;
  published_at?: string; // When job was made public
  completed_at?: string; // When job was completed

  // Relationships
  assignments?: JobAssignment[];
  attachments?: JobAttachment[];
  notifications?: JobNotification[];

  // Legacy/computed fields for UI compatibility
  customerId?: string; // Alias for customer_id
  customerEmail?: string; // Alias for customer_email
  customerName?: string; // Populated from User Service
  providerName?: string; // Populated from assignments
  providerId?: string; // From current assignment
  serviceProviderId?: string; // Alias for providerId
  budget?: number; // Computed from budget_min/max
  coordinates?: {
    // Computed from location_lat/lng
    lat: number;
    lng: number;
  };
  images?: string[]; // From attachments
  estimatedDuration?: string; // From assignment
  quoteAmount?: number; // From assignment
  assignedAt?: string; // From assignment
  scheduledDate?: string; // Alias for scheduled_at
  createdAt?: string; // Alias for created_at
  updatedAt?: string; // Alias for updated_at
  urgency?: "low" | "medium" | "high"; // Computed from priority
}

// Job Assignment aligned with schema
export interface JobAssignment {
  id: string;
  job_id: string;
  provider_id: string; // Link to User Service Provider ID
  provider_email: string; // Cached for quick access

  status: AssignmentStatus;
  assigned_at: string;
  accepted_at?: string;
  completed_at?: string;

  // Provider's quote/bid information
  quote_amount?: number;
  quote_message?: string;
  estimated_duration?: string; // e.g., "2 hours", "1 day"

  // UI computed fields
  jobId?: string; // Alias for job_id
  providerId?: string; // Alias for provider_id
  providerEmail?: string; // Alias for provider_email
  assignedAt?: string; // Alias for assigned_at
  acceptedAt?: string; // Alias for accepted_at
  completedAt?: string; // Alias for completed_at
  quoteAmount?: number; // Alias for quote_amount
  quoteMessage?: string; // Alias for quote_message
  estimatedDuration?: string; // Alias for estimated_duration
}

// Job Attachment aligned with schema
export interface JobAttachment {
  id: string;
  job_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;

  // UI computed fields
  jobId?: string; // Alias for job_id
  fileName?: string; // Alias for file_name
  filePath?: string; // Alias for file_path
  fileSize?: number; // Alias for file_size
  mimeType?: string; // Alias for mime_type
  uploadedAt?: string; // Alias for uploaded_at
  url?: string; // Computed download URL
}

// Job Notification aligned with schema
export interface JobNotification {
  id: string;
  job_id: string;
  user_id: string; // Can be customer or provider
  type: string; // "job_created", "assignment_received", "job_completed", etc.
  title: string;
  message: string;
  is_read: boolean;
  metadata?: string; // JSON for additional data
  created_at: string;

  // UI computed fields
  jobId?: string; // Alias for job_id
  userId?: string; // Alias for user_id
  isRead?: boolean; // Alias for is_read
  createdAt?: string; // Alias for created_at
  parsedMetadata?: Record<string, unknown>; // Parsed JSON metadata
}

// Job Event for microservice communication
export interface JobEvent {
  id: string;
  job_id: string;
  event_type: string; // "job.created", "job.assigned", "job.completed", etc.
  payload: string; // JSON payload
  published: boolean;
  created_at: string;

  // UI computed fields
  jobId?: string; // Alias for job_id
  eventType?: string; // Alias for event_type
  createdAt?: string; // Alias for created_at
  parsedPayload?: Record<string, unknown>; // Parsed JSON payload
}

// DTOs for API requests (aligned with schema)
export interface CreateJobDto {
  title: string;
  description: string;
  category: string;
  categoryId?: string;
  location?: string;
  location_lat?: number;
  location_lng?: number;
  maxRadius?: number;
  budget_min?: number;
  budget_max?: number;
  currency?: string;
  scheduled_at?: string;
  deadline?: string;
  priority?: JobPriority;
  notes?: string;
  requirements?: string;

  // Legacy field support for UI compatibility
  budget?: number; // Will be converted to budget_min/max
  coordinates?: {
    lat: number;
    lng: number;
  };
  images?: File[]; // For file uploads
  estimatedDuration?: string;
}

export interface UpdateJobDto {
  title?: string;
  description?: string;
  category?: string;
  categoryId?: string;
  location?: string;
  location_lat?: number;
  location_lng?: number;
  maxRadius?: number;
  budget_min?: number;
  budget_max?: number;
  currency?: string;
  scheduled_at?: string;
  deadline?: string;
  priority?: JobPriority;
  notes?: string;
  requirements?: string;
  status?: JobStatus;

  // Legacy field support
  budget?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface AssignJobDto {
  provider_id: string;
  quote_amount?: number;
  quote_message?: string;
  estimated_duration?: string;

  // Legacy field support
  serviceProviderId?: string; // Alias for provider_id
  quoteAmount?: number; // Alias for quote_amount
  estimatedDuration?: string; // Alias for estimated_duration
}

// Job Query Parameters for filtering
export interface JobQueryParams {
  status?: JobStatus | JobStatus[];
  priority?: JobPriority | JobPriority[];
  category?: string | string[];
  categoryId?: string | string[];
  customer_id?: string;
  provider_id?: string;
  location?: string;
  maxDistance?: number; // For geographic search
  budget_min?: number;
  budget_max?: number;
  created_after?: string;
  created_before?: string;
  scheduled_after?: string;
  scheduled_before?: string;
  search?: string; // Text search
  page?: number;
  limit?: number;
  sortBy?:
    | "created_at"
    | "updated_at"
    | "scheduled_at"
    | "priority"
    | "budget_min";
  sortOrder?: "asc" | "desc";

  // Legacy parameter support
  customerId?: string; // Alias for customer_id
  providerId?: string; // Alias for provider_id
}

// API Response structures
export interface JobResponse {
  success: boolean;
  message: string;
  data?: Job;
}

export interface JobsResponse {
  success: boolean;
  message: string;
  data?: {
    jobs: Job[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Job Statistics
export interface JobStatistics {
  totalJobs: number;
  pendingJobs: number;
  openJobs: number;
  inProgressJobs: number;
  completedJobs: number;
  cancelledJobs: number;
  averageBudget: number;
  totalBudget: number;
  averageCompletionTime: number; // in hours
  topCategories: Array<{
    category: string;
    count: number;
  }>;
  jobsByPriority: Record<JobPriority, number>;
}

// Enhanced Job for UI with populated relationships
export interface EnhancedJob extends Job {
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    rating?: number;
  };
  assignedProvider?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    rating?: number;
    responseTime?: number;
  };
  categoryDetails?: {
    id: string;
    name: string;
    description?: string;
    parentCategory?: string;
  };
  applicants?: Array<{
    providerId: string;
    providerName: string;
    appliedAt: string;
    quoteAmount?: number;
    message?: string;
  }>;
}

// Legacy Task interface for backward compatibility
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
