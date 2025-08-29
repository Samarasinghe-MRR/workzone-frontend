import { NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:3002/jobs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Add status filter for available jobs (open/pending)
    searchParams.set("status", "OPEN");

    // Build query string from search parameters
    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}?${queryString}`;

    console.log("Fetching available jobs from backend:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Backend available jobs response:", data);

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch available jobs",
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error fetching available jobs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
