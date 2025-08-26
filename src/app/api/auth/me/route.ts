import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    console.log("Get current user request received");

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
      // Forward the request to your NestJS backend
      const backendResponse = await fetch("http://localhost:4000/auth/me", {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });

      const data = await backendResponse.json();
      console.log("Backend get current user response:", data);

      if (backendResponse.ok) {
        // Map backend response to frontend expected format
        const userData = {
          id: data.id,
          email: data.email,
          name: data.firstName ? `${data.firstName} ${data.lastName}`.trim() : data.email.split("@")[0],
          role: data.role, // Already mapped in backend response
          phone: data.phone || "",
          location: data.location || "",
          status: "Active" as const,
          verified: data.verified || false,
          memberSince: data.createdAt || new Date().toISOString(),
          token: token,
        };

        return NextResponse.json({
          success: true,
          data: userData,
          message: "User data retrieved successfully",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: data.message || "Failed to get user data",
          },
          { status: backendResponse.status }
        );
      }
    } catch (backendError) {
      console.error("Backend connection error:", backendError);
      
      // Return error for protected route
      return NextResponse.json(
        {
          success: false,
          message: "Authentication service unavailable",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
