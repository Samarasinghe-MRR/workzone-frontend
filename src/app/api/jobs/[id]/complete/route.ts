import { NextResponse } from "next/server";
import { headers } from "next/headers";

const BACKEND_URL = "http://localhost:3002/jobs";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const jobId = params.id;
    console.log("Completing job with ID:", jobId);

    const response = await fetch(`${BACKEND_URL}/${jobId}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
    });

    const data = await response.json();
    console.log("Backend complete job response:", data);

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "Job completed successfully",
        data: data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to complete job",
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error completing job:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
