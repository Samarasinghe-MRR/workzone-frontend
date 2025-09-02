import { NextResponse } from "next/server";
import { ROLE_MAPPING } from "@/types/user";
import type { FrontendUserRole } from "@/types/user";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Signup request received:", body);
    console.log(
      "Individual fields - name:",
      body.name,
      "email:",
      body.email,
      "password:",
      !!body.password,
      "role:",
      body.role
    );

    // Validate required fields
    const { name, email, password, role, phone } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, password, and role are required",
        },
        { status: 400 }
      );
    }

    // Split name into firstName and lastName for backend
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Map frontend data to backend expected format
    // Map frontend roles to backend enum values using imported mapping
    const backendData = {
      email,
      password,
      firstName,
      lastName,
      phone: phone || "",
      role:
        ROLE_MAPPING[role.toLowerCase() as FrontendUserRole] ||
        ROLE_MAPPING.customer,
    };

    console.log("Sending to backend:", backendData);

    // Forward the request to API Gateway instead of direct service call
    const backendResponse = await fetch(
      "http://localhost:8081/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backendData),
      }
    );

    const data = await backendResponse.json();
    console.log("Backend response:", data);

    if (backendResponse.ok) {
      return NextResponse.json({
        success: true,
        message:
          "Account created successfully! Please check your email for verification.",
        data: data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Registration failed",
        },
        { status: backendResponse.status }
      );
    }
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to backend service",
      },
      { status: 500 }
    );
  }
}
