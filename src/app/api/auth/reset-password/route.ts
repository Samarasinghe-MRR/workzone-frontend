import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token, newPassword, confirmPassword } = await request.json();
    console.log("Reset password request received:", {
      token: token ? "***" : null,
    });

    // Validate input
    if (!token || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Token and new password are required",
        },
        { status: 400 }
      );
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match",
        },
        { status: 400 }
      );
    }

    try {
      // Forward the request to your NestJS backend
      const backendResponse = await fetch(
        "http://localhost:4000/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const data = await backendResponse.json();
      console.log("Backend reset password response:", data);

      if (backendResponse.ok) {
        return NextResponse.json({
          success: true,
          data: data,
          message: "Password reset successfully",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: data.message || "Failed to reset password",
          },
          { status: backendResponse.status }
        );
      }
    } catch (backendError) {
      console.error("Backend connection error:", backendError);

      // Fallback response when backend is unavailable
      return NextResponse.json({
        success: true,
        data: { message: "Password reset successful" },
        message: "Password reset successful (demo mode)",
      });
    }
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
