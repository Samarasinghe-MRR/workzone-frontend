# GitHub Copilot Chat Notes

## Useful Solutions and Context

### Date: 2025-09-01
**Topic:** API Gateway Integration for Microservices
**Context:** Connecting Next.js frontend to NestJS microservices through API Gateway on port 8081
**Solutions Found:**
- Created API Gateway client with enhanced error handling and timeouts
- Updated all service layers to route through gateway instead of direct microservice calls
- Implemented health monitoring for microservices
- Created environment configuration for gateway and fallback URLs
- Added proper TypeScript types for all service responses

### Code Snippets to Remember

```typescript
// API Gateway Configuration
const API_GATEWAY_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8081/api";

// Enhanced Gateway Client with timeout and error handling
export class GatewayApiClient {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Handle 401 specifically for token expiration
      if (response.status === 401) {
        this.clearTokens();
        window.location.href = '/auth/login';
      }
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  }
}

// Service Pattern for Gateway
export const gatewayServices = {
  auth: new GatewayApiClient(`${GATEWAY_CONFIG.BASE_URL}/auth`),
  users: new GatewayApiClient(`${GATEWAY_CONFIG.BASE_URL}/users`),
  jobs: new GatewayApiClient(`${GATEWAY_CONFIG.BASE_URL}/jobs`),
  quotations: new GatewayApiClient(`${GATEWAY_CONFIG.BASE_URL}/quotations`),
  categories: new GatewayApiClient(`${GATEWAY_CONFIG.BASE_URL}/categories`),
};
```

### API Patterns

```typescript
// Standard service method pattern
async getAllJobs(params?: JobQueryParams): Promise<JobsResponse> {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }
  const endpoint = queryParams.toString() ? `/?${queryParams.toString()}` : "/";
  return gatewayServices.jobs.get<JobsResponse>(endpoint, true);
}

// File upload pattern through gateway
async uploadProfilePicture(file: File): Promise<ApiResponse<{ profilePictureUrl: string }>> {
  const formData = new FormData();
  formData.append("profilePicture", file);
  const token = localStorage.getItem("token");
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/users/profile/picture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return response.json();
}
```

### Environment Configuration

```bash
# API Gateway Configuration (Primary)
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8081/api

# Individual Microservices (Direct access for debugging)
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:4000
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_JOB_SERVICE_URL=http://localhost:3003
NEXT_PUBLIC_QUOTATION_SERVICE_URL=http://localhost:3004
NEXT_PUBLIC_CATEGORY_SERVICE_URL=http://localhost:3005
```

### Files Created/Updated:
1. `src/lib/gatewayApi.ts` - Enhanced gateway client
2. `src/services/jobService.ts` - Job service via gateway
3. `src/services/userService.ts` - User service via gateway  
4. `src/services/quotationService.ts` - Quotation service via gateway
5. `src/services/categoryService.ts` - Category service via gateway
6. `src/services/healthService.ts` - Health monitoring service
7. `src/features/auth/services/authService.ts` - Updated auth service
8. `.env.local` - Environment configuration

## Common Issues & Solutions

1. **Issue:** Frontend making direct calls to microservices
   **Solution:** Route all calls through API Gateway at port 8081 using the proxy controller

2. **Issue:** Authentication token handling across services
   **Solution:** Gateway automatically forwards Authorization headers to appropriate microservices

3. **Issue:** Service health monitoring
   **Solution:** Created health service that monitors all microservices through gateway `/health` endpoints

4. **Issue:** File uploads through gateway
   **Solution:** Use FormData and direct fetch calls for multipart uploads while maintaining auth headers 
