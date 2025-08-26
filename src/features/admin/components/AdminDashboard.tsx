"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Briefcase,
  UserCheck,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useAdminStats } from "@/features/admin/hooks/useAdminStats";
import { useRecentActivity } from "@/features/admin/hooks/useRecentActivity";

export function AdminDashboard() {
  const { stats, isLoading: statsLoading } = useAdminStats();
  const { activities, isLoading: activitiesLoading } = useRecentActivity();

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            Real-time View
          </Button>
          <Button>
            <TrendingUp className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.totalCustomers || 0} customers,{" "}
              {stats?.totalProviders || 0} providers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeJobs || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Verifications
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats?.pendingVerifications || 0}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats?.monthlyRevenue?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center"
              >
                <UserCheck className="h-6 w-6 mb-2 text-orange-600" />
                <span className="text-sm">Review Providers</span>
                <Badge variant="secondary" className="mt-1">
                  {stats?.pendingVerifications || 0} pending
                </Badge>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center"
              >
                <AlertCircle className="h-6 w-6 mb-2 text-red-600" />
                <span className="text-sm">Handle Disputes</span>
                <Badge variant="destructive" className="mt-1">
                  3 urgent
                </Badge>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center"
              >
                <DollarSign className="h-6 w-6 mb-2 text-green-600" />
                <span className="text-sm">Process Payments</span>
                <Badge variant="secondary" className="mt-1">
                  {stats?.pendingPayments || 0} pending
                </Badge>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center"
              >
                <TrendingUp className="h-6 w-6 mb-2 text-blue-600" />
                <span className="text-sm">View Analytics</span>
                <Badge variant="secondary" className="mt-1">
                  Updated
                </Badge>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activitiesLoading
                ? [...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 animate-pulse"
                    >
                      <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))
                : activities?.map((activity: { type: string; title: string; time: string }, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "success"
                            ? "bg-green-500"
                            : activity.type === "warning"
                            ? "bg-orange-500"
                            : activity.type === "error"
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">API Status</span>
                <Badge className="bg-green-100 text-green-800">
                  Operational
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payment Gateway</span>
                <Badge className="bg-green-100 text-green-800">
                  Operational
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Notifications</span>
                <Badge className="bg-green-100 text-green-800">
                  Operational
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database</span>
                <Badge className="bg-green-100 text-green-800">
                  Operational
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Service Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Home Cleaning</span>
                <span className="text-sm font-medium">42 jobs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Handyman</span>
                <span className="text-sm font-medium">38 jobs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Plumbing</span>
                <span className="text-sm font-medium">29 jobs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Electrical</span>
                <span className="text-sm font-medium">24 jobs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Moving</span>
                <span className="text-sm font-medium">18 jobs</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="text-sm font-medium">
                  ${stats?.totalRevenue?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Commission (15%)</span>
                <span className="text-sm font-medium">
                  ${((stats?.totalRevenue || 0) * 0.15).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="text-sm font-medium text-green-600">
                  ${stats?.monthlyRevenue?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Growth Rate</span>
                <span className="text-sm font-medium text-green-600">
                  +12.4%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
