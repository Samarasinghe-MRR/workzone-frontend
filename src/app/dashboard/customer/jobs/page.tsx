"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Kitchen Deep Cleaning",
    category: "Cleaning",
    description:
      "Need a thorough deep cleaning of kitchen including appliances",
    location: "Downtown Apartment",
    date: "2025-08-30",
    time: "14:00",
    budget: 150,
    status: "in-progress",
    provider: {
      name: "Sarah Johnson",
      rating: 4.8,
      avatar: "SJ",
    },
    cost: 150,
    createdAt: "2025-08-25",
  },
  {
    id: "2",
    title: "Plumbing Repair",
    category: "Plumbing",
    description: "Fix leaking faucet in bathroom",
    location: "Home Office",
    date: "2025-08-31",
    time: "10:00",
    budget: 200,
    status: "scheduled",
    provider: {
      name: "Mike Wilson",
      rating: 4.9,
      avatar: "MW",
    },
    cost: 200,
    createdAt: "2025-08-24",
  },
  {
    id: "3",
    title: "Garden Maintenance",
    category: "Gardening",
    description: "Lawn mowing and hedge trimming",
    location: "Backyard",
    date: "2025-08-28",
    time: "09:00",
    status: "completed",
    provider: {
      name: "Green Thumb Co.",
      rating: 4.7,
      avatar: "GT",
    },
    cost: 120,
    createdAt: "2025-08-20",
  },
  {
    id: "4",
    title: "Electrical Installation",
    category: "Electrical",
    description: "Install new ceiling fan in bedroom",
    location: "Master Bedroom",
    date: "2025-09-05",
    time: "11:00",
    budget: 350,
    status: "active",
    createdAt: "2025-08-25",
  },
];

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

export default function MyJobsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs] = useState<Job[]>(mockJobs);

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
    </div>
  );
}
