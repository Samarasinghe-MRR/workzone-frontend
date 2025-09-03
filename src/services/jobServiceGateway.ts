/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CreateJobDto,
  UpdateJobDto,
  AssignJobDto,
  JobQueryParams,
  JobsResponse,
  JobResponse,
} from "@/types/job";
import { gatewayServices } from "@/lib/gatewayApi";

class JobService {
  // Get all jobs with optional filtering
  async getAllJobs(params?: JobQueryParams): Promise<JobsResponse> {
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

    return gatewayServices.jobs.get<JobsResponse>(endpoint, true);
  }

  // Get available jobs (open status)
  async getAvailableJobs(
    params?: Omit<JobQueryParams, "status">
  ): Promise<JobsResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/available-jobs?${queryParams.toString()}`
      : "/available-jobs";

    return gatewayServices.jobs.get<JobsResponse>(endpoint, true);
  }

  // Get jobs posted by current user
  async getMyJobs(status?: string): Promise<JobsResponse> {
    const endpoint = status
      ? `/my-jobs?status=${encodeURIComponent(status)}`
      : "/my-jobs";

    return gatewayServices.jobs.get<JobsResponse>(endpoint, true);
  }

  // Get jobs assigned to current service provider
  async getAssignedJobs(status?: string): Promise<JobsResponse> {
    const endpoint = status
      ? `/assigned-jobs?status=${encodeURIComponent(status)}`
      : "/assigned-jobs";

    return gatewayServices.jobs.get<JobsResponse>(endpoint, true);
  }

  // Get a specific job by ID
  async getJobById(id: string): Promise<JobResponse> {
    return gatewayServices.jobs.get<JobResponse>(`/${id}`, true);
  }

  // Create a new job
  async createJob(jobData: CreateJobDto): Promise<JobResponse> {
    return gatewayServices.jobs.post<JobResponse>("/", jobData, true);
  }

  // Post a new job (alias for createJob)
  async postJob(jobData: CreateJobDto): Promise<JobResponse> {
    // Note: This might need to route to a different service if post-job is separate
    return gatewayServices.jobs.post<JobResponse>("/post-job", jobData, true);
  }

  // Update a job
  async updateJob(id: string, jobData: UpdateJobDto): Promise<JobResponse> {
    return gatewayServices.jobs.patch<JobResponse>(`/${id}`, jobData, true);
  }

  // Delete a job
  async deleteJob(id: string): Promise<JobResponse> {
    return gatewayServices.jobs.delete<JobResponse>(`/${id}`, true);
  }

  // Assign a job to a service provider
  async assignJob(
    jobId: string,
    assignmentData: AssignJobDto
  ): Promise<JobResponse> {
    return gatewayServices.jobs.post<JobResponse>(
      `/${jobId}/assign`,
      assignmentData,
      true
    );
  }

  // Mark a job as completed
  async completeJob(jobId: string): Promise<JobResponse> {
    return gatewayServices.jobs.post<JobResponse>(
      `/${jobId}/complete`,
      {},
      true
    );
  }

  // Accept job assignment (for service providers)
  async acceptJob(jobId: string): Promise<JobResponse> {
    return gatewayServices.jobs.post<JobResponse>(`/${jobId}/accept`, {}, true);
  }

  // Reject job assignment (for service providers)
  async rejectJob(jobId: string, reason?: string): Promise<JobResponse> {
    return gatewayServices.jobs.post<JobResponse>(
      `/${jobId}/reject`,
      { reason },
      true
    );
  }

  // Cancel job
  async cancelJob(jobId: string, reason?: string): Promise<JobResponse> {
    return gatewayServices.jobs.post<JobResponse>(
      `/${jobId}/cancel`,
      { reason },
      true
    );
  }

  // Apply for job (for service providers)
  async applyForJob(
    jobId: string,
    applicationData?: any
  ): Promise<JobResponse> {
    return gatewayServices.jobs.post<JobResponse>(
      `/${jobId}/apply`,
      applicationData || {},
      true
    );
  }

  // Get job applications (for job owners)
  async getJobApplications(jobId: string): Promise<any> {
    return gatewayServices.jobs.get<any>(`/${jobId}/applications`, true);
  }

  // Review job application
  async reviewApplication(
    jobId: string,
    applicationId: string,
    action: "accept" | "reject",
    reason?: string
  ): Promise<any> {
    return gatewayServices.jobs.post<any>(
      `/${jobId}/applications/${applicationId}/${action}`,
      { reason },
      true
    );
  }

  // Get job statistics
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getJobStats(): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return gatewayServices.jobs.get<any>("/stats", true);
  }

  // Search jobs
  async searchJobs(
    searchTerm: string,
    filters?: JobQueryParams
  ): Promise<JobsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("search", searchTerm);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return gatewayServices.jobs.get<JobsResponse>(
      `/search?${queryParams.toString()}`,
      true
    );
  }
}

// Export a singleton instance
export const jobService = new JobService();
export default jobService;
