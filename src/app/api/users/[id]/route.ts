import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    const { id } = params;

    console.log(`Get user by ID request received for ID: ${id}`);

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

    // Validate ID format (basic UUID check)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID format",
        },
        { status: 400 }
      );
    }

    try {
      // Forward the request to your NestJS backend
      const backendResponse = await fetch(`http://localhost:4000/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await backendResponse.json();
      console.log(`Backend get user by ID response:`, data);

      if (backendResponse.ok) {
        return NextResponse.json({
          success: true,
          data: data,
          message: "User data fetched successfully",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: data.message || "Failed to fetch user data",
          },
          { status: backendResponse.status }
        );
      }
    } catch (backendError) {
      console.error("Backend connection error:", backendError);

      // Return mock data for development if backend is not available
      const mockUserData = {
        id: id,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        location: "New York, NY",
        businessName: "Pro Services LLC",
        businessAddress: "123 Business St, New York, NY 10001",
        role: "provider", // This should be determined based on the request context
        rating: 4.8,
        completedJobs: 127,
        memberSince: "August 2020",
        createdAt: "2020-08-01T00:00:00Z",
        updatedAt: new Date().toISOString(),
      };

      console.log("Backend unavailable, returning mock data for development");

      return NextResponse.json({
        success: true,
        data: mockUserData,
        message: "User data fetched successfully (mock data)",
      });
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
