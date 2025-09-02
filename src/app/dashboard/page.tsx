"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  DollarSign,
  FileText, 
  Star,
  Users,
  Zap,
  Eye,
  Code,
  Layers
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";

const quickAccessCards = [
  {
    title: "🎯 Complete Workflow Overview",
    description: "See all UI components and user flows in one place",
    href: "/dashboard/workflow-overview",
    icon: Layers,
    color: "bg-purple-500",
    badge: "New"
  },
  {
    title: "📝 Send Quotation Demo", 
    description: "Experience the provider quotation workflow",
    href: "/dashboard/provider/send-quotation/demo-job-123",
    icon: DollarSign,
    color: "bg-green-500",
    badge: "Ready"
  },
  {
    title: "✅ Job Completion Demo",
    description: "Try the complete job finishing process", 
    href: "/dashboard/provider/complete-job/demo-job-123",
    icon: CheckCircle,
    color: "bg-blue-500",
    badge: "Ready"
  },
  {
    title: "⭐ Customer Review Demo",
    description: "Experience the completion review flow",
    href: "/dashboard/customer/confirm-completion/demo-job-123", 
    icon: Star,
    color: "bg-yellow-500",
    badge: "Ready"
  },
  {
    title: "🔔 Notifications Center",
    description: "Real-time notification management",
    href: "/dashboard/notifications",
    icon: Clock,
    color: "bg-red-500",
    badge: "Live"
  },
  {
    title: "📊 Job Tracking Demo",
    description: "Provider job status and timeline tracking",
    href: "/dashboard/provider/my-jobs",
    icon: Zap,
    color: "bg-indigo-500", 
    badge: "Ready"
  }
];

const roleBasedAccess = [
  {
    role: "Customer",
    description: "Post jobs, review quotations, track progress",
    href: "/dashboard/customer",
    icon: Users,
    features: ["Job Posting", "Quotation Review", "Progress Tracking", "Payment Management"]
  },
  {
    role: "Service Provider", 
    description: "Find jobs, send quotations, complete work",
    href: "/dashboard/provider",
    icon: FileText,
    features: ["Job Discovery", "Quotation Builder", "Job Completion", "Timeline Tracking"]
  }
];

const implementationStatus = [
  { feature: "Job Posting UI", status: "complete", icon: FileText },
  { feature: "Quotation System", status: "complete", icon: DollarSign },
  { feature: "Job Completion", status: "complete", icon: CheckCircle },
  { feature: "Review System", status: "complete", icon: Star },
  { feature: "Notifications", status: "complete", icon: Clock },
  { feature: "Timeline Tracking", status: "complete", icon: Zap },
  { feature: "Real-time Messaging", status: "in-progress", icon: Users },
  { feature: "Backend Integration", status: "pending", icon: Code }
];

export default function DashboardPage() {
  return (
    <DashboardLayout 
      title="WorkZone Dashboard" 
      subtitle="Complete UI workflow demonstration - Ready for backend integration"
    >
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎉 UI Implementation Complete!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              All core user interface components are ready. Experience the complete workflow 
              from job posting to completion with interactive demos.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/dashboard/workflow-overview">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  <Eye className="mr-2 h-5 w-5" />
                  View Complete Workflow
                </Button>
              </Link>
              <Link href="/dashboard/provider/send-quotation/demo-job-123">
                <Button size="lg" variant="outline">
                  <Star className="mr-2 h-5 w-5" />
                  Try Demo Flow
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Quick Access Demos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickAccessCards.map((card) => (
              <Card key={card.title} className="transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${card.color}`}>
                      <card.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge className="text-xs">
                      {card.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={card.href}>
                    <Button className="w-full">
                      Try Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Role-Based Access */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">👥 Role-Based Dashboards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roleBasedAccess.map((role) => (
              <Card key={role.role}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <role.icon className="h-8 w-8 text-emerald-600" />
                    <div>
                      <CardTitle>{role.role}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {role.features.map((feature) => (
                        <div key={feature} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Link href={role.href}>
                      <Button className="w-full">
                        Access {role.role} Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Implementation Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-6 w-6 text-green-600" />
              Implementation Status
            </CardTitle>
            <CardDescription>
              Track the progress of UI component development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {implementationStatus.map((item) => (
                <div key={item.feature} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <item.icon className={`h-5 w-5 ${
                    item.status === 'complete' ? 'text-green-600' :
                    item.status === 'in-progress' ? 'text-yellow-600' : 'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.feature}</p>
                    <p className={`text-xs ${
                      item.status === 'complete' ? 'text-green-600' :
                      item.status === 'in-progress' ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      {item.status === 'complete' ? '✅ Complete' :
                       item.status === 'in-progress' ? '🔄 In Progress' : '⏳ Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">🎯 What&apos;s Next?</CardTitle>
            <CardDescription className="text-blue-700">
              UI development phase complete - Ready for backend integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">✅ Phase 1: UI Complete</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• All user interfaces built</li>
                    <li>• Complete workflow demos</li>
                    <li>• Mock data integration</li>
                    <li>• User experience testing ready</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">🔄 Phase 2: Backend Integration</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• API endpoint integration</li>
                    <li>• Authentication implementation</li>
                    <li>• Real-time data updates</li>
                    <li>• Database connectivity</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">🚀 Phase 3: Deployment</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Production deployment</li>
                    <li>• Performance optimization</li>
                    <li>• Security implementation</li>
                    <li>• Monitoring & analytics</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <Link href="/dashboard/workflow-overview">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Explore Complete Workflow
                  </Button>
                </Link>
                <Link href="/dashboard/notifications">
                  <Button variant="outline" className="border-blue-600 text-blue-600">
                    View Notifications Demo
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
