"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  User,
  Phone,
  MessageSquare,
  Navigation,
  DollarSign,
  Calendar
} from "lucide-react";

interface JobStatus {
  id: string;
  title: string;
  customerName: string;
  customerPhone: string;
  location: string;
  amount: number;
  status: "assigned" | "in_progress" | "completed" | "cancelled";
  progress: number;
  estimatedCompletion: string;
  startedAt?: string;
  completedAt?: string;
  timeline: TimelineEvent[];
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "assignment" | "start" | "update" | "completion" | "payment";
  completed: boolean;
}

const mockJobs: JobStatus[] = [
  {
    id: "job-123",
    title: "Kitchen Deep Cleaning",
    customerName: "Sarah Johnson",
    customerPhone: "+1-555-0123",
    location: "Downtown Apartment Complex, Unit 4B",
    amount: 180,
    status: "in_progress",
    progress: 75,
    estimatedCompletion: "2025-09-03T15:00:00Z",
    startedAt: "2025-09-03T09:00:00Z",
    timeline: [
      {
        id: "1",
        title: "Job Assigned",
        description: "Quotation accepted by customer",
        timestamp: "2025-09-02T14:30:00Z",
        type: "assignment",
        completed: true
      },
      {
        id: "2", 
        title: "Work Started",
        description: "Arrived at location and began cleaning",
        timestamp: "2025-09-03T09:00:00Z",
        type: "start",
        completed: true
      },
      {
        id: "3",
        title: "Progress Update",
        description: "Kitchen appliances and countertops completed",
        timestamp: "2025-09-03T11:30:00Z",
        type: "update",
        completed: true
      },
      {
        id: "4",
        title: "Work Completion",
        description: "Final cleanup and inspection",
        timestamp: "2025-09-03T14:30:00Z",
        type: "completion",
        completed: false
      },
      {
        id: "5",
        title: "Payment Processing",
        description: "Customer confirms completion and payment is processed",
        timestamp: "2025-09-03T15:00:00Z",
        type: "payment",
        completed: false
      }
    ]
  },
  {
    id: "job-124",
    title: "Bathroom Renovation",
    customerName: "Mike Wilson",
    customerPhone: "+1-555-0456",
    location: "Suburban Home, 123 Oak Street",
    amount: 850,
    status: "assigned",
    progress: 0,
    estimatedCompletion: "2025-09-05T17:00:00Z",
    timeline: [
      {
        id: "1",
        title: "Job Assigned",
        description: "Quotation accepted by customer",
        timestamp: "2025-09-03T16:00:00Z",
        type: "assignment",
        completed: true
      },
      {
        id: "2",
        title: "Work Scheduled",
        description: "Start date confirmed for September 4th",
        timestamp: "2025-09-04T08:00:00Z",
        type: "start",
        completed: false
      },
      {
        id: "3",
        title: "Work Completion",
        description: "Bathroom renovation finished",
        timestamp: "2025-09-05T17:00:00Z",
        type: "completion",
        completed: false
      },
      {
        id: "4",
        title: "Payment Processing",
        description: "Customer confirms completion and payment is processed",
        timestamp: "2025-09-05T18:00:00Z",
        type: "payment",
        completed: false
      }
    ]
  }
];

export default function JobAssignmentStatus() {
  const [selectedJob, setSelectedJob] = useState<JobStatus | null>(null);
  const [jobs] = useState<JobStatus[]>(mockJobs);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "assigned":
        return <Clock className="w-4 h-4" />;
      case "in_progress":
        return <AlertCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "start":
        return <Clock className="w-4 h-4 text-green-600" />;
      case "update":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "completion":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "payment":
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Less than 1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const handleStartJob = (jobId: string) => {
    console.log("Starting job:", jobId);
    // Navigate to job start confirmation
  };

  const handleCompleteJob = (jobId: string) => {
    console.log("Completing job:", jobId);
    // Navigate to job completion form
  };

  const handleContactCustomer = (phone: string) => {
    console.log("Contacting customer:", phone);
    // Open phone dialer or messaging
  };

  const handleGetDirections = (location: string) => {
    console.log("Getting directions to:", location);
    // Open maps application
  };

  if (selectedJob) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setSelectedJob(null)}
            className="flex items-center"
          >
            ← Back to Jobs
          </Button>
          <Badge className={getStatusColor(selectedJob.status)}>
            {getStatusIcon(selectedJob.status)}
            <span className="ml-1 capitalize">{selectedJob.status.replace('_', ' ')}</span>
          </Badge>
        </div>

        {/* Job Details */}
        <Card>
          <CardHeader>
            <CardTitle>{selectedJob.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  {selectedJob.customerName}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {selectedJob.customerPhone}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {selectedJob.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  ${selectedJob.amount}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Due: {new Date(selectedJob.estimatedCompletion).toLocaleString()}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Progress</label>
                  <div className="mt-2">
                    <Progress value={selectedJob.progress} className="h-2" />
                    <p className="text-sm text-gray-600 mt-1">{selectedJob.progress}% complete</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactCustomer(selectedJob.customerPhone)}
                    className="flex items-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGetDirections(selectedJob.location)}
                    className="flex items-center"
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    Directions
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Job Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedJob.timeline.map((event, index) => (
                <div key={event.id} className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    event.completed ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {getTimelineIcon(event.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${
                        event.completed ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {event.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {event.completed ? formatTimeAgo(event.timestamp) : 'Upcoming'}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      event.completed ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {event.description}
                    </p>
                  </div>
                  
                  {index < selectedJob.timeline.length - 1 && (
                    <div className="absolute left-4 mt-8 w-0.5 h-6 bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end space-x-4">
              {selectedJob.status === "assigned" && (
                <Button
                  onClick={() => handleStartJob(selectedJob.id)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Start Job
                </Button>
              )}
              
              {selectedJob.status === "in_progress" && (
                <Button
                  onClick={() => handleCompleteJob(selectedJob.id)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Complete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
        <Badge className="bg-blue-100 text-blue-800">
          {jobs.length} active jobs
        </Badge>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <Card 
            key={job.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedJob(job)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <Badge className={getStatusColor(job.status)}>
                  {getStatusIcon(job.status)}
                  <span className="ml-1 capitalize">{job.status.replace('_', ' ')}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  {job.customerName}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  ${job.amount}
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{job.progress}%</span>
                  </div>
                  <Progress value={job.progress} className="h-2" />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-500">
                    Due: {new Date(job.estimatedCompletion).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactCustomer(job.customerPhone);
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetDirections(job.location);
                      }}
                    >
                      <Navigation className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No active jobs
            </h3>
            <p className="text-gray-600">
              Your assigned jobs will appear here once customers accept your quotations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
