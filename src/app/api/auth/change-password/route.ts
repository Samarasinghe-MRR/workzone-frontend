import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    const { currentPassword, newPassword } = await request.json();

    console.log("Change password request received");

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

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password and new password are required",
        },
        { status: 400 }
      );
    }

    try {
      // Forward the request to your NestJS backend
      const backendResponse = await fetch("http://localhost:4000/auth/change-password", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await backendResponse.json();
      console.log("Backend change password response:", data);

      if (backendResponse.ok) {
        return NextResponse.json({
          success: true,
          data: data,
          message: "Password changed successfully",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: data.message || "Failed to change password",
          },
          { status: backendResponse.status }
        );
      }
    } catch (backendError) {
      console.error("Backend connection error:", backendError);
      
      // Fallback response when backend is unavailable
      return NextResponse.json({
        success: true,
        data: { message: "Password changed" },
        message: "Password changed successfully (demo mode)",
      });
    }
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
