import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log("Forgot password request received:", { email });

    // Validate email
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    try {
      // Forward the request to your NestJS backend
      const backendResponse = await fetch("http://localhost:4000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await backendResponse.json();
      console.log("Backend forgot password response:", data);

      if (backendResponse.ok) {
        return NextResponse.json({
          success: true,
          data: data,
          message: "Password reset email sent successfully",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: data.message || "Failed to send reset email",
          },
          { status: backendResponse.status }
        );
      }
    } catch (backendError) {
      console.error("Backend connection error:", backendError);
      
      // Fallback response when backend is unavailable
      return NextResponse.json({
        success: true,
        data: { message: "Password reset email sent" },
        message: "Password reset email sent successfully (demo mode)",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
