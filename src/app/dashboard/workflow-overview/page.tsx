"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  DollarSign,
  FileText, 
  MessageSquare,
  Star,
  User,
  Users,
  Zap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "completed" | "in-progress" | "pending";
  demoUrl: string;
  userType: "customer" | "provider" | "both";
}

const workflowSteps: WorkflowStep[] = [
  {
    id: "post-job",
    title: "1. Post a Job",
    description: "Customer creates a detailed job posting with requirements and budget",
    icon: FileText,
    status: "completed",
    demoUrl: "/dashboard/customer/post-job",
    userType: "customer"
  },
  {
    id: "browse-jobs",
    title: "2. Browse Jobs",
    description: "Service providers discover and view available job opportunities",
    icon: Users,
    status: "completed",
    demoUrl: "/dashboard/provider/available-jobs",
    userType: "provider"
  },
  {
    id: "send-quotation",
    title: "3. Send Quotation",
    description: "Provider submits detailed quotation with pricing and timeline",
    icon: DollarSign,
    status: "completed",
    demoUrl: "/dashboard/provider/send-quotation/demo-job-123",
    userType: "provider"
  },
  {
    id: "review-quotations",
    title: "4. Review Quotations",
    description: "Customer compares quotations and selects preferred provider",
    icon: CheckCircle,
    status: "completed",
    demoUrl: "/dashboard/customer/quotations",
    userType: "customer"
  },
  {
    id: "job-assignment",
    title: "5. Job Assignment",
    description: "Job is assigned to selected provider with timeline tracking",
    icon: Clock,
    status: "completed",
    demoUrl: "/dashboard/provider/my-jobs",
    userType: "provider"
  },
  {
    id: "complete-job",
    title: "6. Complete Job",
    description: "Provider marks job as complete with documentation and photos",
    icon: Zap,
    status: "completed",
    demoUrl: "/dashboard/provider/complete-job/demo-job-123",
    userType: "provider"
  },
  {
    id: "confirm-completion",
    title: "7. Confirm Completion",
    description: "Customer reviews completed work and provides feedback",
    icon: Star,
    status: "completed",
    demoUrl: "/dashboard/customer/confirm-completion/demo-job-123",
    userType: "customer"
  },
  {
    id: "messaging",
    title: "8. Communication",
    description: "Real-time messaging between customers and providers",
    icon: MessageSquare,
    status: "in-progress",
    demoUrl: "/dashboard/notifications",
    userType: "both"
  }
];

const uiStats = [
  {
    label: "UI Components Created",
    value: "15+",
    icon: FileText,
    color: "bg-blue-500"
  },
  {
    label: "Workflow Steps",
    value: "8",
    icon: CheckCircle,
    color: "bg-green-500"
  },
  {
    label: "Demo Pages",
    value: "12",
    icon: Star,
    color: "bg-purple-500"
  },
  {
    label: "Mock Data Sets",
    value: "6",
    icon: Users,
    color: "bg-orange-500"
  }
];

function StatusBadge({ status }: { status: WorkflowStep["status"] }) {
  const variants = {
    completed: "bg-green-100 text-green-800",
    "in-progress": "bg-yellow-100 text-yellow-800", 
    pending: "bg-gray-100 text-gray-800"
  };

  const labels = {
    completed: "✅ Complete",
    "in-progress": "🔄 In Progress",
    pending: "⏳ Pending"
  };

  return (
    <Badge className={variants[status]}>
      {labels[status]}
    </Badge>
  );
}

function UserTypeBadge({ userType }: { userType: WorkflowStep["userType"] }) {
  const variants = {
    customer: "bg-blue-100 text-blue-800",
    provider: "bg-emerald-100 text-emerald-800",
    both: "bg-purple-100 text-purple-800"
  };

  return (
    <Badge className={variants[userType]}>
      {userType === "both" ? "Customer + Provider" : userType.charAt(0).toUpperCase() + userType.slice(1)}
    </Badge>
  );
}

export default function WorkflowOverview() {
  const [filter, setFilter] = useState<"all" | "customer" | "provider">("all");

  const filteredSteps = workflowSteps.filter(step => 
    filter === "all" || step.userType === filter || step.userType === "both"
  );

  return (
    <DashboardLayout 
      title="WorkZone UI Workflow Overview" 
      subtitle="Complete user journey from job posting to completion - All UI components ready for backend integration"
    >
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {uiStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Implementation Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-6 w-6 text-green-600" />
              Implementation Status
            </CardTitle>
            <CardDescription>
              Complete UI workflow implementation with mock data for user experience testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">✅ Completed</h4>
                <p className="text-sm text-green-700 mt-1">
                  All core UI components with full user flows and mock data integration
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-900">🔄 In Progress</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Real-time messaging and advanced notification features
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">⏭️ Next Phase</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Backend API integration and authentication flow
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Controls */}
        <div className="flex space-x-4">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="flex items-center"
          >
            <User className="mr-2 h-4 w-4" />
            All Steps
          </Button>
          <Button
            variant={filter === "customer" ? "default" : "outline"}
            onClick={() => setFilter("customer")}
            className="flex items-center"
          >
            <User className="mr-2 h-4 w-4" />
            Customer Journey
          </Button>
          <Button
            variant={filter === "provider" ? "default" : "outline"}
            onClick={() => setFilter("provider")}
            className="flex items-center"
          >
            <Users className="mr-2 h-4 w-4" />
            Provider Journey
          </Button>
        </div>

        {/* Workflow Steps */}
        <div className="grid gap-6">
          {filteredSteps.map((step, index) => (
            <Card key={step.id} className="transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-emerald-100 rounded-lg">
                      <step.icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {step.title}
                        </h3>
                        <StatusBadge status={step.status} />
                        <UserTypeBadge userType={step.userType} />
                      </div>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      
                      <Link href={step.demoUrl}>
                        <Button className="inline-flex items-center">
                          Try Demo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  {index < filteredSteps.length - 1 && (
                    <div className="hidden lg:block">
                      <ArrowRight className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Key UI Features Implemented</CardTitle>
            <CardDescription>
              Comprehensive user interface components ready for backend integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">📝 Forms & Input</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Job posting form with validation</li>
                  <li>• Quotation builder with pricing</li>
                  <li>• Job completion documentation</li>
                  <li>• Review and rating system</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">📊 Data Display</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Job listings with filtering</li>
                  <li>• Progress tracking timelines</li>
                  <li>• Notification center</li>
                  <li>• Dashboard analytics</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">🔄 User Flow</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Role-based navigation</li>
                  <li>• Workflow state management</li>
                  <li>• Inter-page navigation</li>
                  <li>• Status tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">🚀 Ready for Backend Integration</CardTitle>
            <CardDescription className="text-blue-700">
              All UI components are complete with mock data - perfect foundation for API integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-blue-800">
                <strong>Next Steps:</strong> Replace mock data with actual API calls, implement authentication, 
                add real-time functionality, and deploy the complete solution.
              </p>
              
              <div className="flex space-x-4">
                <Link href="/dashboard/notifications">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    View Notifications Demo
                  </Button>
                </Link>
                <Link href="/dashboard/provider/send-quotation/demo-job-123">
                  <Button variant="outline" className="border-blue-600 text-blue-600">
                    Try Quotation Flow
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
