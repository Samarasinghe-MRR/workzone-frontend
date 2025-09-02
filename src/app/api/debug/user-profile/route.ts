import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // Extract user ID from token
    const payload = JSON.parse(atob(token.split(".")[1]));
    const authUserId = payload.sub;

    console.log("Checking user data for authUserId:", authUserId);

    try {
      // Check user data via API Gateway
      const userResponse = await fetch(
        `http://localhost:8081/api/users/${authUserId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log("User data from backend:", userData);

        return NextResponse.json({
          success: true,
          data: {
            authUserId,
            jwtRole: payload.role,
            userData: userData,
          },
        });
      } else {
        const errorData = await userResponse.json();
        return NextResponse.json({
          success: false,
          message: "Failed to fetch user data",
          error: errorData,
          authUserId,
          jwtRole: payload.role,
        });
      }
    } catch (backendError) {
      console.error("Backend error:", backendError);
      return NextResponse.json({
        success: false,
        message: "Backend connection failed",
        error:
          backendError instanceof Error
            ? backendError.message
            : "Unknown backend error",
        authUserId,
        jwtRole: payload.role,
      });
    }
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
