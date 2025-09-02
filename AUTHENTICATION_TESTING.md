# Authentication Flow Test Guide

## Testing the Complete Authentication Architecture

This guide helps you test the connection between Auth Service and User Service endpoints.

## 🧪 Testing Endpoints

### 1. Test `/api/users/me` - Current User Profile

```bash
# First login to get token (Auth Service)
curl -X POST "http://localhost:3000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123"
  }'

# Copy the access_token from response, then test user profile
curl -X GET "http://localhost:3030/api/users/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. Test `/api/users/me/dashboard` - Role-Specific Dashboard

```bash
# Using the same token from login
curl -X GET "http://localhost:3030/api/users/me/dashboard" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Test `/api/users/[id]` - Specific User Data

```bash
# Using a valid user ID
curl -X GET "http://localhost:3030/api/users/49979cb5-31ae-46fc-8892-e7972259c40d" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔍 Frontend Testing

### React Component Example

```typescript
import { useAuthDashboard } from '@/hooks/useDashboard';

const DashboardPage = () => {
  const { user, dashboard, loading, error, refetch } = useAuthDashboard();

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      
      {/* Customer Dashboard */}
      {user?.role === 'CUSTOMER' && (
        <div>
          <h2>Your Statistics</h2>
          <p>Total Jobs: {dashboard?.statistics.totalJobs}</p>
          <p>Completed: {dashboard?.statistics.completedJobs}</p>
          <p>Total Spent: ${dashboard?.statistics.totalSpent}</p>
          
          <h3>Recent Jobs</h3>
          {dashboard?.jobs.posted.map(job => (
            <div key={job.id}>
              <h4>{job.title}</h4>
              <p>Status: {job.status}</p>
              <p>Budget: ${job.budget}</p>
            </div>
          ))}
        </div>
      )}

      {/* Provider Dashboard */}
      {user?.role === 'SERVICE_PROVIDER' && (
        <div>
          <h2>Provider Statistics</h2>
          <p>Total Earned: ${dashboard?.statistics.totalEarned}</p>
          <p>Completed Jobs: {dashboard?.statistics.completedJobs}</p>
          <p>Average Rating: {dashboard?.statistics.averageRating}⭐</p>
          
          <h3>Assigned Jobs</h3>
          {dashboard?.jobs.assigned.map(job => (
            <div key={job.id}>
              <h4>{job.title}</h4>
              <p>Status: {job.status}</p>
              <p>Budget: ${job.budget}</p>
            </div>
          ))}
        </div>
      )}

      <button onClick={refetch}>Refresh Dashboard</button>
    </div>
  );
};
```

### Simple API Test Component

```typescript
import { useState } from 'react';
import { dashboardService } from '@/services/dashboardService';

const ApiTester = () => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testUserProfile = async () => {
    setLoading(true);
    try {
      const result = await dashboardService.getCurrentUser();
      setResults({ type: 'User Profile', data: result });
    } catch (error) {
      setResults({ type: 'User Profile', error: error.message });
    }
    setLoading(false);
  };

  const testDashboard = async () => {
    setLoading(true);
    try {
      const result = await dashboardService.getDashboardData();
      setResults({ type: 'Dashboard', data: result });
    } catch (error) {
      setResults({ type: 'Dashboard', error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2>API Endpoint Tester</h2>
      
      <div className="space-x-2 mb-4">
        <button 
          onClick={testUserProfile}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test /users/me
        </button>
        
        <button 
          onClick={testDashboard}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Test /users/me/dashboard
        </button>
      </div>

      {loading && <p>Testing...</p>}
      
      {results && (
        <div className="mt-4">
          <h3>{results.type} Results:</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(results.data || results.error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
```

## 🎯 Expected Responses

### `/api/users/me` Response
```json
{
  "success": true,
  "data": {
    "id": "49979cb5-31ae-46fc-8892-e7972259c40d",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "CUSTOMER",
    "verified": true,
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "message": "Profile fetched successfully"
}
```

### `/api/users/me/dashboard` Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "49979cb5-31ae-46fc-8892-e7972259c40d",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "CUSTOMER"
    },
    "statistics": {
      "totalJobs": 5,
      "completedJobs": 3,
      "totalSpent": 1250.00,
      "completionRate": 60,
      "averageRating": 4.5,
      "totalEarned": 0
    },
    "jobs": {
      "posted": [...],
      "assigned": [],
      "completed": [...]
    },
    "quotations": {
      "received": [...],
      "submitted": []
    },
    "recentActivity": [...]
  },
  "message": "Dashboard data fetched successfully"
}
```

## 🔧 Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check if token is properly stored in localStorage
   - Verify token format in Authorization header
   - Ensure token hasn't expired

2. **Backend Connection Error**
   - Verify backend services are running on correct ports
   - Check if CORS is properly configured
   - Confirm endpoint URLs match backend routes

3. **Mock Data Response**
   - This indicates backend is unavailable
   - Check backend service status
   - Verify network connectivity

### Debug Steps

1. **Check Token Storage**
```javascript
console.log('Token:', localStorage.getItem('token'));
```

2. **Inspect Network Requests**
   - Open browser DevTools → Network tab
   - Look for requests to `/api/users/me` and `/api/users/me/dashboard`
   - Check request headers include Authorization

3. **Backend Service Status**
```bash
# Check if services are running
curl http://localhost:3000/health  # Auth Service
curl http://localhost:3001/health  # User Service
```

## 🚀 Integration Complete

Your authentication architecture now includes:

✅ **Auth Service Integration** - Login returns JWT tokens  
✅ **User Service Integration** - Profile and dashboard endpoints  
✅ **Frontend API Routes** - Next.js API routes forward to backend  
✅ **TypeScript Types** - Full type safety for dashboard data  
✅ **React Hooks** - Easy-to-use hooks for authentication state  
✅ **Error Handling** - Graceful fallbacks and error messages  
✅ **Mock Data** - Development support when backend unavailable  

The complete authentication flow from login to role-specific dashboard data is now functional! 🎯
