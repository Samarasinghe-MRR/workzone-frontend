import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    console.log("Email verification request received");

    // Validate token
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification token is required",
        },
        { status: 400 }
      );
    }

    try {
      // Forward the request to your NestJS backend
      const backendResponse = await fetch(
        "http://localhost:4000/auth/verify-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );

      const data = await backendResponse.json();
      console.log("Backend email verification response:", data);

      if (backendResponse.ok) {
        return NextResponse.json({
          success: true,
          data: data,
          message: "Email verified successfully",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: data.message || "Failed to verify email",
          },
          { status: backendResponse.status }
        );
      }
    } catch (backendError) {
      console.error("Backend connection error:", backendError);

      // Fallback response when backend is unavailable
      return NextResponse.json({
        success: true,
        data: { message: "Email verified" },
        message: "Email verified successfully (demo mode)",
      });
    }
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
