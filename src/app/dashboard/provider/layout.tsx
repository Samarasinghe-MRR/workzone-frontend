"use client";

import { ReactNode } from "react";
import { ProviderSidebar } from "@/features/provider/components/ProviderSidebar";

interface ProviderLayoutProps {
  children: ReactNode;
}

export default function ProviderLayout({ children }: ProviderLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <ProviderSidebar />
        <main className="flex-1 lg:ml-64">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
