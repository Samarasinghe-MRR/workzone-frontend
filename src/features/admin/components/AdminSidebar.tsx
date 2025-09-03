"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  Briefcase,
  UserCheck,
  CreditCard,
  BarChart3,
  Settings,
  Home,
  Bell,
  Shield,
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard/admin", icon: Home },
  { name: "User Management", href: "/dashboard/admin/users", icon: Users },
  {
    name: "Provider Verification",
    href: "/dashboard/admin/verification",
    icon: UserCheck,
  },
  { name: "Job Management", href: "/dashboard/admin/jobs", icon: Briefcase },
  { name: "Payments", href: "/dashboard/admin/payments", icon: CreditCard },
  {
    name: "Reports & Analytics",
    href: "/dashboard/admin/analytics",
    icon: BarChart3,
  },
  { name: "Notifications", href: "/dashboard/admin/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:block hidden">
      <div className="flex h-16 items-center px-6 border-b">
        <Shield className="h-8 w-8 text-emerald-600" />
        <span className="ml-2 text-xl font-semibold text-gray-900">
          Admin Panel
        </span>
      </div>

      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
