"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { jobService } from "@/services/jobService";

// Interface for the actual backend response format
interface BackendJobResponse {
  id: string;
  customer_id: string;
  title: string;
  category: string;
  description: string;
  location?: string;
  budget_min?: number;
  budget_max?: number;
  budget?: number;
  status: string | number;
  created_at: string;
  updated_at: string;
  customer_email: string;
  assignments?: unknown[];
}
import {
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  Loader2,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  time: string;
  budget?: number;
  status: "active" | "scheduled" | "in-progress" | "completed" | "cancelled";
  provider?: {
    name: string;
    rating: number;
    avatar: string;
  };
  cost?: number;
  createdAt: string;
}

export default function MyJobsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapBackendStatusToFrontend = (backendStatus: string): Job["status"] => {
    switch (backendStatus) {
      case "OPEN":
        return "active";
      case "ASSIGNED":
        return "scheduled";
      case "IN_PROGRESS":
        return "in-progress";
      case "COMPLETED":
        return "completed";
      case "CANCELLED":
        return "cancelled";
      default:
        return "active";
    }
  };

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await jobService.getMyJobs();
        console.log("Jobs response:", response);

        // Handle both wrapped and direct array responses
        let jobsData: BackendJobResponse[];
        if (response && Array.isArray(response)) {
          // Direct array response from backend
          jobsData = response as unknown as BackendJobResponse[];
        } else if (response && response.success && response.data) {
          // Wrapped response
          jobsData = response.data as unknown as BackendJobResponse[];
        } else if (response && response.data && Array.isArray(response.data)) {
          // Response with data field but no success field
          jobsData = response.data as unknown as BackendJobResponse[];
        } else {
          throw new Error("Invalid response format");
        }

        // Transform backend data to match frontend interface
        const transformedJobs = jobsData.map((job: BackendJobResponse) => ({
          id: job.id,
          title: job.title,
          category: job.category,
          description: job.description,
          location: job.location || "Location not specified",
          date: job.created_at
            ? new Date(job.created_at).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          time: "10:00", // Default time since backend doesn't have specific time field
          budget: job.budget_min || job.budget_max || job.budget,
          status: mapBackendStatusToFrontend(
            job.status?.toString() || "PENDING"
          ),
          cost: job.budget_min || job.budget_max || job.budget,
          createdAt: job.created_at || new Date().toISOString(),
          provider:
            job.assignments && job.assignments.length > 0
              ? {
                  name: "Service Provider",
                  rating: 4.5, // Default rating
                  avatar: "SP",
                }
              : undefined,
        }));

        setJobs(transformedJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const statusConfig = {
    active: {
      label: "Active",
      color: "bg-blue-100 text-blue-800",
      icon: AlertCircle,
    },
    scheduled: {
      label: "Scheduled",
      color: "bg-green-100 text-green-800",
      icon: Calendar,
    },
    "in-progress": {
      label: "In Progress",
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    completed: {
      label: "Completed",
      color: "bg-emerald-100 text-emerald-800",
      icon: CheckCircle2,
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
      icon: AlertCircle,
    },
  };

  const tabs = [
    { id: "all", label: "All Jobs", count: jobs.length },
    {
      id: "active",
      label: "Active",
      count: jobs.filter((j) => j.status === "active").length,
    },
    {
      id: "scheduled",
      label: "Scheduled",
      count: jobs.filter((j) => j.status === "scheduled").length,
    },
    {
      id: "in-progress",
      label: "In Progress",
      count: jobs.filter((j) => j.status === "in-progress").length,
    },
    {
      id: "completed",
      label: "Completed",
      count: jobs.filter((j) => j.status === "completed").length,
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesTab = activeTab === "all" || job.status === activeTab;
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const JobCard = ({ job }: { job: Job }) => {
    const StatusIcon = statusConfig[job.status].icon;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {job.title}
                </h3>
                <Badge className={statusConfig[job.status].color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig[job.status].label}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">{job.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {job.location}
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(job.date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              {job.time}
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-2" />
              {job.cost
                ? `$${job.cost}`
                : job.budget
                ? `Budget: $${job.budget}`
                : "No budget set"}
            </div>
          </div>

          {job.provider && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  {job.provider.avatar}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {job.provider.name}
                  </p>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 ml-1">
                      {job.provider.rating}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Button>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Posted {new Date(job.createdAt).toLocaleDateString()}
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              {job.status === "active" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  Cancel
                </Button>
              )}
              {job.status === "in-progress" && (
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Track Job
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
        <div className="text-sm text-gray-600">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="mx-auto h-12 w-12 text-gray-400 mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading your jobs...
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch your job data.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error loading jobs
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Content - only show when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button variant="outline" className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        activeTab === tab.id
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm
                      ? "No jobs match your search criteria."
                      : "You haven't posted any jobs yet."}
                  </p>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Post Your First Job
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
