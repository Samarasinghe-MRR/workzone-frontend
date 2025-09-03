import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    console.log("Debug: Getting user info");
    console.log("Debug: Token present:", !!token);
    console.log("Debug: Token length:", token?.length || 0);

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
      // Get user info from API Gateway
      const userResponse = await fetch("http://localhost:8081/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await userResponse.json();
      console.log("Debug: User API response status:", userResponse.status);
      console.log("Debug: User data:", userData);

      if (userResponse.ok) {
        return NextResponse.json({
          success: true,
          data: userData,
          message: "User info fetched successfully",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: userData.message || "Failed to fetch user info",
            details: userData,
          },
          { status: userResponse.status }
        );
      }
    } catch (backendError) {
      console.error("Debug: Backend connection error:", backendError);

      return NextResponse.json(
        {
          success: false,
          message: "Backend connection failed",
          error:
            backendError instanceof Error
              ? backendError.message
              : "Unknown error",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Debug: Error getting user info:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
