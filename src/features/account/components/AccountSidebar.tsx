"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  User,
  Lock,
  Shield,
  Bell,
  CreditCard,
  X,
  Building,
  Wallet,
  BarChart3,
  Trash2,
} from "lucide-react";

const sidebarItems = [
  { label: "Profile", href: "/account", icon: User },
  { label: "Password", href: "/account/password", icon: Lock },
  { label: "Account Security", href: "/account/security", icon: Shield },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
  { label: "Billing Info", href: "/account/billing", icon: CreditCard },
  { label: "Cancel a Task", href: "/account/cancel-task", icon: X },
  { label: "Business Information", href: "/account/business", icon: Building },
  { label: "Account Balance", href: "/account/balance", icon: Wallet },
  { label: "Transactions", href: "/account/transactions", icon: BarChart3 },
  { label: "Delete Account", href: "/account/delete", icon: Trash2 },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <Card className="p-0 overflow-hidden">
      <nav className="space-y-0">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium border-b last:border-b-0 transition-all duration-200",
                isActive
                  ? "text-emerald-700 bg-emerald-50 border-r-2 border-r-emerald-600 shadow-sm"
                  : "text-muted-foreground hover:text-emerald-600 hover:bg-muted/50"
              )}
            >
              <IconComponent className="mr-3 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </Card>
  );
}
