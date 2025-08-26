/**
 * Job and task related types
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

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  scheduledDate: string;
  status:
    | "posted"
    | "quoted"
    | "accepted"
    | "in-progress"
    | "completed"
    | "cancelled";
  customerId: string;
  providerId?: string;
  customerName?: string;
  providerName?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDuration?: number;
  urgency?: "low" | "medium" | "high";
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
