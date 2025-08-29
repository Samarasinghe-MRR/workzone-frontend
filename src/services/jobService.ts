import {
  CreateJobDto,
  UpdateJobDto,
  AssignJobDto,
  JobQueryParams,
  JobsResponse,
  JobResponse,
} from "@/types/job";

const API_BASE_URL = "/api";

class JobService {
  // Get authentication headers
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

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

    const url = queryParams.toString()
      ? `${API_BASE_URL}/jobs?${queryParams.toString()}`
      : `${API_BASE_URL}/jobs`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    return response.json();
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

    const url = queryParams.toString()
      ? `${API_BASE_URL}/jobs/available-jobs?${queryParams.toString()}`
      : `${API_BASE_URL}/jobs/available-jobs`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  // Get jobs posted by current user
  async getMyJobs(status?: string): Promise<JobsResponse> {
    const url = status
      ? `${API_BASE_URL}/jobs/my-jobs?status=${encodeURIComponent(status)}`
      : `${API_BASE_URL}/jobs/my-jobs`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  // Get jobs assigned to current service provider
  async getAssignedJobs(status?: string): Promise<JobsResponse> {
    const url = status
      ? `${API_BASE_URL}/jobs/assigned-jobs?status=${encodeURIComponent(
          status
        )}`
      : `${API_BASE_URL}/jobs/assigned-jobs`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  // Get a specific job by ID
  async getJobById(id: string): Promise<JobResponse> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  // Create a new job
  async createJob(jobData: CreateJobDto): Promise<JobResponse> {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(jobData),
    });

    return response.json();
  }

  // Post a new job (alias for createJob)
  async postJob(jobData: CreateJobDto): Promise<JobResponse> {
    const response = await fetch(`${API_BASE_URL}/post-job`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(jobData),
    });

    return response.json();
  }

  // Update a job
  async updateJob(id: string, jobData: UpdateJobDto): Promise<JobResponse> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(jobData),
    });

    return response.json();
  }

  // Delete a job
  async deleteJob(id: string): Promise<JobResponse> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  // Assign a job to a service provider
  async assignJob(
    jobId: string,
    assignmentData: AssignJobDto
  ): Promise<JobResponse> {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/assign`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(assignmentData),
    });

    return response.json();
  }

  // Mark a job as completed
  async completeJob(jobId: string): Promise<JobResponse> {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/complete`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }
}

// Export a singleton instance
export const jobService = new JobService();
export default jobService;
