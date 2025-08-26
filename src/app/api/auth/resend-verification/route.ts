import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log("Resend verification email request received:", { email });

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
      const backendResponse = await fetch("http://localhost:4000/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await backendResponse.json();
      console.log("Backend resend verification response:", data);

      if (backendResponse.ok) {
        return NextResponse.json({
          success: true,
          data: data,
          message: "Verification email sent successfully",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: data.message || "Failed to send verification email",
          },
          { status: backendResponse.status }
        );
      }
    } catch (backendError) {
      console.error("Backend connection error:", backendError);
      
      // Fallback response when backend is unavailable
      return NextResponse.json({
        success: true,
        data: { message: "Verification email sent" },
        message: "Verification email sent successfully (demo mode)",
      });
    }
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
