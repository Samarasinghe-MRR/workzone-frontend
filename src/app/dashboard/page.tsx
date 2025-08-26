"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user role
      switch (user.role) {
        case "admin":
          router.replace("/dashboard/admin");
          break;
        case "customer":
          router.replace("/dashboard/customer");
          break;
        case "provider":
          router.replace("/dashboard/provider");
          break;
        default:
          router.replace("/dashboard/customer"); // Default fallback
      }
    } else if (!isLoading && !user) {
      router.replace("/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Redirecting to your dashboard...
        </h2>
        <p className="text-gray-600 mt-2">
          Please wait while we load your personalized experience.
        </p>
      </div>
    </div>
  );
}
