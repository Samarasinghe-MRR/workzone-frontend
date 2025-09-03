/**
 * API Gateway Integration Test Script
 * This file contains functions to test the API Gateway integration
 * Run these tests after setting up the gateway to ensure everything works
 */

import { authService } from "@/features/auth/services/authService";
import { jobService } from "@/services/jobService";
import { userService } from "@/services/userService";
import { quotationService } from "@/services/quotationService";
import { categoryService } from "@/services/categoryService";
import { healthService } from "@/services/healthService";

interface TestResult {
  test: string;
  success: boolean;
  message: string;
  duration: number;
}

class GatewayIntegrationTester {
  private results: TestResult[] = [];

  private async runTest(
    testName: string,
    testFn: () => Promise<void>
  ): Promise<TestResult> {
    const startTime = Date.now();
    try {
      await testFn();
      const duration = Date.now() - startTime;
      const result: TestResult = {
        test: testName,
        success: true,
        message: "Test passed successfully",
        duration,
      };
      this.results.push(result);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const result: TestResult = {
        test: testName,
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        duration,
      };
      this.results.push(result);
      return result;
    }
  }

  async testHealthService(): Promise<TestResult> {
    return this.runTest("Health Service", async () => {
      const health = await healthService.checkAllServices();
      if (!health || !health.services) {
        throw new Error("Health service returned invalid response");
      }
      if (health.services.length === 0) {
        throw new Error("No services found in health check");
      }
    });
  }

  async testCategoryService(): Promise<TestResult> {
    return this.runTest("Category Service (Public)", async () => {
      const categories = await categoryService.getAllCategories();
      if (!categories) {
        throw new Error("Category service returned null response");
      }
      // Categories might be empty in a new system, so just check for valid response structure
    });
  }

  async testAuthServiceSignup(): Promise<TestResult> {
    return this.runTest("Auth Service - Signup", async () => {
      const testEmail = `test-${Date.now()}@example.com`;
      try {
        await authService.signup({
          email: testEmail,
          password: "Test123!@#",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          role: "customer",
        });
      } catch (error) {
        // If user already exists or validation fails, that's expected in testing
        if (
          error instanceof Error &&
          error.message.includes("already exists")
        ) {
          return; // This is fine for testing
        }
        throw error;
      }
    });
  }

  async testAuthServiceLogin(): Promise<TestResult> {
    return this.runTest("Auth Service - Login", async () => {
      try {
        await authService.login({
          email: "test@example.com",
          password: "wrongpassword",
        });
        throw new Error("Login should have failed with wrong credentials");
      } catch (error) {
        // Expected to fail - this tests that the service is responding
        if (
          error instanceof Error &&
          (error.message.includes("401") ||
            error.message.includes("Invalid") ||
            error.message.includes("Unauthorized"))
        ) {
          return; // This is expected
        }
        throw error;
      }
    });
  }

  async testJobService(): Promise<TestResult> {
    return this.runTest("Job Service", async () => {
      try {
        await jobService.getAllJobs();
      } catch (error) {
        // If auth is required, we expect 401
        if (error instanceof Error && error.message.includes("401")) {
          return; // This means the service is reachable
        }
        throw error;
      }
    });
  }

  async testUserService(): Promise<TestResult> {
    return this.runTest("User Service", async () => {
      try {
        await userService.getProfile();
      } catch (error) {
        // If auth is required, we expect 401
        if (error instanceof Error && error.message.includes("401")) {
          return; // This means the service is reachable
        }
        throw error;
      }
    });
  }

  async testQuotationService(): Promise<TestResult> {
    return this.runTest("Quotation Service", async () => {
      try {
        await quotationService.getQuotations();
      } catch (error) {
        // If auth is required, we expect 401
        if (error instanceof Error && error.message.includes("401")) {
          return; // This means the service is reachable
        }
        throw error;
      }
    });
  }

  async runAllTests(): Promise<TestResult[]> {
    console.log("🚀 Starting API Gateway Integration Tests...");
    this.results = [];

    const tests = [
      () => this.testHealthService(),
      () => this.testCategoryService(),
      () => this.testAuthServiceSignup(),
      () => this.testAuthServiceLogin(),
      () => this.testJobService(),
      () => this.testUserService(),
      () => this.testQuotationService(),
    ];

    for (const test of tests) {
      const result = await test();
      console.log(
        `${result.success ? "✅" : "❌"} ${result.test}: ${result.message} (${
          result.duration
        }ms)`
      );
    }

    this.printSummary();
    return this.results;
  }

  private printSummary(): void {
    const totalTests = this.results.length;
    const passedTests = this.results.filter((r) => r.success).length;
    const failedTests = totalTests - passedTests;

    console.log("\n📊 Test Summary:");
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(
      `Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`
    );

    if (failedTests > 0) {
      console.log("\n❌ Failed Tests:");
      this.results
        .filter((r) => !r.success)
        .forEach((r) => {
          console.log(`  - ${r.test}: ${r.message}`);
        });
    }

    if (passedTests === totalTests) {
      console.log(
        "\n🎉 All tests passed! API Gateway integration is working correctly."
      );
    } else {
      console.log(
        "\n⚠️  Some tests failed. Check your API Gateway and microservices setup."
      );
    }
  }

  getResults(): TestResult[] {
    return this.results;
  }
}

// Export the tester class
export const gatewayTester = new GatewayIntegrationTester();

// Utility function to run tests from browser console
export const runGatewayTests = async (): Promise<TestResult[]> => {
  return gatewayTester.runAllTests();
};

// Individual test functions for targeted testing
export const testHealth = () => gatewayTester.testHealthService();
export const testCategories = () => gatewayTester.testCategoryService();
export const testAuth = () => gatewayTester.testAuthServiceLogin();
export const testJobs = () => gatewayTester.testJobService();

// Instructions for manual testing
export const TESTING_INSTRUCTIONS = `
🧪 API Gateway Integration Testing Instructions

1. Ensure your API Gateway is running on port 8081
2. Ensure your microservices are running
3. Open browser console on any page of your app
4. Run the following commands:

// Test all services
import { runGatewayTests } from '@/lib/gatewayTests';
runGatewayTests();

// Test individual services
import { testHealth, testCategories, testAuth, testJobs } from '@/lib/gatewayTests';
testHealth();
testCategories();
testAuth();
testJobs();

// Monitor continuous health
import { healthService } from '@/services/healthService';
const cleanup = healthService.startHealthMonitoring(5000, (health) => {
  console.log('Health update:', health);
});
// Call cleanup() when done

Expected Results:
- Health service should return all microservices status
- Category service should work without authentication
- Auth service should properly reject invalid credentials
- Protected services (jobs, users, quotations) should return 401 without auth

If tests fail:
1. Check that API Gateway is running on port 8081
2. Verify microservices are accessible
3. Check CORS configuration
4. Ensure proxy routes are correctly configured
5. Check network connectivity
`;

export default GatewayIntegrationTester;
