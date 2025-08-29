"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApiClient } from "@/lib/api";

interface AdminPageProps {
  params: { id: string };
}

interface AdminData {
  id: string;
  name: string;
  email: string;
  role: string;
  // Add more admin-specific fields as needed
}

export default function AdminPage({ params }: AdminPageProps) {
  const router = useRouter();
  const { id } = params;
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);

        // First check if this is the current user's own profile
        // If so, use /users/me for better security and caching
        try {
          const currentUserResponse = await authApiClient.get<{
            data: AdminData;
          }>("/users/me", true);
          if (currentUserResponse.data && currentUserResponse.data.id === id) {
            setAdminData(currentUserResponse.data);
            return;
          }
        } catch {
          console.log(
            "Could not fetch current user, proceeding with ID-based fetch"
          );
        }

        // Fetch admin-specific data using the ID
        const response = await authApiClient.get<{ data: AdminData }>(
          `/users/${id}`,
          true
        );

        if (response.data) {
          setAdminData(response.data);
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch admin data"
        );

        // Redirect to main admin dashboard if user not found or unauthorized
        router.push("/dashboard/admin");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAdminData();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error || "Admin not found"}</p>
          <button
            onClick={() => router.push("/dashboard/admin")}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
            <button
              onClick={() => router.push("/dashboard/admin")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back to Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Admin Information
              </h3>
              <div className="space-y-2">
                <p>
                  <strong>ID:</strong> {adminData.id}
                </p>
                <p>
                  <strong>Name:</strong> {adminData.name}
                </p>
                <p>
                  <strong>Email:</strong> {adminData.email}
                </p>
                <p>
                  <strong>Role:</strong> {adminData.role}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Admin Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700">
                  Manage Users
                </button>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                  View Analytics
                </button>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
                  System Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
