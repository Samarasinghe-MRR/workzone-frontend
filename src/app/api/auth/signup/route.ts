// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   const { email, password } = await request.json();

//   // Accept any credentials for demo purposes
//   if (email && password) {
//     return NextResponse.json({ message: "Signup successful!" });
//   }

//   return NextResponse.json(
//     { message: "Email and password are required" },
//     { status: 400 }
//   );
// }

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  // Forward the request to your NestJS backend
  const backendResponse = await fetch("http://localhost:4000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await backendResponse.json();

  return NextResponse.json(data, { status: backendResponse.status });
}
