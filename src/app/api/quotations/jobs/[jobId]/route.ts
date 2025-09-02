import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobId = params.jobId;
    
    // Get JWT token from cookies or headers
    const token = request.cookies.get("token")?.value || 
                  request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Authentication required" 
        },
        { status: 401 }
      );
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    console.log("Fetching quotations for job:", jobId);
    
    const response = await fetch(`http://localhost:8081/api/quotations/jobs/${jobId}/quotes`, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    console.log("Job quotations response:", response.status, data);

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || "Failed to fetch job quotations",
          error: data.error 
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data || data,
      message: "Job quotations fetched successfully"
    });

  } catch (error) {
    console.error("Error fetching job quotations:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
