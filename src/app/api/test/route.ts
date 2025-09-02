import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Test API route called");

    return NextResponse.json({
      success: true,
      message: "Test API route is working",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Test API route failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
