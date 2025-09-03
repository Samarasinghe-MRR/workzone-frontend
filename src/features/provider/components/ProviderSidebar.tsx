"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Briefcase,
  User,
  Calendar,
  MessageSquare,
  DollarSign,
  Star,
  Settings,
  Bell,
  MapPin,
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard/provider", icon: Home },
  { name: "Available Jobs", href: "/dashboard/provider/jobs", icon: Briefcase },
  { name: "My Schedule", href: "/dashboard/provider/schedule", icon: Calendar },
  { name: "Profile", href: "/dashboard/provider/profile", icon: User },
  {
    name: "Availability",
    href: "/dashboard/provider/availability",
    icon: MapPin,
  },
  {
    name: "Quotations",
    href: "/dashboard/provider/quotations",
    icon: MessageSquare,
  },
  { name: "Earnings", href: "/dashboard/provider/earnings", icon: DollarSign },
  { name: "Reviews", href: "/dashboard/provider/reviews", icon: Star },
  {
    name: "Notifications",
    href: "/dashboard/provider/notifications",
    icon: Bell,
  },
  { name: "Settings", href: "/dashboard/provider/settings", icon: Settings },
];

export function ProviderSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:block hidden">
      <div className="flex h-16 items-center px-6 border-b">
        <Briefcase className="h-8 w-8 text-emerald-600" />
        <span className="ml-2 text-xl font-semibold text-gray-900">
          Provider Hub
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
