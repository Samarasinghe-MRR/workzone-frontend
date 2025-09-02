import { gatewayHealth } from "@/lib/gatewayApi";

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

class HealthService {
  // Check health of all services through the API Gateway
  async checkAllServices(): Promise<OverallHealth> {
    try {
      return await gatewayHealth.checkAll();
    } catch (error) {
      console.error("Failed to check services health:", error);
      return {
        status: "unhealthy",
        services: [],
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Check health of a specific service
  async checkService(serviceName: string): Promise<ServiceHealth> {
    try {
      return await gatewayHealth.checkService(serviceName);
    } catch (error) {
      console.error(`Failed to check ${serviceName} health:`, error);
      return {
        service: serviceName,
        status: "unhealthy",
        responseTime: 0,
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Monitor services continuously
  startHealthMonitoring(
    interval = 30000, // 30 seconds
    onHealthUpdate?: (health: OverallHealth) => void
  ): () => void {
    const intervalId = setInterval(async () => {
      try {
        const health = await this.checkAllServices();
        if (onHealthUpdate) {
          onHealthUpdate(health);
        }

        // Log unhealthy services
        const unhealthyServices = health.services.filter(
          (service) => service.status !== "healthy"
        );

        if (unhealthyServices.length > 0) {
          console.warn("Unhealthy services detected:", unhealthyServices);
        }
      } catch (error) {
        console.error("Health monitoring error:", error);
      }
    }, interval);

    // Return cleanup function
    return () => clearInterval(intervalId);
  }

  // Get service names that are being monitored
  getMonitoredServices(): string[] {
    return ["auth", "users", "jobs", "quotations", "categories"];
  }

  // Check if API Gateway is reachable
  async isGatewayReachable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8081/api"
        }/health`,
        {
          method: "GET",
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error("Gateway not reachable:", error);
      return false;
    }
  }

  // Get recommended actions based on health status
  getHealthRecommendations(health: OverallHealth): string[] {
    const recommendations: string[] = [];

    if (health.status === "unhealthy") {
      recommendations.push(
        "Multiple services are down. Contact system administrator."
      );
    }

    if (health.status === "degraded") {
      recommendations.push(
        "Some services are experiencing issues. Functionality may be limited."
      );
    }

    health.services.forEach((service) => {
      if (service.status === "unhealthy") {
        recommendations.push(
          `${service.service} service is down. Related features may not work.`
        );
      } else if (service.status === "degraded") {
        recommendations.push(
          `${service.service} service is slow. Expect delayed responses.`
        );
      }

      if (service.responseTime > 5000) {
        recommendations.push(
          `${service.service} service is responding slowly (${service.responseTime}ms).`
        );
      }
    });

    return recommendations;
  }

  // Check if specific feature is available based on service health
  isFeatureAvailable(feature: string, health: OverallHealth): boolean {
    const featureServiceMap: Record<string, string[]> = {
      authentication: ["auth"],
      userManagement: ["users"],
      jobPosting: ["jobs"],
      jobBrowsing: ["jobs"],
      quotations: ["quotations"],
      categories: ["categories"],
    };

    const requiredServices = featureServiceMap[feature] || [];

    return requiredServices.every((serviceName) => {
      const service = health.services.find((s) => s.service === serviceName);
      return service && service.status === "healthy";
    });
  }

  // Get degraded features
  getDegradedFeatures(health: OverallHealth): string[] {
    const features = [
      "authentication",
      "userManagement",
      "jobPosting",
      "jobBrowsing",
      "quotations",
      "categories",
    ];

    return features.filter(
      (feature) => !this.isFeatureAvailable(feature, health)
    );
  }
}

// Export singleton instance
export const healthService = new HealthService();
export default healthService;
