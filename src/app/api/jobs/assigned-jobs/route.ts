import { NextResponse } from "next/server";
import { headers } from "next/headers";

const BACKEND_URL = "http://localhost:3002/jobs/assigned-jobs";

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // Build query string if status is provided
    const queryString = status ? `?status=${encodeURIComponent(status)}` : "";
    const url = `${BACKEND_URL}${queryString}`;

    console.log("Fetching assigned jobs from backend:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
    });

    const data = await response.json();
    console.log("Backend assigned jobs response:", data);

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch assigned jobs",
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error fetching assigned jobs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
