import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    
    // Get JWT token from cookies or headers
    const token = request.cookies.get("token")?.value || 
                  request.headers.get("authorization")?.replace("Bearer ", "");

    // Build API Gateway URL
    let apiUrl = "http://localhost:8081/api/quotations/provider/quotes";
    if (status) {
      apiUrl += `?status=${encodeURIComponent(status)}`;
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    console.log("Fetching provider quotations from:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    console.log("Provider quotations response:", response.status, data);

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || "Failed to fetch quotations",
          error: data.error 
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data || data,
      message: "Quotations fetched successfully"
    });

  } catch (error) {
    console.error("Error fetching provider quotations:", error);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
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

    console.log("Creating quotation:", body);
    
    const response = await fetch("http://localhost:8081/api/quotations/provider/quotes", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Create quotation response:", response.status, data);

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || "Failed to create quotation",
          error: data.error 
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data || data,
      message: "Quotation created successfully"
    });

  } catch (error) {
    console.error("Error creating quotation:", error);
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
