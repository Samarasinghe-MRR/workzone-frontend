"use client";

import { useState } from "react";
import { Search, MapPin, Clock, DollarSign, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Job {
  id: string;
  title: string;
  customerName: string;
  location: string;
  distance: string;
  timeRequested: string;
  budget: string;
  priority: "high" | "medium" | "low";
  postedTime: string;
  description: string;
  photos?: string[];
  requirements: string[];
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Electrical Installation",
    customerName: "Mike Johnson",
    location: "Downtown Business District",
    distance: "2.3 miles",
    timeRequested: "Today, 3:00 PM",
    budget: "$300-400",
    priority: "high",
    postedTime: "30 minutes ago",
    description: "Need electrical work for new office space. Installation of outlets, lighting fixtures, and circuit breaker updates.",
    requirements: ["Licensed electrician", "Own tools", "Available today"]
  },
  {
    id: "2",
    title: "Plumbing Repair",
    customerName: "Sarah Davis",
    location: "Residential Area",
    distance: "1.8 miles",
    timeRequested: "Tomorrow, 10:00 AM",
    budget: "$150-250",
    priority: "medium",
    postedTime: "2 hours ago",
    description: "Kitchen sink leak and bathroom faucet replacement needed.",
    requirements: ["Experience with sink repairs", "Morning availability"]
  },
  {
    id: "3",
    title: "Garden Maintenance",
    customerName: "John Smith",
    location: "Suburban Home",
    distance: "4.1 miles",
    timeRequested: "This Weekend",
    budget: "$200",
    priority: "low",
    postedTime: "1 day ago",
    description: "Lawn mowing, hedge trimming, and general garden cleanup for medium-sized property.",
    requirements: ["Own equipment", "Weekend availability"]
  }
];

export default function AvailableJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredJobs = mockJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendQuote = (jobId: string) => {
    console.log("Sending quote for job:", jobId);
    // Navigate to quotation form
  };

  if (selectedJob) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSelectedJob(null)}
          >
            ← Back to Jobs
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Job Details</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{selectedJob.title}</CardTitle>
                <p className="text-gray-600 mt-2">Posted by {selectedJob.customerName}</p>
              </div>
              <Badge className={getPriorityColor(selectedJob.priority)}>
                {selectedJob.priority.toUpperCase()} PRIORITY
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">{selectedJob.location}</p>
                  <p className="text-sm text-gray-500">{selectedJob.distance} away</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">{selectedJob.timeRequested}</p>
                  <p className="text-sm text-gray-500">Requested time</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">{selectedJob.budget}</p>
                  <p className="text-sm text-gray-500">Budget range</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{selectedJob.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <ul className="space-y-1">
                {selectedJob.requirements.map((req, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedJob.photos && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedJob.photos.map((photo, index) => (
                    <div key={index} className="aspect-square bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 flex-1"
                onClick={() => handleSendQuote(selectedJob.id)}
              >
                Send Quotation
              </Button>
              <Button variant="outline" className="flex-1">
                Save for Later
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <SortAsc className="w-4 h-4 mr-2" />
            Sort
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search jobs by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-md">
                <option value="">All Locations</option>
                <option value="downtown">Downtown</option>
                <option value="residential">Residential</option>
                <option value="suburban">Suburban</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md">
                <option value="">All Types</option>
                <option value="electrical">Electrical</option>
                <option value="plumbing">Plumbing</option>
                <option value="garden">Garden</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md">
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <Badge className={getPriorityColor(job.priority)}>
                  {job.priority}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm">by {job.customerName}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {job.location} • {job.distance}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {job.timeRequested}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  {job.budget}
                </div>
              </div>

              <p className="text-sm text-gray-700 line-clamp-2">
                {job.description}
              </p>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-gray-500">{job.postedTime}</span>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedJob(job)}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleSendQuote(job.id)}
                  >
                    Send Quote
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
