import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Accept any credentials and return a dummy token
  if (email && password) {
    return NextResponse.json({ token: "dummy-token" });
  }

  return NextResponse.json(
    { message: "Email and password are required" },
    { status: 400 }
  );
}
