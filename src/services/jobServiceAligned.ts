import { JobAligned } from "@/types";
import { gatewayServices } from "@/lib/gatewayApi";

// Additional types for job applications and stats
interface JobApplication {
  id: string;
  jobId: string;
  providerId: string;
  status: string;
  appliedAt: string;
  message?: string;
}

interface JobStats {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  pendingJobs: number;
}

interface ApplicationData {
  message?: string;
  estimatedPrice?: number;
  estimatedDuration?: string;
}

class JobService {
  // Get all jobs with optional filtering
  async getAllJobs(
    params?: JobAligned.JobQueryParams
  ): Promise<JobAligned.JobsResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/?${queryParams.toString()}`
      : "/";

    return gatewayServices.jobs.get<JobAligned.JobsResponse>(endpoint, true);
  }

  // Get available jobs for providers (not assigned yet)
  async getAvailableJobs(
    params?: Omit<JobAligned.JobQueryParams, "status">
  ): Promise<JobAligned.JobsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("status", "open");

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/?${queryParams.toString()}`;
    return gatewayServices.jobs.get<JobAligned.JobsResponse>(endpoint, true);
  }

  // Get jobs created by current user (customer)
  async getMyJobs(status?: string): Promise<JobAligned.JobsResponse> {
    const endpoint = status ? `/my-jobs?status=${status}` : "/my-jobs";
    return gatewayServices.jobs.get<JobAligned.JobsResponse>(endpoint, true);
  }

  // Get jobs assigned to current user (provider)
  async getAssignedJobs(status?: string): Promise<JobAligned.JobsResponse> {
    const endpoint = status ? `/assigned?status=${status}` : "/assigned";
    return gatewayServices.jobs.get<JobAligned.JobsResponse>(endpoint, true);
  }

  // Get job by ID
  async getJobById(id: string): Promise<JobAligned.JobResponse> {
    return gatewayServices.jobs.get<JobAligned.JobResponse>(`/${id}`, true);
  }

  // Create a new job
  async createJob(
    jobData: JobAligned.CreateJobDto
  ): Promise<JobAligned.JobResponse> {
    return gatewayServices.jobs.post<JobAligned.JobResponse>(
      "/",
      jobData,
      true
    );
  }

  // Post a job (alias for createJob for backward compatibility)
  async postJob(
    jobData: JobAligned.CreateJobDto
  ): Promise<JobAligned.JobResponse> {
    // Use the same endpoint as createJob - the backend likely handles both
    return gatewayServices.jobs.post<JobAligned.JobResponse>(
      "/post-job",
      jobData,
      true
    );
  }

  // Update a job
  async updateJob(
    id: string,
    jobData: JobAligned.UpdateJobDto
  ): Promise<JobAligned.JobResponse> {
    return gatewayServices.jobs.put<JobAligned.JobResponse>(
      `/${id}`,
      jobData,
      true
    );
  }

  // Delete a job
  async deleteJob(id: string): Promise<{ success: boolean; message: string }> {
    return gatewayServices.jobs.delete<{ success: boolean; message: string }>(
      `/${id}`,
      true
    );
  }

  // Assign job to provider
  async assignJob(
    jobId: string,
    assignmentData: JobAligned.AssignJobDto
  ): Promise<JobAligned.JobResponse> {
    return gatewayServices.jobs.post<JobAligned.JobResponse>(
      `/${jobId}/assign`,
      assignmentData,
      true
    );
  }

  // Apply for a job (provider)
  async applyForJob(
    jobId: string,
    applicationData: ApplicationData
  ): Promise<{ success: boolean; message: string; applicationId: string }> {
    return gatewayServices.jobs.post<{
      success: boolean;
      message: string;
      applicationId: string;
    }>(`/${jobId}/apply`, applicationData, true);
  }

  // Get job applications for a specific job (customer)
  async getJobApplications(
    jobId: string
  ): Promise<{ success: boolean; data: JobApplication[] }> {
    return gatewayServices.jobs.get<{
      success: boolean;
      data: JobApplication[];
    }>(`/${jobId}/applications`, true);
  }

  // Accept job application (customer)
  async acceptApplication(
    jobId: string,
    applicationId: string
  ): Promise<{ success: boolean; message: string }> {
    return gatewayServices.jobs.post<{ success: boolean; message: string }>(
      `/${jobId}/applications/${applicationId}/accept`,
      {},
      true
    );
  }

  // Reject job application (customer)
  async rejectApplication(
    jobId: string,
    applicationId: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> {
    return gatewayServices.jobs.post<{ success: boolean; message: string }>(
      `/${jobId}/applications/${applicationId}/reject`,
      { reason },
      true
    );
  }

  // Mark job as completed (provider)
  async completeJob(id: string): Promise<JobAligned.JobResponse> {
    return gatewayServices.jobs.patch<JobAligned.JobResponse>(
      `/${id}/complete`,
      {},
      true
    );
  }

  // Cancel a job (customer)
  async cancelJob(
    id: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> {
    return gatewayServices.jobs.patch<{ success: boolean; message: string }>(
      `/${id}/cancel`,
      { reason },
      true
    );
  }

  // Get job statistics
  async getJobStats(): Promise<{ success: boolean; data: JobStats }> {
    return gatewayServices.jobs.get<{ success: boolean; data: JobStats }>(
      "/stats",
      true
    );
  }

  // Search jobs
  async searchJobs(
    searchTerm: string,
    filters?: JobAligned.JobQueryParams
  ): Promise<JobAligned.JobsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("q", searchTerm);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return gatewayServices.jobs.get<JobAligned.JobsResponse>(
      `/search?${queryParams.toString()}`,
      true
    );
  }
}

// Export singleton instance
export const jobService = new JobService();
export default jobService;
