import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// Use API Gateway URL
const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8081/api";
const USERS_URL = `${API_GATEWAY_URL}/users`;

export async function GET() {
  try {
    const headersList = await headers();
    const authorization = headersList.get("authorization");
    
    if (!authorization) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization header is required",
        },
        { status: 401 }
      );
    }

    console.log("Fetching user settings from API Gateway");

    const response = await fetch(`${USERS_URL}/me/settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
    });

    const data = await response.json();
    console.log("API Gateway settings response:", data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch settings",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const headersList = await headers();
    const authorization = headersList.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization header is required",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Updating settings via API Gateway:", body);

    const response = await fetch(`${USERS_URL}/me/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("API Gateway settings update response:", data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update settings",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
