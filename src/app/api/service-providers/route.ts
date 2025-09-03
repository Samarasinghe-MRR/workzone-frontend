import { NextResponse } from "next/server";
import type { GetServiceProvidersParams } from "@/types/serviceProviders";

// Helper function to get mock data
function getMockProviders() {
  return [
    {
      id: "sp-1",
      userId: "user-1",
      businessName: "Pro Services LLC",
      category: "Electrical",
      experienceYears: 10,
      location: "123 Business St, New York, NY",
      latitude: 40.7128,
      longitude: -74.006,
      serviceRadius: 25,
      averageResponseTime: 2,
      rating: 4.8,
      availability: true,
      isAvailable: true,
      createdAt: "2020-08-01T00:00:00Z",
      user: {
        firstName: "Alex",
        lastName: "Johnson",
        email: "alex@example.com",
        phone: "+1-555-0123",
        isVerified: true,
      },
      completedJobs: 127,
      hourlyRate: 85,
      specializations: [
        {
          id: "spec-1",
          providerId: "sp-1",
          categoryId: "electrical",
          isActive: true,
          category: {
            id: "electrical",
            name: "Electrical Work",
            description: "Professional electrical services",
          },
        },
      ],
    },
    {
      id: "sp-2",
      userId: "user-2",
      businessName: "Clean Pro Services",
      category: "Cleaning",
      experienceYears: 5,
      location: "456 Service Ave, New York, NY",
      latitude: 40.7589,
      longitude: -73.9851,
      serviceRadius: 20,
      averageResponseTime: 1,
      rating: 4.9,
      availability: true,
      isAvailable: true,
      createdAt: "2021-03-15T00:00:00Z",
      user: {
        firstName: "Sarah",
        lastName: "Williams",
        email: "sarah@example.com",
        phone: "+1-555-0124",
        isVerified: true,
      },
      completedJobs: 89,
      hourlyRate: 35,
      specializations: [
        {
          id: "spec-2",
          providerId: "sp-2",
          categoryId: "cleaning",
          isActive: true,
          category: {
            id: "cleaning",
            name: "House Cleaning",
            description: "Professional cleaning services",
          },
        },
      ],
    },
  ];
}

export async function GET(request: Request) {
  try {
    console.log("Service providers API called");
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    const { searchParams } = new URL(request.url);

    console.log("Get service providers request received");
    console.log("Token present:", !!token);
    console.log("Token length:", token?.length || 0);

    // Extract query parameters
    const sortByParam = searchParams.get("sortBy") as
      | "rating"
      | "distance"
      | "price"
      | "experience";

    // Map frontend sortBy to backend sortBy
    let backendSortBy: "rating" | "experienceYears" | "createdAt" = "rating";
    switch (sortByParam) {
      case "rating":
        backendSortBy = "rating";
        break;
      case "experience":
        backendSortBy = "experienceYears";
        break;
      case "distance":
      case "price":
      default:
        backendSortBy = "rating"; // Default fallback
        break;
    }

    const params: GetServiceProvidersParams = {
      category: searchParams.get("category") || undefined,
      location: searchParams.get("location") || undefined,
      latitude: searchParams.get("latitude")
        ? parseFloat(searchParams.get("latitude")!)
        : undefined,
      longitude: searchParams.get("longitude")
        ? parseFloat(searchParams.get("longitude")!)
        : undefined,
      radius: searchParams.get("radius")
        ? parseFloat(searchParams.get("radius")!)
        : undefined,
      minRating: searchParams.get("minRating")
        ? parseFloat(searchParams.get("minRating")!)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? parseFloat(searchParams.get("maxPrice")!)
        : undefined,
      availability: searchParams.get("availability")
        ? searchParams.get("availability") === "true"
        : undefined,
      search: searchParams.get("search") || undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : 20,
      sortBy: sortByParam || "rating",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    };

    console.log("Service providers query params:", params);

    try {
      // Build query string for backend - map frontend params to backend params
      const backendParams = {
        category: params.category,
        location: params.location,
        latitude: params.latitude,
        longitude: params.longitude,
        radius: params.radius,
        minRating: params.minRating,
        maxPrice: params.maxPrice,
        availability: params.availability,
        search: params.search,
        page: params.page,
        limit: params.limit,
        sortBy: backendSortBy, // Use the mapped sortBy
        sortOrder: params.sortOrder,
      };

      const queryString = new URLSearchParams();
      Object.entries(backendParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryString.append(key, value.toString());
        }
      });

      console.log(
        "🚀 Forwarding request to API Gateway:",
        `http://localhost:8081/api/service-providers?${queryString.toString()}`
      );

      // Forward the request to API Gateway - correct endpoint for service providers
      const backendResponse = await fetch(
        `http://localhost:8081/api/service-providers?${queryString.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      const data = await backendResponse.json();
      console.log("✅ Backend service providers response:", data);

      if (backendResponse.ok) {
        // Backend returns the result directly (with data, total, hasMore, etc.)
        return NextResponse.json({
          success: true,
          data: {
            providers: data.data || [],
            total: data.total || 0,
            hasMore: data.hasMore || false,
            page: data.page || 1,
            limit: data.limit || 20,
          },
          message: "Service providers fetched successfully from backend",
        });
      } else {
        console.log("❌ Backend returned error:", data.message);
        return NextResponse.json(
          {
            success: false,
            data: null,
            message: data.message || "Backend error",
            error: data,
          },
          { status: backendResponse.status }
        );
      }
    } catch (fetchError) {
      console.error("🔥 Failed to connect to backend:", fetchError);

      // Return mock data when backend is not available
      const mockProviders = getMockProviders();
      return NextResponse.json({
        success: true,
        data: {
          providers: mockProviders,
          total: mockProviders.length,
          hasMore: false,
          page: 1,
          limit: 20,
        },
        message: "Backend unavailable, using mock data",
        backendError:
          fetchError instanceof Error ? fetchError.message : "Unknown error",
      });
    }
  } catch (error) {
    console.error("💥 Error fetching service providers:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
