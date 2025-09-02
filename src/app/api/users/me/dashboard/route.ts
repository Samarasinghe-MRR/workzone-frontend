import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    console.log("Get user dashboard request received");

    // Validate token
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization token is required",
        },
        { status: 401 }
      );
    }

    try {
      // Forward the request to your NestJS User Service backend
      const backendResponse = await fetch(
        "http://localhost:3001/users/me/dashboard",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await backendResponse.json();
      console.log("Backend dashboard response:", data);

      if (backendResponse.ok) {
        return NextResponse.json({
          success: true,
          data: data,
          message: "Dashboard data fetched successfully",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: data.message || "Failed to fetch dashboard data",
          },
          { status: backendResponse.status }
        );
      }
    } catch (backendError) {
      console.error("Backend connection error:", backendError);

      // Return mock dashboard data for development/testing
      const mockDashboardData = {
        user: {
          id: "mock-user-id",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          role: "CUSTOMER",
        },
        statistics: {
          totalJobs: 5,
          completedJobs: 3,
          totalSpent: 1250.0,
          completionRate: 60,
          averageRating: 4.5,
          totalEarned: 0,
        },
        jobs: {
          posted: [
            {
              id: "1",
              title: "House Cleaning",
              status: "COMPLETED",
              budget: 150,
              createdAt: "2024-01-15T10:00:00Z",
              completedAt: "2024-01-16T14:30:00Z",
            },
            {
              id: "2",
              title: "Garden Maintenance",
              status: "IN_PROGRESS",
              budget: 200,
              createdAt: "2024-01-20T09:00:00Z",
            },
          ],
          assigned: [],
          completed: [],
        },
        quotations: {
          received: [
            {
              id: "1",
              jobId: "2",
              providerName: "Green Thumb Services",
              amount: 180,
              status: "PENDING",
              submittedAt: "2024-01-20T15:30:00Z",
            },
          ],
          submitted: [],
        },
        recentActivity: [
          {
            id: "1",
            type: "JOB_POSTED",
            description: "Posted job: Garden Maintenance",
            timestamp: "2024-01-20T09:00:00Z",
          },
          {
            id: "2",
            type: "JOB_COMPLETED",
            description: "Completed job: House Cleaning",
            timestamp: "2024-01-16T14:30:00Z",
          },
        ],
      };

      return NextResponse.json({
        success: true,
        data: mockDashboardData,
        message:
          "Dashboard data fetched successfully (mock data - backend unavailable)",
      });
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
