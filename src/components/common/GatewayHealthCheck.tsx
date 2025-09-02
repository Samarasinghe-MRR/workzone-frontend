"use client";

import { useState, useEffect } from "react";
import { healthService } from "@/services/healthService";

interface ServiceHealth {
  service: string;
  status: "healthy" | "unhealthy" | "degraded";
  responseTime: number;
  message?: string;
  timestamp: string;
}

interface OverallHealth {
  status: "healthy" | "unhealthy" | "degraded";
  services: ServiceHealth[];
  timestamp: string;
  version?: string;
}

export default function GatewayHealthCheck() {
  const [health, setHealth] = useState<OverallHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const healthData = await healthService.checkAllServices();
      setHealth(healthData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check health");
      console.error("Health check failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();

    // Set up periodic health monitoring
    const cleanup = healthService.startHealthMonitoring(30000, setHealth);

    return cleanup;
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "degraded":
        return "text-yellow-600 bg-yellow-100";
      case "unhealthy":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return "✅";
      case "degraded":
        return "⚠️";
      case "unhealthy":
        return "❌";
      default:
        return "❓";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">API Gateway Health Check</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">API Gateway Health Check</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button
          onClick={checkHealth}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">API Gateway Health Check</h2>
        <button
          onClick={checkHealth}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
        >
          Refresh
        </button>
      </div>

      {health && (
        <>
          {/* Overall Status */}
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getStatusIcon(health.status)}</span>
              <div>
                <h3 className="text-lg font-medium">Overall Status</h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    health.status
                  )}`}
                >
                  {health.status.toUpperCase()}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Last updated: {new Date(health.timestamp).toLocaleString()}
            </p>
          </div>

          {/* Individual Services */}
          <div>
            <h3 className="text-lg font-medium mb-4">Services Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {health.services.map((service) => (
                <div
                  key={service.service}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">
                      {service.service}
                    </h4>
                    <span className="text-xl">
                      {getStatusIcon(service.status)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        service.status
                      )}`}
                    >
                      {service.status.toUpperCase()}
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>Response: {service.responseTime}ms</p>
                      <p>
                        Updated:{" "}
                        {new Date(service.timestamp).toLocaleTimeString()}
                      </p>
                    </div>

                    {service.message && (
                      <p className="text-xs text-gray-500 mt-2">
                        {service.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {health.status !== "healthy" && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">
                Recommendations
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {healthService
                  .getHealthRecommendations(health)
                  .map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Feature Availability */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">
              Feature Availability
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {[
                "authentication",
                "userManagement",
                "jobPosting",
                "jobBrowsing",
                "quotations",
                "categories",
              ].map((feature) => {
                const isAvailable = healthService.isFeatureAvailable(
                  feature,
                  health
                );
                return (
                  <div key={feature} className="flex items-center space-x-2">
                    <span>{isAvailable ? "✅" : "❌"}</span>
                    <span
                      className={
                        isAvailable ? "text-green-700" : "text-red-700"
                      }
                    >
                      {feature.charAt(0).toUpperCase() + feature.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
