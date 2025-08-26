"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Briefcase,
  DollarSign,
  Star,
  Clock,
  MapPin,
  Calendar,
  TrendingUp,
  Eye,
  MessageSquare,
  Navigation,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export function ProviderDashboard() {
  // Mock data - replace with actual API calls
  const todayJobs = [
    {
      id: "1",
      title: "Kitchen Deep Cleaning",
      customer: "Emma Wilson",
      customerAvatar: "/api/placeholder/32/32",
      time: "2:00 PM - 4:00 PM",
      location: "Downtown Apartment, 123 Main St",
      price: 150,
      status: "accepted",
    },
    {
      id: "2",
      title: "Garden Maintenance",
      customer: "John Smith",
      customerAvatar: "/api/placeholder/32/32",
      time: "10:00 AM - 12:00 PM",
      location: "Suburban Home, 456 Oak Ave",
      price: 120,
      status: "in-progress",
    },
  ];

  const availableJobs = [
    {
      id: "3",
      title: "Electrical Installation",
      customer: "Mike Johnson",
      location: "Office Building, 789 Business Blvd",
      distance: "2.3 miles",
      budget: 350,
      urgency: "high",
      postedAt: "30 minutes ago",
    },
    {
      id: "4",
      title: "Plumbing Repair",
      customer: "Sarah Davis",
      location: "Home, 321 Elm Street",
      distance: "1.8 miles",
      budget: 200,
      urgency: "medium",
      postedAt: "2 hours ago",
    },
  ];

  const stats = {
    todayEarnings: 270,
    weeklyEarnings: 1420,
    monthlyEarnings: 5680,
    rating: 4.8,
    completedJobs: 127,
    responseRate: 95,
  };

  const isAvailable = true;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Good morning, Alex!
          </h1>
          <p className="text-gray-600 mt-1">Ready to start earning today?</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Available for jobs</span>
            <Switch checked={isAvailable} />
          </div>
          <Badge variant={isAvailable ? "default" : "secondary"}>
            {isAvailable ? "Available" : "Offline"}
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.todayEarnings}
            </div>
            <p className="text-xs text-muted-foreground">
              From 2 completed jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weekly Earnings
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.weeklyEarnings}</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rating}</div>
            <p className="text-xs text-muted-foreground">
              From {stats.completedJobs} jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseRate}%</div>
            <p className="text-xs text-muted-foreground">
              Excellent response time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule & Available Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Today&apos;s Schedule
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/provider/schedule">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={job.customerAvatar} />
                      <AvatarFallback>
                        {job.customer
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.customer}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="mr-1 h-3 w-3" />
                        {job.time}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="mr-1 h-3 w-3" />
                        {job.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        job.status === "in-progress"
                          ? "default"
                          : job.status === "accepted"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {job.status === "in-progress"
                        ? "In Progress"
                        : job.status === "accepted"
                        ? "Accepted"
                        : "Pending"}
                    </Badge>
                    <p className="text-sm font-medium mt-1">${job.price}</p>
                    {job.status === "accepted" && (
                      <Button size="sm" className="mt-2">
                        <Navigation className="mr-1 h-3 w-3" />
                        Navigate
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {todayJobs.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No jobs scheduled
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Check available jobs to find work opportunities.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Available Jobs Nearby
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/provider/jobs">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableJobs.map((job) => (
                <div key={job.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.customer}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="mr-1 h-3 w-3" />
                        {job.location}
                        <span className="ml-2">• {job.distance}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {job.postedAt}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          job.urgency === "high"
                            ? "destructive"
                            : job.urgency === "medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {job.urgency} priority
                      </Badge>
                      <p className="text-lg font-bold mt-1">${job.budget}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" className="flex-1">
                      <MessageSquare className="mr-1 h-3 w-3" />
                      Send Quote
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="mr-1 h-3 w-3" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Overview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Earnings Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${stats.todayEarnings}
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${stats.weeklyEarnings}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${stats.monthlyEarnings}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Available for withdrawal
                  </span>
                  <span className="font-medium">
                    ${(stats.weeklyEarnings * 0.85).toFixed(2)}
                  </span>
                </div>
                <Button className="w-full mt-3" asChild>
                  <Link href="/dashboard/provider/earnings">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Withdraw Earnings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Job Success Rate</span>
                <span className="font-medium">98%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Rating</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{stats.rating}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Rate</span>
                <span className="font-medium">{stats.responseRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed Jobs</span>
                <span className="font-medium">{stats.completedJobs}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <Link href="/dashboard/provider/availability">
                  <Clock className="mr-2 h-4 w-4" />
                  Update Availability
                </Link>
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <Link href="/dashboard/provider/profile">
                  <Star className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <Link href="/dashboard/provider/reviews">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View Reviews
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">
                  Job completed successfully
                </p>
                <p className="text-xs text-gray-600">
                  Garden Maintenance job was completed and payment received
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">New job request received</p>
                <p className="text-xs text-gray-600">
                  Emma Wilson requested a quote for Kitchen Deep Cleaning
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">
                  Reminder: Job starting soon
                </p>
                <p className="text-xs text-gray-600">
                  Kitchen Deep Cleaning job starts in 30 minutes
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
