"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  Briefcase,
  Plus,
  Clock,
  CheckCircle,
  MapPin,
  DollarSign,
  Star,
  Calendar,
  ArrowRight,
  Users,
  CreditCard,
  Bell,
  Settings,
} from "lucide-react";
import Link from "next/link";

export function CustomerDashboard() {
  // Get real user data
  const { user, isLoading } = useAuth();

  // Mock data - replace with actual API calls
  const currentJobs = [
    {
      id: "1",
      title: "Kitchen Deep Cleaning",
      provider: "Sarah Johnson",
      providerAvatar: "/api/placeholder/32/32",
      status: "in-progress",
      scheduledDate: "Today, 2:00 PM",
      location: "Downtown Apartment",
      budget: 150,
    },
    {
      id: "2",
      title: "Plumbing Repair",
      provider: "Mike Wilson",
      providerAvatar: "/api/placeholder/32/32",
      status: "scheduled",
      scheduledDate: "Tomorrow, 10:00 AM",
      location: "Home Office",
      budget: 200,
    },
  ];

  const recentQuotations = [
    {
      id: "1",
      jobTitle: "Electrical Installation",
      provider: "Tom Anderson",
      amount: 350,
      status: "pending",
      receivedAt: "2 hours ago",
    },
    {
      id: "2",
      jobTitle: "Garden Maintenance",
      provider: "Lisa Green",
      amount: 120,
      status: "pending",
      receivedAt: "5 hours ago",
    },
  ];

  const stats = {
    activeJobs: 2,
    completedJobs: 12,
    totalSpent: 2450,
    savedProviders: 8,
  };

  // Show loading state while fetching user data
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Customer'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here&apos;s what&apos;s happening with your jobs today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/customer/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/customer/post-job">
              <Plus className="mr-2 h-4 w-4" />
              Post a Job
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Jobs
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedJobs}</div>
            <p className="text-xs text-muted-foreground">
              Successfully finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSpent}</div>
            <p className="text-xs text-muted-foreground">Across all services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saved Providers
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.savedProviders}</div>
            <p className="text-xs text-muted-foreground">In your favorites</p>
          </CardContent>
        </Card>
      </div>

      {/* Current & Upcoming Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Current & Upcoming Jobs</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/customer/jobs">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={job.providerAvatar} />
                        <AvatarFallback>
                          {job.provider
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.provider}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="mr-1 h-3 w-3" />
                          {job.scheduledDate}
                          <MapPin className="ml-3 mr-1 h-3 w-3" />
                          {job.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          job.status === "in-progress"
                            ? "default"
                            : job.status === "scheduled"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {job.status === "in-progress"
                          ? "In Progress"
                          : job.status === "scheduled"
                          ? "Scheduled"
                          : "Pending"}
                      </Badge>
                      <p className="text-sm font-medium mt-1">${job.budget}</p>
                    </div>
                  </div>
                ))}

                {currentJobs.length === 0 && (
                  <div className="text-center py-8">
                    <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No active jobs
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by posting your first job.
                    </p>
                    <Button className="mt-4" asChild>
                      <Link href="/dashboard/customer/post-job">
                        <Plus className="mr-2 h-4 w-4" />
                        Post a Job
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Recent Quotations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Quotations</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/customer/quotations">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentQuotations.map((quote) => (
                  <div
                    key={quote.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-sm">{quote.jobTitle}</h4>
                      <p className="text-xs text-gray-600">{quote.provider}</p>
                      <p className="text-xs text-gray-500">
                        {quote.receivedAt}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${quote.amount}</p>
                      <Badge variant="secondary" className="text-xs">
                        Pending
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
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
                <Link href="/dashboard/customer/providers">
                  <Users className="mr-2 h-4 w-4" />
                  Browse Providers
                </Link>
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <Link href="/dashboard/customer/jobs">
                  <Clock className="mr-2 h-4 w-4" />
                  Track Jobs
                </Link>
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <Link href="/dashboard/customer/payments">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment History
                </Link>
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <Link href="/dashboard/customer/reviews">
                  <Star className="mr-2 h-4 w-4" />
                  Leave Reviews
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Recent Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">New quotation received</p>
                <p className="text-xs text-gray-600">
                  Tom Anderson sent a quote for Electrical Installation - $350
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Job completed</p>
                <p className="text-xs text-gray-600">
                  Bathroom Cleaning job was marked as completed by Maria Lopez
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Provider on the way</p>
                <p className="text-xs text-gray-600">
                  Sarah Johnson is heading to your location for Kitchen Deep
                  Cleaning
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
