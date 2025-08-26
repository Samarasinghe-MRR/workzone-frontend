"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Briefcase,
  Users,
  MessageSquare,
  CreditCard,
  Star,
  Plus,
  Bell,
  Settings,
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard/customer", icon: Home },
  { name: "Post a Job", href: "/dashboard/customer/post-job", icon: Plus },
  { name: "My Jobs", href: "/dashboard/customer/jobs", icon: Briefcase },
  {
    name: "Find Providers",
    href: "/dashboard/customer/providers",
    icon: Users,
  },
  {
    name: "Quotations",
    href: "/dashboard/customer/quotations",
    icon: MessageSquare,
  },
  { name: "Payments", href: "/dashboard/customer/payments", icon: CreditCard },
  { name: "Reviews", href: "/dashboard/customer/reviews", icon: Star },
  {
    name: "Notifications",
    href: "/dashboard/customer/notifications",
    icon: Bell,
  },
  { name: "Settings", href: "/dashboard/customer/settings", icon: Settings },
];

export function CustomerSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:block hidden">
      <div className="flex h-16 items-center px-6 border-b">
        <Briefcase className="h-8 w-8 text-emerald-600" />
        <span className="ml-2 text-xl font-semibold text-gray-900">
          Customer Portal
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
