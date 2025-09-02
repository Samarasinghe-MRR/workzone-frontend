# Backend Integration Guide - WorkZone Frontend

This document outlines the complete backend integration for the WorkZone frontend application, connecting to NestJS microservices through an API Gateway.

## Architecture Overview

```
Frontend (Next.js) → API Gateway (Port 8081) → Microservices:
                                               ├── Auth Service (Port 4000)
                                               ├── User Service  
                                               ├── Job Service
                                               └── Other Services
```

## 🔧 Services Integrated

### 1. Job Service (`/src/services/jobService.ts`)

**Backend Controller**: `job.controller.ts`

**Key Endpoints Integrated**:
- `GET /jobs` - Get all jobs with filtering
- `POST /jobs` - Create new job posting
- `GET /jobs/my-jobs` - Get jobs posted by current user
- `GET /jobs/assigned-jobs` - Get jobs assigned to current provider
- `GET /jobs/:id` - Get specific job by ID
- `PATCH /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job
- `POST /jobs/:id/assign` - Assign job to provider
- `POST /jobs/:id/complete` - Mark job as completed

**Features**:
- ✅ Full CRUD operations
- ✅ Role-based job filtering (customer vs provider)
- ✅ Job assignment workflow
- ✅ Status management (OPEN, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED)
- ✅ Authentication required for protected endpoints
- ✅ Query parameter support for filtering

### 2. Provider Service (`/src/services/providerService.ts`)

**Backend Controller**: `user.controller.ts` + `profile.controller.ts`

**Key Endpoints Integrated**:
- `GET /users/providers` - Get all service providers
- `GET /users/providers/:id` - Get provider by ID
- `POST /profiles/service-providers/me` - Create provider profile
- `PATCH /profiles/service-providers/me` - Update provider profile
- `GET /users/me/provider-data` - Get comprehensive provider data
- `GET /users/providers/nearby` - Search providers by location

**Features**:
- ✅ Provider search and filtering
- ✅ Location-based provider search
- ✅ Provider profile management
- ✅ Rating and review system
- ✅ Portfolio management
- ✅ Availability scheduling

### 3. Post Job Service (`/src/services/postJobService.ts`)

**Backend Controller**: `job.controller.ts`

**Key Endpoints Integrated**:
- `POST /jobs` - Create new job posting
- `GET /jobs/categories` - Get job categories
- `GET /jobs/templates` - Get job templates
- `POST /jobs/drafts` - Save job draft
- `GET /jobs/drafts` - Get user drafts
- `POST /jobs/estimate-budget` - Get budget estimates

**Features**:
- ✅ Job creation workflow
- ✅ Draft management
- ✅ Category and template system
- ✅ Budget estimation
- ✅ Image upload support
- ✅ Location suggestions

### 4. Settings Service (`/src/services/settingsService.ts`)

**Backend Controller**: `user.controller.ts` + `auth.controller.ts`

**Key Endpoints Integrated**:
- `GET /users/me/settings` - Get user settings
- `PATCH /users/me/settings` - Update user settings
- `POST /auth/change-password` - Change password
- `POST /auth/2fa/enable` - Enable 2FA
- `POST /auth/2fa/disable` - Disable 2FA
- `GET /users/me` - Get user profile
- `PATCH /users/me` - Update user profile

**Features**:
- ✅ Notification preferences
- ✅ Privacy settings
- ✅ Security settings (2FA, password change)
- ✅ Profile management
- ✅ Account deletion
- ✅ Data export

## 🔗 API Gateway Integration

### Configuration (`/src/lib/api.ts`)

```typescript
const API_GATEWAY_BASE_URL = "http://localhost:8081/api";

export const API_CONFIG = {
  AUTH_SERVICE: `${API_GATEWAY_BASE_URL}/auth`,
  USER_SERVICE: `${API_GATEWAY_BASE_URL}/users`,
  JOB_SERVICE: `${API_GATEWAY_BASE_URL}/jobs`,
  // ... other services
};
```

### Pre-configured API Clients

- `authApiClient` - Authentication operations
- `userApiClient` - User and profile operations  
- `jobApiClient` - Job-related operations
- `quotationApiClient` - Quote management
- `categoryApiClient` - Category operations

### Token Management

```typescript
export const tokenManager = {
  getToken: () => localStorage.getItem("token"),
  setTokens: (token, refreshToken) => { /* ... */ },
  clearTokens: () => { /* ... */ },
  isAuthenticated: () => !!localStorage.getItem("token")
};
```

## 🛠️ API Routes (Next.js)

### Updated Routes for Gateway Integration

1. **Jobs API** (`/src/app/api/jobs/route.ts`)
   - Routes through API Gateway to Job Service
   - Supports GET (fetch jobs) and POST (create job)

2. **Post Job API** (`/src/app/api/post-job/route.ts`)  
   - Routes job creation through API Gateway
   - Enhanced validation and error handling

3. **Users API** (`/src/app/api/users/route.ts`)
   - User management operations
   - Profile updates and queries

4. **Settings API** (`/src/app/api/settings/route.ts`)
   - User settings management
   - Preferences and configuration

## 🎯 Frontend Component Integration

### Customer Jobs Page (`/src/app/dashboard/customer/jobs/page.tsx`)

**Updated with Backend Integration**:
- ✅ Real API calls to `jobService.getMyJobs()`
- ✅ Loading and error states
- ✅ Backend status mapping (OPEN → active, etc.)
- ✅ Proper TypeScript types
- ✅ Error handling and retry functionality

**Status Mapping**:
```typescript
Backend Status → Frontend Status
OPEN          → active
ASSIGNED      → scheduled  
IN_PROGRESS   → in-progress
COMPLETED     → completed
CANCELLED     → cancelled
```

## 🔐 Authentication Flow

### Backend Authentication Integration

1. **Login** (`authService.login()`)
   - Calls API Gateway `/auth/login`
   - Returns JWT token and user data
   - Stores tokens in localStorage

2. **Protected Requests**
   - All service methods check `tokenManager.isAuthenticated()`
   - Include `Authorization: Bearer <token>` header
   - Handle 401 responses for token refresh

### Role-Based Access

```typescript
// Example from provider service
async getMyProviderData() {
  if (!tokenManager.isAuthenticated()) {
    throw new Error("Authentication required");
  }
  return await userApiClient.get("/me/provider-data", true);
}
```

## 📝 Type Definitions

### Job Types (`/src/types/job.ts`)

```typescript
export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  budget?: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: JobStatus;
  customerId: string;
  serviceProviderId?: string;
  // ... other fields
}

export enum JobStatus {
  OPEN = "OPEN",
  ASSIGNED = "ASSIGNED", 
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}
```

### Service Provider Types

```typescript
export interface ServiceProvider extends User {
  businessName?: string;
  category?: string;
  experienceYears?: number;
  rating?: number;
  location?: string;
  coordinates?: { lat: number; lng: number };
  // ... other fields
}
```

## 🚀 Usage Examples

### Fetching User's Jobs

```typescript
import { jobService } from '@/services/jobService';

// In component
useEffect(() => {
  const loadJobs = async () => {
    try {
      const response = await jobService.getMyJobs();
      if (response.success) {
        setJobs(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };
  loadJobs();
}, []);
```

### Creating a New Job

```typescript
import { postJobService } from '@/services/postJobService';

const createJob = async (jobData) => {
  try {
    const response = await postJobService.postJob(jobData);
    if (response.success) {
      // Job created successfully
      router.push('/dashboard/customer/jobs');
    }
  } catch (error) {
    setError(error.message);
  }
};
```

### Updating User Settings

```typescript
import { settingsService } from '@/services/settingsService';

const updateNotifications = async (preferences) => {
  try {
    await settingsService.updateNotificationPreferences(preferences);
    // Settings updated successfully
  } catch (error) {
    console.error('Failed to update settings:', error);
  }
};
```

## 🐛 Error Handling

### Standard Error Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

### Error Handling Pattern

```typescript
try {
  const response = await service.someMethod();
  if (response.success) {
    // Handle success
  } else {
    // Handle API error
    setError(response.message || 'Operation failed');
  }
} catch (error) {
  // Handle network/other errors
  setError(error.message || 'Network error');
}
```

## 🧪 Testing Integration

### Environment Variables

```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8081/api
```

### Testing Checklist

- [ ] Authentication flow (login/logout)
- [ ] Job CRUD operations
- [ ] Provider search and filtering
- [ ] Settings management
- [ ] Error handling and loading states
- [ ] Token refresh on expiry
- [ ] Role-based access control

## 📚 Next Steps

### Potential Enhancements

1. **Real-time Updates**
   - WebSocket integration for live job updates
   - Notification system for job status changes

2. **Advanced Features**
   - File upload for job images
   - Payment integration
   - Chat system between customers and providers

3. **Performance Optimization**
   - Query caching with React Query
   - Pagination for large datasets
   - Image optimization and CDN integration

4. **Analytics Integration**
   - User behavior tracking
   - Performance monitoring
   - Error reporting

---

This integration provides a solid foundation for the WorkZone application with full backend connectivity, proper error handling, and type safety throughout the application.
