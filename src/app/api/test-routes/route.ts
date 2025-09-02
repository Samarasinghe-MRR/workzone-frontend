import { NextResponse } from "next/server";

export async function GET() {
  const apiRoutes = [
    {
      route: "/api/users/service-providers",
      description: "Service providers endpoint via API Gateway",
      expectedRouting: "API Gateway routes /api/users/* to User Service",
    },
    {
      route: "/api/users/me",
      description: "User profile endpoint",
      expectedRouting: "Should route to User Service",
    },
    {
      route: "/api/jobs",
      description: "Jobs endpoint",
      expectedRouting: "Should route to Job Service",
    },
  ];

  const results = [];

  for (const apiRoute of apiRoutes) {
    try {
      const response = await fetch(`http://localhost:8081${apiRoute.route}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      results.push({
        ...apiRoute,
        status: response.status,
        statusText: response.statusText,
        accessible: response.status < 500, // Any status except server errors means routing works
      });
    } catch (error) {
      results.push({
        ...apiRoute,
        status: "ERROR",
        statusText: error instanceof Error ? error.message : "Unknown error",
        accessible: false,
      });
    }
  }

  return NextResponse.json({
    message: "API Gateway routing test results",
    timestamp: new Date().toISOString(),
    results,
    summary: {
      gatewayReachable: results.some((r) => r.accessible),
      totalRoutes: results.length,
      workingRoutes: results.filter((r) => r.accessible).length,
    },
  });
}
