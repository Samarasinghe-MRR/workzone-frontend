import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing backend connectivity...");

    // Test if API Gateway is reachable
    const backendResponse = await fetch(
      "http://localhost:8081/api/users/service-providers",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Backend response status:", backendResponse.status);
    console.log(
      "Backend response headers:",
      Object.fromEntries(backendResponse.headers.entries())
    );

    if (backendResponse.ok) {
      const data = await backendResponse.json();
      return NextResponse.json({
        success: true,
        backendStatus: "reachable",
        backendResponse: data,
        message: "Backend is reachable",
      });
    } else {
      const errorData = await backendResponse.text();
      return NextResponse.json({
        success: false,
        backendStatus: "error",
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        error: errorData,
        message: "Backend returned an error",
      });
    }
  } catch (error) {
    console.error("Error connecting to backend:", error);
    return NextResponse.json({
      success: false,
      backendStatus: "unreachable",
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Cannot connect to backend",
    });
  }
}
