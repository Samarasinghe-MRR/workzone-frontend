"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Navigation,
  Phone,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScheduledJob {
  id: string;
  title: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  location: string;
  address: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  payment: string;
  duration: string;
  notes?: string;
}

const mockScheduledJobs: ScheduledJob[] = [
  {
    id: "1",
    title: "Kitchen Deep Cleaning",
    customerName: "Emma Wilson",
    customerPhone: "+1 (555) 123-4567",
    date: "2025-08-25",
    time: "2:00 PM - 4:00 PM",
    location: "Downtown Apartment",
    address: "123 Main St, Downtown",
    status: "scheduled",
    payment: "$150",
    duration: "2 hours",
    notes: "Customer prefers eco-friendly products",
  },
  {
    id: "2",
    title: "Garden Maintenance",
    customerName: "John Smith",
    customerPhone: "+1 (555) 987-6543",
    date: "2025-08-25",
    time: "10:00 AM - 12:00 PM",
    location: "Suburban Home",
    address: "456 Oak Ave, Suburbia",
    status: "in-progress",
    payment: "$120",
    duration: "2 hours",
  },
  {
    id: "3",
    title: "Electrical Installation",
    customerName: "Mike Johnson",
    customerPhone: "+1 (555) 456-7890",
    date: "2025-08-26",
    time: "9:00 AM - 11:00 AM",
    location: "Office Building",
    address: "789 Business Rd, Downtown",
    status: "scheduled",
    payment: "$350",
    duration: "2 hours",
  },
  {
    id: "4",
    title: "Plumbing Repair",
    customerName: "Sarah Davis",
    customerPhone: "+1 (555) 321-0987",
    date: "2025-08-24",
    time: "3:00 PM - 4:00 PM",
    location: "Residential Home",
    address: "321 Elm Street, Hometown",
    status: "completed",
    payment: "$200",
    duration: "1 hour",
  },
];

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [selectedDate, setSelectedDate] = useState<string>("2025-08-25");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleMarkCompleted = (jobId: string) => {
    console.log("Marking job as completed:", jobId);
    // Update job status to completed
  };

  const handleCancelJob = (jobId: string) => {
    if (window.confirm("Are you sure you want to cancel this job?")) {
      console.log("Cancelling job:", jobId);
      // Update job status to cancelled
    }
  };

  const handleNavigate = (address: string) => {
    // Open in maps application
    window.open(
      `https://maps.google.com?q=${encodeURIComponent(address)}`,
      "_blank"
    );
  };

  const filteredJobs = mockScheduledJobs.filter((job) =>
    viewMode === "calendar" ? job.date === selectedDate : true
  );

  const todayJobs = mockScheduledJobs.filter(
    (job) => job.date === "2025-08-25"
  );
  const upcomingJobs = mockScheduledJobs.filter(
    (job) => new Date(job.date) > new Date("2025-08-25")
  );
  const completedJobs = mockScheduledJobs.filter(
    (job) => job.status === "completed"
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            onClick={() => setViewMode("calendar")}
            size="sm"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Calendar
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            size="sm"
          >
            <Clock className="w-4 h-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Today&apos;s Jobs
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayJobs.length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {upcomingJobs.length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedJobs.length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Today&apos;s Earnings
                </p>
                <p className="text-2xl font-bold text-gray-900">$270</p>
              </div>
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-emerald-600 font-bold">$</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {viewMode === "calendar" && (
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <span className="text-sm text-gray-600">
                {filteredJobs.length} job(s) on this date
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <Badge className={getStatusColor(job.status)}>
                      {getStatusIcon(job.status)}
                      <span className="ml-1">
                        {job.status.replace("-", " ")}
                      </span>
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      {job.customerName}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {job.date} • {job.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-4 h-4 mr-2 text-emerald-600 font-bold">
                        $
                      </span>
                      {job.payment} • {job.duration}
                    </div>
                  </div>
                  {job.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">
                      Note: {job.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigate(job.address)}
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Navigate
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-1" />
                  Call Customer
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Message
                </Button>
                {job.status === "scheduled" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleMarkCompleted(job.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark Completed
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleCancelJob(job.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </>
                )}
                {job.status === "in-progress" && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleMarkCompleted(job.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Mark Completed
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs scheduled
            </h3>
            <p className="text-gray-600">
              {viewMode === "calendar"
                ? "No jobs found for the selected date."
                : "You don't have any scheduled jobs at the moment."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
