import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { quotationId: string } }
) {
  try {
    const quotationId = params.quotationId;
    
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

    console.log("Rejecting quotation:", quotationId);
    
    const response = await fetch(`http://localhost:8081/api/quotations/${quotationId}/reject`, {
      method: "POST",
      headers,
    });

    const data = await response.json();
    console.log("Reject quotation response:", response.status, data);

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || "Failed to reject quotation",
          error: data.error 
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data || data,
      message: "Quotation rejected successfully"
    });

  } catch (error) {
    console.error("Error rejecting quotation:", error);
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
