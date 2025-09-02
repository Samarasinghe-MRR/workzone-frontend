# Schema-UI Alignment Analysis Report

## Overview
This report analyzes the alignment between your Prisma schemas and the frontend UI data structures to identify mismatches and required updates.

## 🔍 Analysis Summary

### ✅ **Well Aligned Areas**
- Basic job creation and management
- Category system structure
- Authentication flow basics
- Quotation core workflow

### ⚠️ **Areas Requiring Attention**
- User profile structure differences
- Job status enumeration mismatches  
- Missing quotation invitation features
- Category service integration gaps

## 📊 Detailed Analysis by Service

### 1. **Auth Service** 
**Schema Status:** ⚠️ **Partial Alignment**

#### Schema Fields vs UI Types:
| Prisma Schema | UI Types | Status | Action Required |
|---------------|----------|---------|-----------------|
| `User.email` | `AuthUser.email` | ✅ Aligned | None |
| `User.phone` | `AuthUser.phone` | ✅ Aligned | None |
| `User.role` (enum) | `FrontendUserRole` | ⚠️ Different format | Update UI mapping |
| `User.status` (enum) | `AuthUser.status` | ⚠️ Different values | Standardize |
| `User.googleId` | Missing in UI | ❌ Missing | Add OAuth support |

#### Issues Found:
1. **Role Mapping**: Schema uses `CUSTOMER/SERVICE_PROVIDER/ADMIN` but UI expects `customer/provider/admin`
2. **Status Values**: Schema uses `ACTIVE/INACTIVE` but UI uses `Active/Inactive/Pending`
3. **Missing OAuth**: Schema has `googleId` but UI doesn't support OAuth
4. **Name Fields**: UI has single `name` field but schema needs separate `firstName/lastName`

### 2. **User Service**
**Schema Status:** ❌ **Major Misalignment**

#### Critical Issues:
| Schema Field | UI Field | Status | Issue |
|-------------|----------|---------|-------|
| `User.firstName` + `lastName` | `User.name` | ❌ Mismatch | UI uses single name field |
| `User.authUserId` | Missing | ❌ Missing | UI doesn't link to auth service |
| `User.roleId` (FK) | `User.role` (string) | ❌ Different | UI treats role as string |
| `ServiceProviderProfile.category` | `Provider.skills[]` | ❌ Mismatch | Different data structure |
| `ServiceProviderProfile.latitude/longitude` | `Provider.location` (string) | ❌ Mismatch | UI uses address string |

#### Missing UI Features:
- Role-based profile management (Customer/Provider/Admin profiles)
- Provider specializations system
- Geographic coordinates for providers
- Service radius configuration

### 3. **Job Service**
**Schema Status:** ⚠️ **Good Alignment with Gaps**

#### Status Alignment:
| Schema Enum | UI Enum | Status | Fix Needed |
|-------------|---------|---------|------------|
| `PENDING` | Missing | ❌ | Add to UI |
| `OPEN` | `OPEN` | ✅ | None |
| `IN_PROGRESS` | `IN_PROGRESS` | ✅ | None |
| `COMPLETED` | `COMPLETED` | ✅ | None |
| `CANCELLED` | `CANCELLED` | ✅ | None |

#### Field Alignment:
| Schema Field | UI Field | Status | Notes |
|-------------|----------|---------|-------|
| `customer_id` | `customerId` | ✅ | Good |
| `location_lat/lng` | `coordinates.lat/lng` | ✅ | Good |
| `budget_min/max` | `budget` (single) | ⚠️ | UI simplified |
| `scheduled_at` | `scheduledDate` | ✅ | Good |
| `priority` enum | `priority` | ✅ | Good |

#### Missing UI Features:
- Job assignments management
- Job attachments
- Job notifications
- Event tracking
- Multiple budget ranges

### 4. **Quotation Service**
**Schema Status:** ❌ **Significant Misalignment**

#### Major Missing Features in UI:
| Schema Feature | UI Support | Impact | Priority |
|---------------|------------|---------|----------|
| `JobQuotationInvite` model | ❌ Missing | High | Critical |
| Provider invitation system | ❌ Missing | High | Critical |
| `QuoteEvent` tracking | ❌ Missing | Medium | Important |
| `QuotationMetrics` | ❌ Missing | Medium | Important |
| `JobEligibilityCriteria` | ❌ Missing | High | Critical |

#### Field Misalignments:
| Schema Field | UI Field | Status | Issue |
|-------------|----------|---------|-------|
| `price` | `amount` | ⚠️ Different name | Inconsistent naming |
| `estimated_time` | Missing | ❌ | UI doesn't capture time estimates |
| `proposed_start` | Missing | ❌ | UI missing start date |
| `includes_tools` | Missing | ❌ | UI missing tool inclusion |
| `eco_friendly` | Missing | ❌ | UI missing eco-friendly option |
| `warranty_period` | Missing | ❌ | UI missing warranty info |

### 5. **Category Service**
**Schema Status:** ✅ **Good Alignment**

#### Well Aligned:
- Hierarchical category structure
- Basic CRUD operations
- Active/inactive status

#### Minor Issues:
- UI doesn't use category audit logging
- Missing category metadata in UI
- No admin category management UI

## 🚀 Recommended Actions

### **Immediate Priority (Critical)**

1. **Update Auth Service Types**
```typescript
// Update src/types/auth.ts
export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;      // Split from name
  lastName: string;       // Split from name
  phone?: string;
  role: FrontendUserRole;
}

export interface AuthUser extends BaseUser {
  id: string;
  email: string;
  firstName: string;      // Add separate fields
  lastName: string;       // Add separate fields
  phone?: string;
  role: FrontendUserRole;
  status: "ACTIVE" | "INACTIVE";  // Match schema enum
  isEmailVerified: boolean;
  token: string;
  refreshToken: string;
  authUserId?: string;    // Link to auth service
}
```

2. **Update User Service Types**
```typescript
// Update src/services/userService.ts
interface UserProfile {
  id: string;
  authUserId: string;     // Link to auth service
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isVerified: boolean;
  role: {                 // Role as object
    id: string;
    name: string;
  };
  roleId: string;
  // Profile-specific data
  serviceProviderProfile?: ServiceProviderProfile;
  customerProfile?: CustomerProfile;
  adminProfile?: AdminProfile;
}

interface ServiceProviderProfile {
  id: string;
  userId: string;
  category: string;
  experienceYears: number;
  location: string;
  latitude: number;       // Add coordinates
  longitude: number;      // Add coordinates
  serviceRadius: number;  // Add service radius
  averageResponseTime: number;
  rating: number;
  availability: boolean;
  isAvailable: boolean;
  specializations: ProviderSpecialization[];
}
```

3. **Update Job Service Types**
```typescript
// Update src/types/job.ts
export enum JobStatus {
  PENDING = "PENDING",    // Add missing status
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS", 
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Job {
  id: string;
  customer_id: string;    // Match schema naming
  customer_email: string; // Add cached field
  title: string;
  description: string;
  category: string;
  categoryId?: string;    // New category system
  location?: string;
  location_lat?: number;  // Match schema naming
  location_lng?: number;  // Match schema naming
  maxRadius?: number;     // Add search radius
  budget_min?: number;    // Support range
  budget_max?: number;    // Support range
  currency: string;
  scheduled_at?: string;  // Match schema naming
  deadline?: string;
  status: JobStatus;
  priority: JobPriority;
  notes?: string;         // Add notes field
  requirements?: string;  // Match schema type
  views: number;         // Add view counter
  createdAt: string;
  updatedAt: string;
  published_at?: string; // Add publish time
  completed_at?: string; // Add completion time
  
  // Relationships
  assignments?: JobAssignment[];
  attachments?: JobAttachment[];
}
```

4. **Create Quotation Invitation System**
```typescript
// Add to src/types/quotation.ts
export interface JobQuotationInvite {
  id: string;
  job_id: string;
  provider_id: string;
  provider_email: string;
  job_category: string;
  distance_km?: number;
  invited_at: string;
  expires_at: string;
  responded: boolean;
  response_at?: string;
  status: "INVITED" | "RESPONDED" | "IGNORED" | "EXPIRED";
  
  // Cached job details
  job_title?: string;
  job_location?: string;
  customer_id?: string;
}

export interface Quotation {
  id: string;
  job_id: string;
  provider_id: string;
  provider_email: string;
  invite_id?: string;
  price: number;               // Match schema naming
  estimated_time?: string;     // Add estimate
  message?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "EXPIRED";
  
  // Extended fields from schema
  proposed_start?: string;
  includes_tools: boolean;
  eco_friendly: boolean;
  valid_until?: string;
  warranty_period?: string;
  materials_cost?: number;
  labor_cost?: number;
  customer_notes?: string;
  
  created_at: string;
  updated_at: string;
  accepted_at?: string;
  rejected_at?: string;
  cancelled_at?: string;
  response_time_hours?: number;
}
```

### **Medium Priority (Important)**

1. **Add Job Assignment Management**
2. **Implement Provider Invitation System**
3. **Add Geographic Search Capabilities**
4. **Create Category Management UI**
5. **Add Quotation Analytics Dashboard**

### **Low Priority (Enhancement)**

1. **Add OAuth Authentication**
2. **Implement Event Tracking**
3. **Add Audit Logging UI**
4. **Create Advanced Filtering**

## 🔧 Implementation Plan

### Phase 1: Critical Type Alignment (Week 1)
- [ ] Update auth types and service
- [ ] Fix user profile structure
- [ ] Align job status enums
- [ ] Add missing job fields

### Phase 2: Quotation System (Week 2)
- [ ] Implement invitation system
- [ ] Add extended quotation fields
- [ ] Create invitation UI components
- [ ] Add metrics tracking

### Phase 3: Enhanced Features (Week 3)
- [ ] Geographic search
- [ ] Provider specializations
- [ ] Advanced job management
- [ ] Analytics dashboard

### Phase 4: Polish & Optimization (Week 4)
- [ ] Event tracking
- [ ] Audit logging
- [ ] Performance optimization
- [ ] Testing & validation

## 📝 Code Templates

I'll create updated type definitions and service modifications in the next phase to implement these alignments.

## 🎯 Success Metrics

1. **Type Safety**: No TypeScript errors related to schema mismatches
2. **Feature Completeness**: All schema features have UI representation
3. **Data Consistency**: Frontend and backend use identical data structures
4. **Performance**: Efficient queries using proper indexes and relationships

This analysis shows that while your core functionality is well-aligned, there are significant opportunities to leverage the full power of your microservice architecture by implementing the missing features and aligning the data structures properly.
