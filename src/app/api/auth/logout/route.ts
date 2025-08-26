import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    console.log("Logout request received");

    try {
      // Forward the request to your NestJS backend
      const backendResponse = await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });

      const data = await backendResponse.json().catch(() => ({}));
      console.log("Backend logout response:", data);

      if (backendResponse.ok) {
        return NextResponse.json({
          success: true,
          message: "Logged out successfully",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: data.message || "Failed to logout",
          },
          { status: backendResponse.status }
        );
      }
    } catch (backendError) {
      console.error("Backend connection error:", backendError);
      
      // Always return success for logout - even if backend fails
      return NextResponse.json({
        success: true,
        message: "Logged out successfully (local)",
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
    
    // Always return success for logout to clear local state
    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  }
}
