import { NextResponse } from "next/server";
import { headers } from "next/headers";

const BACKEND_URL = "http://localhost:3002/jobs";

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
    console.log("Creating new job posting with data:", body);

    // Validate required fields
    if (!body.title || !body.description || !body.category) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, description, and category are required",
        },
        { status: 400 }
      );
    }

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Backend post job response:", data);

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "Job posted successfully",
        data: data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to post job",
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error posting job:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
