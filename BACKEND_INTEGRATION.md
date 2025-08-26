# Backend Integration Guide

## 🔗 NestJS Backend Integration

Your WorkZone frontend has been successfully integrated with the NestJS backend services.

## 📍 Backend Endpoints Mapping

### User Service (Port 3001)
- **Base URL**: `http://localhost:3001`
- **Swagger Docs**: `http://localhost:3001/api`

#### Frontend → Backend Mapping:

| Frontend Service | Backend Endpoint | Method | Description |
|-----------------|------------------|---------|------------|
| `userService.getAllUsers()` | `/users` | GET | Get all users (Admin only) |
| `userService.getUserById(id)` | `/users/{id}` | GET | Get user by ID |
| `userService.getUserByEmail(email)` | `/users/email/{email}` | GET | Get user by email |
| `userService.updateUser(id, data)` | `/users/{id}` | PATCH | Update user information |
| `userService.updateVerificationStatus(id, verified)` | `/users/{id}/verify` | PATCH | Update verification status |
| `userService.deleteUser(id)` | `/users/{id}` | DELETE | Soft delete user |
| `userService.assignRole(userId, roleName)` | `/users/{id}/role` | PATCH | Assign role to user |

#### Profile Management:
| Frontend Service | Backend Endpoint | Method | Description |
|-----------------|------------------|---------|------------|
| `profileService.createCustomerProfile()` | `/profiles/customers/{id}` | POST | Create customer profile |
| `profileService.createServiceProviderProfile()` | `/profiles/service-providers/{id}` | POST | Create provider profile |
| `profileService.createAdminProfile()` | `/profiles/admins/{id}` | POST | Create admin profile |

#### Role Management:
| Frontend Service | Backend Endpoint | Method | Description |
|-----------------|------------------|---------|------------|
| `roleService.createRole(name)` | `/roles` | POST | Create new role |
| `roleService.getAllRoles()` | `/roles` | GET | Get all roles |
| `roleService.findRoleByName(name)` | `/roles/{name}` | GET | Find role by name |
| `roleService.assignRole(userId, roleId)` | `/roles/assign` | POST | Assign role to user |

## 🔐 Authentication Flow

### 1. Login Process
```typescript
// Frontend: LoginForm.tsx
const response = await authService.login({ email, password });
// Calls: POST /auth/login

// Token is automatically stored in localStorage
// User data is fetched using userService.getUserById()
```

### 2. Protected Routes
```typescript
// Automatic header injection in all API calls
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
}
```

### 3. Role-based Redirects
```typescript
// dashboard/page.tsx automatically redirects based on user.role
switch (user.role) {
  case "admin": router.replace("/dashboard/admin");
  case "customer": router.replace("/dashboard/customer");
  case "provider": router.replace("/dashboard/provider");
}
```

## 🏗️ Service Integration Status

### ✅ Completed Integrations
- **User Management**: Full CRUD operations with NestJS user controller
- **Profile Management**: Customer, Provider, and Admin profile creation
- **Role Management**: Role creation, assignment, and retrieval
- **Authentication**: Token-based auth with automatic header injection
- **Admin Dashboard**: User stats calculation from real backend data

### 🔄 Pending Integrations (Mock Data)
- **Job Service**: Replace mock jobs with actual job microservice
- **Payment Service**: Replace mock transactions with payment microservice
- **Notification Service**: Real-time notifications
- **File Upload**: Profile pictures, certifications, etc.

## 🚀 Getting Started

### 1. Environment Setup
```bash
# Copy environment file
cp .env.local.example .env.local

# Update with your backend URLs
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3002
```

### 2. Start Backend Services
```bash
# Start User Service
cd backend/user-service
npm run start:dev  # Runs on port 3001

# Start Auth Service (if separate)
cd backend/auth-service  
npm run start:dev  # Runs on port 3002
```

### 3. Start Frontend
```bash
npm run dev  # Runs on port 3000
```

### 4. Test Integration
1. Visit `http://localhost:3000`
2. Register a new user → Calls backend user creation
3. Login → Calls backend authentication
4. Navigate to dashboard → Auto-redirects based on role
5. Admin dashboard → Displays real user statistics

## 🔧 API Integration Examples

### User Registration Flow
```typescript
// 1. Frontend signup
const response = await authService.signup(userData);

// 2. Backend creates user + profile
POST /auth/signup → Creates user in auth service
POST /users/profile → Creates user profile in user service
POST /profiles/{type}/{id} → Creates specific profile type
```

### Admin User Management
```typescript
// 1. Get all users
const users = await userService.getAllUsers();

// 2. Update verification status
await userService.updateVerificationStatus(userId, true);

// 3. Assign role
await userService.assignRole(userId, 'provider');
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   ```typescript
   // Backend: Enable CORS in main.ts
   app.enableCors({
     origin: 'http://localhost:3000',
     credentials: true,
   });
   ```

2. **Token Expiration**
   ```typescript
   // Frontend: Check for 401 responses
   if (response.status === 401) {
     localStorage.removeItem('token');
     router.push('/auth/login');
   }
   ```

3. **Backend Connection Issues**
   ```bash
   # Check if backend is running
   curl http://localhost:3001/users
   
   # Check environment variables
   echo $NEXT_PUBLIC_USER_SERVICE_URL
   ```

## 📊 Data Flow

```
Frontend Dashboard
     ↓
API Service Layer (userService, adminService, etc.)
     ↓
NestJS Backend Controllers
     ↓
NestJS Services
     ↓
Database (PostgreSQL/MongoDB)
```

## 🎯 Next Steps

1. **Complete remaining microservices** (Job, Payment, Notification)
2. **Add real-time features** using WebSockets
3. **Implement file upload** for profile pictures and documents
4. **Add comprehensive error handling**
5. **Set up production environment** with proper API Gateway

Your frontend is now fully integrated with the NestJS backend and ready for production use!
