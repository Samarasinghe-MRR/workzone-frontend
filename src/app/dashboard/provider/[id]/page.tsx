"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApiClient } from "@/lib/api";

interface ProviderPageProps {
  params: { id: string };
}

interface ProviderData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  businessName?: string;
  businessAddress?: string;
  role: string;
  rating?: number;
  completedJobs?: number;
  memberSince?: string;
  // Add more provider-specific fields as needed
}

export default function ProviderPage({ params }: ProviderPageProps) {
  const router = useRouter();
  const { id } = params;
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        setLoading(true);

        // First check if this is the current user's own profile
        // If so, use /users/me for better security and caching
        try {
          const currentUserResponse = await authApiClient.get<{
            data: ProviderData;
          }>("/users/me", true);
          if (currentUserResponse.data && currentUserResponse.data.id === id) {
            setProviderData(currentUserResponse.data);
            return;
          }
        } catch {
          console.log(
            "Could not fetch current user, proceeding with ID-based fetch"
          );
        }

        // Fetch provider-specific data using the ID
        const response = await authApiClient.get<{ data: ProviderData }>(
          `/users/${id}`,
          true
        );

        if (response.data) {
          setProviderData(response.data);
        }
      } catch (err) {
        console.error("Error fetching provider data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch provider data"
        );

        // Redirect to main provider dashboard if user not found or unauthorized
        router.push("/dashboard/provider");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProviderData();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !providerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error || "Provider not found"}</p>
          <button
            onClick={() => router.push("/dashboard/provider")}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* This will use the existing ProviderSidebar from layout */}
        <main className="flex-1 lg:ml-64">
          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Provider Profile
                  </h1>
                  <button
                    onClick={() => router.push("/dashboard/provider")}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Back to Dashboard
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Information */}
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Provider Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-20">
                            ID:
                          </span>
                          <span className="text-gray-600 font-mono text-sm">
                            {providerData.id}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-20">
                            Name:
                          </span>
                          <span className="text-gray-600">
                            {providerData.name}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-20">
                            Email:
                          </span>
                          <span className="text-gray-600">
                            {providerData.email}
                          </span>
                        </div>
                        {providerData.phone && (
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700 w-20">
                              Phone:
                            </span>
                            <span className="text-gray-600">
                              {providerData.phone}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        {providerData.businessName && (
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700 w-24">
                              Business:
                            </span>
                            <span className="text-gray-600">
                              {providerData.businessName}
                            </span>
                          </div>
                        )}
                        {providerData.location && (
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700 w-24">
                              Location:
                            </span>
                            <span className="text-gray-600">
                              {providerData.location}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-24">
                            Role:
                          </span>
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm">
                            {providerData.role}
                          </span>
                        </div>
                        {providerData.rating && (
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700 w-24">
                              Rating:
                            </span>
                            <div className="flex items-center">
                              <span className="text-yellow-500">
                                ⭐ {providerData.rating}
                              </span>
                              {providerData.completedJobs && (
                                <span className="text-gray-500 ml-2">
                                  ({providerData.completedJobs} jobs)
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => router.push("/dashboard/provider/jobs")}
                        className="w-full bg-emerald-600 text-white py-3 px-4 rounded hover:bg-emerald-700 transition-colors"
                      >
                        View Available Jobs
                      </button>
                      <button
                        onClick={() =>
                          router.push("/dashboard/provider/quotations")
                        }
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition-colors"
                      >
                        My Quotations
                      </button>
                      <button
                        onClick={() =>
                          router.push("/dashboard/provider/schedule")
                        }
                        className="w-full bg-purple-600 text-white py-3 px-4 rounded hover:bg-purple-700 transition-colors"
                      >
                        Schedule
                      </button>
                      <button
                        onClick={() =>
                          router.push("/dashboard/provider/earnings")
                        }
                        className="w-full bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 transition-colors"
                      >
                        Earnings
                      </button>
                      <button
                        onClick={() =>
                          router.push("/dashboard/provider/settings")
                        }
                        className="w-full bg-gray-600 text-white py-3 px-4 rounded hover:bg-gray-700 transition-colors"
                      >
                        Settings
                      </button>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <h4 className="font-medium text-emerald-900 mb-2">
                      Completed Jobs
                    </h4>
                    <p className="text-2xl font-bold text-emerald-600">
                      {providerData.completedJobs || 0}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Average Rating
                    </h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {providerData.rating
                        ? `${providerData.rating}/5.0`
                        : "No ratings yet"}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-medium text-purple-900 mb-2">
                      Member Since
                    </h4>
                    <p className="text-lg font-medium text-purple-600">
                      {providerData.memberSince || "Recent"}
                    </p>
                  </div>
                </div>

                {/* Recent Activity Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600">
                      Recent activity will be displayed here based on the
                      provider&apos;s job applications and completed work.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
