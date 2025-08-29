import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();
    console.log("Refresh token request received");

    // Validate refresh token
    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token is required",
        },
        { status: 400 }
      );
    }

    try {
      // Forward the request to your NestJS backend
      const backendResponse = await fetch(
        "http://localhost:4000/auth/refresh",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }
      );

      const data = await backendResponse.json();
      console.log("Backend refresh token response:", data);

      if (backendResponse.ok) {
        return NextResponse.json({
          success: true,
          data: {
            token: data.access_token,
            refreshToken: data.refresh_token || refreshToken,
          },
          message: "Token refreshed successfully",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: data.message || "Failed to refresh token",
          },
          { status: backendResponse.status }
        );
      }
    } catch (backendError) {
      console.error("Backend connection error:", backendError);

      // Return error for refresh token - no fallback for security
      return NextResponse.json(
        {
          success: false,
          message: "Authentication service unavailable",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
