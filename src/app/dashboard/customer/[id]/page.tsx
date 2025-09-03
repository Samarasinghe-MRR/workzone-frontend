"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { gatewayServices } from "@/lib/gatewayApi";

interface CustomerPageProps {
  params: Promise<{ id: string }>;
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role: string;
  memberSince?: string;
  // Add more customer-specific fields as needed
}

export default function CustomerPage({ params }: CustomerPageProps) {
  const router = useRouter();
  const { id } = use(params); // Unwrap the Promise using React.use()
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);

        // Use the dashboard endpoint that provides comprehensive user data
        // This matches your backend's GET /users/me/dashboard endpoint
        try {
          const dashboardResponse =
            await gatewayServices.users.get<CustomerData>(
              "/me/dashboard",
              true
            );

          if (dashboardResponse) {
            setCustomerData(dashboardResponse);
            return;
          }
        } catch (dashboardError) {
          console.log(
            "Dashboard endpoint failed, trying customer-data endpoint:",
            dashboardError
          );
        }

        // Fallback: Use the comprehensive customer data endpoint
        const response = await gatewayServices.users.get<CustomerData>(
          `/${id}/customer-data`,
          true
        );

        if (response) {
          setCustomerData(response);
        }
      } catch (err) {
        console.error("Error fetching customer data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch customer data"
        );

        // Redirect to main customer dashboard if user not found or unauthorized
        router.push("/dashboard/customer");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomerData();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !customerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error || "Customer not found"}</p>
          <button
            onClick={() => router.push("/dashboard/customer")}
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
        {/* This will use the existing CustomerSidebar from layout */}
        <main className="flex-1 lg:ml-64">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Customer Profile
                  </h1>
                  <button
                    onClick={() => router.push("/dashboard/customer")}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Back to Dashboard
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 w-24">
                          ID:
                        </span>
                        <span className="text-gray-600 font-mono text-sm">
                          {customerData.id}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 w-24">
                          Name:
                        </span>
                        <span className="text-gray-600">
                          {customerData.name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 w-24">
                          Email:
                        </span>
                        <span className="text-gray-600">
                          {customerData.email}
                        </span>
                      </div>
                      {customerData.phone && (
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-24">
                            Phone:
                          </span>
                          <span className="text-gray-600">
                            {customerData.phone}
                          </span>
                        </div>
                      )}
                      {customerData.location && (
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-24">
                            Location:
                          </span>
                          <span className="text-gray-600">
                            {customerData.location}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 w-24">
                          Role:
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {customerData.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() =>
                          router.push("/dashboard/customer/post-job")
                        }
                        className="w-full bg-emerald-600 text-white py-3 px-4 rounded hover:bg-emerald-700 transition-colors"
                      >
                        Post a New Job
                      </button>
                      <button
                        onClick={() => router.push("/dashboard/customer/jobs")}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition-colors"
                      >
                        View My Jobs
                      </button>
                      <button
                        onClick={() =>
                          router.push("/dashboard/customer/providers")
                        }
                        className="w-full bg-purple-600 text-white py-3 px-4 rounded hover:bg-purple-700 transition-colors"
                      >
                        Find Providers
                      </button>
                      <button
                        onClick={() =>
                          router.push("/dashboard/customer/settings")
                        }
                        className="w-full bg-gray-600 text-white py-3 px-4 rounded hover:bg-gray-700 transition-colors"
                      >
                        Account Settings
                      </button>
                    </div>
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
                      customer&apos;s job history and interactions.
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
