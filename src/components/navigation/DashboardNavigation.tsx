"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Bell, 
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Star,
  User,
  Users,
  Briefcase,
  DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  description: string;
}

interface NavigationSectionProps {
  title: string;
  items: NavigationItem[];
  currentPath: string;
}

const customerNavigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard/customer",
    icon: Home,
    description: "Overview of your jobs and activity"
  },
  {
    name: "Post a Job",
    href: "/dashboard/customer/post-job",
    icon: FileText,
    description: "Create a new job posting"
  },
  {
    name: "My Jobs",
    href: "/dashboard/customer/jobs",
    icon: Briefcase,
    description: "Track your posted jobs"
  },
  {
    name: "Find Providers",
    href: "/dashboard/customer/providers",
    icon: Users,
    description: "Browse service providers"
  },
  {
    name: "Quotations",
    href: "/dashboard/customer/quotations",
    icon: DollarSign,
    badge: 3,
    description: "Review received quotations"
  },
  {
    name: "Messages",
    href: "/dashboard/customer/messages",
    icon: MessageSquare,
    badge: 2,
    description: "Chat with service providers"
  },
  {
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    badge: 5,
    description: "View all notifications"
  }
];

const providerNavigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard/provider",
    icon: Home,
    description: "Overview of your jobs and earnings"
  },
  {
    name: "Available Jobs",
    href: "/dashboard/provider/available-jobs",
    icon: Clock,
    description: "Browse and quote on jobs"
  },
  {
    name: "My Jobs",
    href: "/dashboard/provider/my-jobs",
    icon: Briefcase,
    badge: 2,
    description: "Track your assigned jobs"
  },
  {
    name: "Quotations",
    href: "/dashboard/provider/quotations",
    icon: FileText,
    description: "Manage your quotations"
  },
  {
    name: "Schedule",
    href: "/dashboard/provider/schedule",
    icon: Calendar,
    description: "View your work schedule"
  },
  {
    name: "Reviews",
    href: "/dashboard/provider/reviews",
    icon: Star,
    description: "Customer reviews and ratings"
  },
  {
    name: "Messages",
    href: "/dashboard/provider/messages",
    icon: MessageSquare,
    badge: 1,
    description: "Chat with customers"
  },
  {
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    badge: 3,
    description: "View all notifications"
  }
];

const commonNavigation: NavigationItem[] = [
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
    description: "Manage your profile"
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Account settings"
  }
];

function NavigationSection({ title, items, currentPath }: NavigationSectionProps) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = currentPath === item.href || currentPath.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-emerald-100 text-emerald-900"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <item.icon
                className={`flex-shrink-0 mr-3 h-5 w-5 ${
                  isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-500"
                }`}
              />
              <span className="flex-1">{item.name}</span>
              {item.badge && item.badge > 0 && (
                <Badge className="ml-2 bg-red-100 text-red-800 text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardNavigation() {
  const pathname = usePathname();
  const [userRole] = useState<"customer" | "provider">("customer"); // Mock role, would come from auth context

  // Mock workflow demonstration links
  const workflowDemos: NavigationItem[] = [
    {
      name: "🎯 Send Quotation Demo",
      href: "/dashboard/provider/send-quotation/demo-job-123",
      icon: FileText,
      description: "Try the quotation form workflow"
    },
    {
      name: "✅ Complete Job Demo", 
      href: "/dashboard/provider/complete-job/demo-job-123",
      icon: CheckCircle,
      description: "Experience job completion process"
    },
    {
      name: "🔍 Review Completion Demo",
      href: "/dashboard/customer/confirm-completion/demo-job-123", 
      icon: Star,
      description: "Customer completion review flow"
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4 mb-6">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">W</span>
          </div>
          <span className="ml-2 text-xl font-bold text-gray-900">WorkZone</span>
        </div>
      </div>

      <div className="px-3">
        {/* Role Indicator */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900 capitalize">
              {userRole} Dashboard
            </span>
          </div>
        </div>

        {/* Main Navigation */}
        <NavigationSection
          title="Main"
          items={userRole === "customer" ? customerNavigation : providerNavigation}
          currentPath={pathname}
        />

        {/* Workflow Demos */}
        <NavigationSection
          title="UI Flow Demos"
          items={workflowDemos}
          currentPath={pathname}
        />

        {/* Common Navigation */}
        <NavigationSection
          title="Account"
          items={commonNavigation}
          currentPath={pathname}
        />

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-emerald-50 rounded-lg">
          <h4 className="text-sm font-medium text-emerald-900 mb-2">Quick Stats</h4>
          <div className="space-y-2 text-sm text-emerald-700">
            {userRole === "customer" ? (
              <>
                <div className="flex justify-between">
                  <span>Active Jobs:</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Spent:</span>
                  <span className="font-medium">$1,240</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span>Jobs Completed:</span>
                  <span className="font-medium">127</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <span className="font-medium">4.8 ⭐</span>
                </div>
                <div className="flex justify-between">
                  <span>This Month:</span>
                  <span className="font-medium">$2,450</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Workflow Status */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">UI Status</h4>
          <div className="space-y-1 text-xs text-blue-700">
            <div className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
              <span>Job Posting ✅</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
              <span>Quotation Form ✅</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
              <span>Job Completion ✅</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
              <span>Notifications ✅</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1 text-yellow-600" />
              <span>Backend Integration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
