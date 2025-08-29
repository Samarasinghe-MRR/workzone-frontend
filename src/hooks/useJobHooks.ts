import { useState, useEffect, useCallback } from "react";
import { jobService } from "@/services/jobService";
import {
  CreateJobDto,
  UpdateJobDto,
  AssignJobDto,
  JobQueryParams,
  Job,
} from "@/types/job";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Hook for fetching all jobs
export const useJobs = (params?: JobQueryParams) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.getAllJobs(params);

      if (response.success) {
        setJobs(response.data);
        setPagination(response.pagination || null);
      } else {
        setError(response.message || "Failed to fetch jobs");
      }
    } catch (err) {
      setError("An error occurred while fetching jobs");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, loading, error, pagination, refetch: fetchJobs };
};

// Hook for fetching available jobs
export const useAvailableJobs = (params?: Omit<JobQueryParams, "status">) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const fetchAvailableJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.getAvailableJobs(params);

      if (response.success) {
        setJobs(response.data);
        setPagination(response.pagination || null);
      } else {
        setError(response.message || "Failed to fetch available jobs");
      }
    } catch (err) {
      setError("An error occurred while fetching available jobs");
      console.error("Error fetching available jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchAvailableJobs();
  }, [fetchAvailableJobs]);

  return { jobs, loading, error, pagination, refetch: fetchAvailableJobs };
};

// Hook for fetching user's posted jobs
export const useMyJobs = (status?: string) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.getMyJobs(status);

      if (response.success) {
        setJobs(response.data);
      } else {
        setError(response.message || "Failed to fetch my jobs");
      }
    } catch (err) {
      setError("An error occurred while fetching my jobs");
      console.error("Error fetching my jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchMyJobs();
  }, [fetchMyJobs]);

  return { jobs, loading, error, refetch: fetchMyJobs };
};

// Hook for fetching assigned jobs
export const useAssignedJobs = (status?: string) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignedJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.getAssignedJobs(status);

      if (response.success) {
        setJobs(response.data);
      } else {
        setError(response.message || "Failed to fetch assigned jobs");
      }
    } catch (err) {
      setError("An error occurred while fetching assigned jobs");
      console.error("Error fetching assigned jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchAssignedJobs();
  }, [fetchAssignedJobs]);

  return { jobs, loading, error, refetch: fetchAssignedJobs };
};

// Hook for fetching a single job
export const useJob = (id: string) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.getJobById(id);

      if (response.success) {
        setJob(response.data);
      } else {
        setError(response.message || "Failed to fetch job");
      }
    } catch (err) {
      setError("An error occurred while fetching job");
      console.error("Error fetching job:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id, fetchJob]);

  return { job, loading, error, refetch: fetchJob };
};

// Hook for job operations (create, update, delete, assign, complete)
export const useJobOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createJob = async (jobData: CreateJobDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.createJob(jobData);

      if (response.success) {
        return response.data;
      } else {
        setError(response.message || "Failed to create job");
        throw new Error(response.message || "Failed to create job");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while creating job";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const postJob = async (jobData: CreateJobDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.postJob(jobData);

      if (response.success) {
        return response.data;
      } else {
        setError(response.message || "Failed to post job");
        throw new Error(response.message || "Failed to post job");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while posting job";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (id: string, jobData: UpdateJobDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.updateJob(id, jobData);

      if (response.success) {
        return response.data;
      } else {
        setError(response.message || "Failed to update job");
        throw new Error(response.message || "Failed to update job");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while updating job";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.deleteJob(id);

      if (response.success) {
        return response.data;
      } else {
        setError(response.message || "Failed to delete job");
        throw new Error(response.message || "Failed to delete job");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while deleting job";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignJob = async (jobId: string, assignmentData: AssignJobDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.assignJob(jobId, assignmentData);

      if (response.success) {
        return response.data;
      } else {
        setError(response.message || "Failed to assign job");
        throw new Error(response.message || "Failed to assign job");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while assigning job";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeJob = async (jobId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.completeJob(jobId);

      if (response.success) {
        return response.data;
      } else {
        setError(response.message || "Failed to complete job");
        throw new Error(response.message || "Failed to complete job");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while completing job";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createJob,
    postJob,
    updateJob,
    deleteJob,
    assignJob,
    completeJob,
  };
};
