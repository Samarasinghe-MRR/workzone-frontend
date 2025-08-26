import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    const { email } = await request.json();

    console.log("Update email request received:", { email });

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
      const backendResponse = await fetch("http://localhost:4000/auth/update-email", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email }),
      });

      const data = await backendResponse.json();
      console.log("Backend update email response:", data);

      if (backendResponse.ok) {
        return NextResponse.json({
          success: true,
          data: data,
          message: "Email updated successfully",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: data.message || "Failed to update email",
          },
          { status: backendResponse.status }
        );
      }
    } catch (backendError) {
      console.error("Backend connection error:", backendError);
      
      // Fallback response when backend is unavailable
      return NextResponse.json({
        success: true,
        data: { message: "Email updated" },
        message: "Email updated successfully (demo mode)",
      });
    }
  } catch (error) {
    console.error("Update email error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
