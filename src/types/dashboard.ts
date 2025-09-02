// Dashboard-related types for authentication flow

export interface DashboardUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "CUSTOMER" | "SERVICE_PROVIDER" | "ADMIN";
}

export interface DashboardStatistics {
  totalJobs: number;
  completedJobs: number;
  totalSpent: number;
  completionRate: number;
  averageRating: number;
  totalEarned: number;
}

export interface DashboardJob {
  id: string;
  title: string;
  status: "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  budget: number;
  createdAt: string;
  completedAt?: string;
}

export interface DashboardQuotation {
  id: string;
  jobId: string;
  providerName?: string;
  customerName?: string;
  amount: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  submittedAt: string;
}

export interface DashboardActivity {
  id: string;
  type:
    | "JOB_POSTED"
    | "JOB_COMPLETED"
    | "QUOTE_RECEIVED"
    | "QUOTE_SUBMITTED"
    | "PAYMENT_RECEIVED";
  description: string;
  timestamp: string;
}

export interface DashboardData {
  user: DashboardUser;
  statistics: DashboardStatistics;
  jobs: {
    posted: DashboardJob[];
    assigned: DashboardJob[];
    completed: DashboardJob[];
  };
  quotations: {
    received: DashboardQuotation[];
    submitted: DashboardQuotation[];
  };
  recentActivity: DashboardActivity[];
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
  message?: string;
}
