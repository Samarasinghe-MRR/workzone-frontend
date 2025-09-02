# API Gateway Migration Guide

## Overview
This guide documents the migration from direct microservice calls to routing through the API Gateway running on port 8081.

## Migration Summary

### Before (Direct Microservice Calls)
```
Frontend → Auth Service (port 4000)
Frontend → User Service (port 3001)  
Frontend → Job Service (port 3003)
Frontend → Other Services (various ports)
```

### After (API Gateway Pattern)
```
Frontend → API Gateway (port 8081) → Microservices
```

## Key Changes Made

### 1. Environment Configuration
**File:** `.env.local`
- Added `NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8081/api`
- Kept individual service URLs for debugging purposes
- Made gateway the primary endpoint

### 2. API Client Architecture
**File:** `src/lib/gatewayApi.ts`
- Created `GatewayApiClient` class with enhanced error handling
- Added timeout support using AbortController
- Implemented automatic token refresh on 401 errors
- Created service-specific gateway clients

### 3. Service Layer Updates

#### Auth Service (`src/features/auth/services/authService.ts`)
**Changes:**
- Replaced `authApiClient` with `gatewayServices.auth`
- Updated endpoints to remove `/auth` prefix (handled by gateway routing)
- Example: `/auth/login` → `/login`

#### Job Service (`src/services/jobService.ts`)
**Changes:**
- Complete rewrite to use `gatewayServices.jobs`
- Added new methods for job applications and statistics
- Improved TypeScript types
- Enhanced query parameter handling

#### User Service (`src/services/userService.ts`)
**New File:**
- Created comprehensive user service for gateway
- Includes profile management, admin functions, settings
- Proper file upload handling for profile pictures

#### Quotation Service (`src/services/quotationService.ts`)
**New File:**
- Full quotation management system
- PDF generation and email sending capabilities
- Statistics and filtering support

#### Category Service (`src/services/categoryService.ts`)
**New File:**
- Public and admin category management
- Tree structure support for hierarchical categories
- Bulk operations and export functionality

### 4. Health Monitoring
**File:** `src/services/healthService.ts`
- Created health monitoring service
- Continuous monitoring with configurable intervals
- Feature availability checking based on service health
- Recommendations for degraded services

### 5. Updated API Configuration
**File:** `src/lib/api.ts`
- Updated `API_CONFIG` to point to gateway endpoints
- Added new service-specific configurations
- Maintained backward compatibility

## Service Endpoint Mapping

### API Gateway Proxy Routes
Based on your proxy controller, the following routes are available:

| Frontend Call | Gateway Route | Target Service |
|---------------|---------------|----------------|
| `/auth/*` | `http://localhost:8081/api/auth/*` | Auth Service |
| `/users/*` | `http://localhost:8081/api/users/*` | User Service |
| `/jobs/*` | `http://localhost:8081/api/jobs/*` | Job Service |
| `/quotations/*` | `http://localhost:8081/api/quotations/*` | Quotation Service |
| `/categories/*` | `http://localhost:8081/api/categories/*` | Category Service |

## Usage Examples

### Before (Direct Service Call)
```typescript
// Old way - direct service call
const response = await fetch("http://localhost:4000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

### After (Through Gateway)
```typescript
// New way - through gateway
const response = await gatewayServices.auth.post("/login", { email, password }, false);
```

## Error Handling Improvements

### Enhanced Error Responses
```typescript
private async handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Automatic token refresh on 401
    if (response.status === 401) {
      this.clearTokens();
      window.location.href = '/auth/login';
    }
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  return response.json();
}
```

### Timeout Handling
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), this.timeout);
// Request with timeout...
clearTimeout(timeoutId);
```

## Testing the Migration

### 1. Start Your Services
```bash
# Start API Gateway
npm run start:gateway  # Should run on port 8081

# Start individual microservices
npm run start:auth     # Port 4000
npm run start:users    # Port 3001
npm run start:jobs     # Port 3003
# etc.
```

### 2. Test Gateway Health
```typescript
import { healthService } from '@/services/healthService';

// Check all services
const health = await healthService.checkAllServices();
console.log('Service health:', health);

// Check specific service
const authHealth = await healthService.checkService('auth');
console.log('Auth service health:', authHealth);
```

### 3. Test Service Calls
```typescript
import { authService } from '@/features/auth/services/authService';
import { jobService } from '@/services/jobService';

// Test authentication through gateway
const loginResult = await authService.login({ email: 'test@test.com', password: 'password' });

// Test job operations through gateway
const jobs = await jobService.getAllJobs();
```

## Rollback Plan

If issues occur, you can temporarily rollback by:

1. **Update environment variables:**
```bash
# In .env.local, comment out gateway URL
# NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8081/api

# Uncomment direct service URLs
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:4000
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:3001
```

2. **Use legacy API clients:**
```typescript
// Import legacy clients if needed
import { authApiClient } from '@/lib/api';
```

## Monitoring and Debugging

### 1. Gateway Health Dashboard
Consider creating a simple health dashboard:
```typescript
// In a React component
const [health, setHealth] = useState<OverallHealth | null>(null);

useEffect(() => {
  const cleanup = healthService.startHealthMonitoring(30000, setHealth);
  return cleanup;
}, []);
```

### 2. Debug Headers
Add debug headers to track requests:
```typescript
const debugHeaders = {
  'X-Request-ID': crypto.randomUUID(),
  'X-Client-Version': '1.0.0',
};
```

### 3. Logging
Enable detailed logging in development:
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('Gateway request:', { endpoint, method, data });
}
```

## Benefits of This Migration

1. **Centralized routing** - Single entry point for all API calls
2. **Enhanced security** - Gateway can handle authentication, rate limiting
3. **Better monitoring** - Centralized logging and metrics
4. **Easier debugging** - Single point to monitor all API traffic
5. **Scalability** - Easy to add new services or modify routing
6. **Resilience** - Gateway can handle service failures gracefully

## Next Steps

1. **Load Testing** - Test the gateway under load
2. **Caching** - Add response caching at gateway level
3. **Rate Limiting** - Implement rate limiting per user/IP
4. **API Versioning** - Add version headers for API evolution
5. **Documentation** - Generate API docs from gateway

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure gateway has proper CORS configuration
   - Check if preflight requests are handled

2. **Timeout Errors**
   - Increase timeout in `gatewayApi.ts`
   - Check if backend services are responding

3. **Authentication Issues**
   - Verify JWT tokens are properly forwarded
   - Check token expiration handling

4. **Service Discovery**
   - Ensure all services are registered with gateway
   - Verify service health endpoints

### Debug Commands
```bash
# Check gateway status
curl http://localhost:8081/api/health

# Check specific service
curl http://localhost:8081/api/health/auth

# Test authentication
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'
```
