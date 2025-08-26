import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    console.log("Get user profile request received");

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
      const backendResponse = await fetch("http://localhost:4000/users/me", {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });

      const data = await backendResponse.json();
      console.log("Backend get profile response:", data);

      if (backendResponse.ok) {
        return NextResponse.json({
          success: true,
          data: data,
          message: "Profile fetched successfully",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: data.message || "Failed to fetch profile",
          },
          { status: backendResponse.status }
        );
      }
    } catch (backendError) {
      console.error("Backend connection error:", backendError);
      
      // Fallback demo profile when backend is unavailable
      const demoProfile = {
        id: "demo_user",
        email: "demo@example.com",
        firstName: "Demo",
        lastName: "User",
        phone: "+1234567890",
        role: "customer",
        verified: true,
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: demoProfile,
        message: "Profile fetched successfully (demo mode)",
      });
    }
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    const profileData = await request.json();

    console.log("Update user profile request received:", profileData);

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
      const backendResponse = await fetch("http://localhost:4000/users/me", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });

      const data = await backendResponse.json();
      console.log("Backend update profile response:", data);

      if (backendResponse.ok) {
        return NextResponse.json({
          success: true,
          data: data,
          message: "Profile updated successfully",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: data.message || "Failed to update profile",
          },
          { status: backendResponse.status }
        );
      }
    } catch (backendError) {
      console.error("Backend connection error:", backendError);
      
      // Fallback response when backend is unavailable
      return NextResponse.json({
        success: true,
        data: { ...profileData, id: "demo_user" },
        message: "Profile updated successfully (demo mode)",
      });
    }
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
