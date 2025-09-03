"use client";

import { ReactNode } from "react";
import { CustomerSidebar } from "@/features/customer/components/CustomerSidebar";

interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <CustomerSidebar />
        <main className="flex-1 lg:ml-64">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
