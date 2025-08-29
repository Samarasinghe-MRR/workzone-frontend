import { NextResponse } from "next/server";
import { headers } from "next/headers";

const BACKEND_URL = "http://localhost:3002/jobs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Build query string from search parameters
    const queryString = searchParams.toString();
    const url = queryString ? `${BACKEND_URL}?${queryString}` : BACKEND_URL;

    console.log("Fetching jobs from backend:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Backend jobs response:", data);

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch jobs",
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
    console.log("Creating job with data:", body);

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Backend create job response:", data);

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "Job created successfully",
        data: data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to create job",
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
