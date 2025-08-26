import { NextResponse } from "next/server";
import { REVERSE_ROLE_MAPPING } from "@/types/user";
import type { BackendUserRole } from "@/types/user";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log("Login request received:", { email });

    // Validate credentials
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    try {
      // Forward the request to your NestJS backend
      const backendResponse = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await backendResponse.json();
      console.log("Backend login response:", data);

      if (backendResponse.ok && data.access_token) {
        // Map backend response to frontend expected format
        const userData = {
          id: data.userId,
          email: email,
          role:
            REVERSE_ROLE_MAPPING[data.role as BackendUserRole] || "customer", // Convert to frontend role
          token: data.access_token,
          refreshToken: data.refresh_token || "", // If backend provides refresh token
          name: email.split("@")[0], // Fallback name
          status: "Active" as const,
          verified: true,
          memberSince: new Date().toISOString(),
        };

        return NextResponse.json({
          success: true,
          message: "Login successful",
          data: userData,
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: data.message || "Invalid credentials",
          },
          { status: backendResponse.status }
        );
      }
    } catch (backendError) {
      console.error("Backend connection error:", backendError);

      // Fallback for development when backend is not running
      console.log("Falling back to demo login...");

      if (email.includes("@") && password.length >= 6) {
        let role: "admin" | "customer" | "provider" = "customer";
        if (email.includes("admin")) {
          role = "admin";
        } else if (
          email.includes("provider") ||
          email.includes("professional")
        ) {
          role = "provider";
        }

        const userData = {
          id: `demo_${Date.now()}`,
          name: email.split("@")[0],
          email,
          role,
          phone: "",
          location: "",
          status: "Active" as const,
          verified: true,
          memberSince: new Date().toISOString(),
          token: `demo_token_${Date.now()}`,
          refreshToken: `demo_refresh_${Date.now()}`,
        };

        return NextResponse.json({
          success: true,
          message: "Login successful (demo mode)",
          data: userData,
        });
      }

      return NextResponse.json(
        {
          success: false,
          message: "Backend service unavailable",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
