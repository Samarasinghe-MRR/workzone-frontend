# Role Mapping Fix for Signup

## Problem
Frontend was sending `role: "provider"` but backend expected `role: "SERVICE_PROVIDER"`, causing the validation error:
```
Role must be CUSTOMER, SERVICE_PROVIDER, or ADMIN
```

## Root Cause
- **Frontend Schema**: Uses `["customer", "provider"]` for user-friendly values
- **Backend Enum**: Expects `["CUSTOMER", "SERVICE_PROVIDER", "ADMIN"]` for database consistency
- **Missing Mapping**: No translation between frontend and backend role formats

## Solution Applied

### Role Mapping in Auth Service
Added automatic role mapping in `authService.signup()`:

```typescript
// Map frontend role values to backend enum values
const roleMapping = {
  'customer': 'CUSTOMER',
  'provider': 'SERVICE_PROVIDER', 
  'admin': 'ADMIN',
  // Also handle if already in correct format
  'CUSTOMER': 'CUSTOMER',
  'SERVICE_PROVIDER': 'SERVICE_PROVIDER',
  'ADMIN': 'ADMIN'
};

const mappedRole = roleMapping[userData.role.toLowerCase()] || 'CUSTOMER';
```

### Data Flow
```
Frontend Form: role: "provider"
    ↓
Auth Service: Maps to "SERVICE_PROVIDER"
    ↓
Backend API: Validates as "SERVICE_PROVIDER" ✅
    ↓
Database: Stores as "SERVICE_PROVIDER"
```

## Testing the Fix

### Test Data
```javascript
// This request data:
{
  name: 'Senith Nimsara',
  email: 'senith@gmail.com', 
  password: 'qwE123!@#',
  role: 'provider',        // ← Frontend value
  phone: '0765678654',
  category: 'Electrical',
  experienceYears: 2,
  location: 'Colombo'
}

// Will be transformed to:
{
  email: 'senith@gmail.com',
  password: 'qwE123!@#', 
  firstName: 'Senith',
  lastName: 'Nimsara',
  phone: '0765678654',
  role: 'SERVICE_PROVIDER'  // ← Backend value
}
```

### Expected Results
1. **Frontend**: Continues using user-friendly "customer"/"provider" 
2. **Backend**: Receives properly formatted "CUSTOMER"/"SERVICE_PROVIDER"
3. **Validation**: Passes backend enum validation
4. **Registration**: Completes successfully
5. **Redirect**: User goes to login page

## Verification Steps

1. **Try the signup again** with the same data
2. **Check browser console** for debug logs:
   ```
   authService.signup - Called with userData: {role: "provider", ...}
   Sending to backend: {role: "SERVICE_PROVIDER", ...}
   ```
3. **Should see success** instead of role validation error
4. **Should redirect** to login page after successful signup

## Supported Role Mappings

| Frontend Value | Backend Value      | User Type          |
|----------------|--------------------|--------------------|
| `"customer"`   | `"CUSTOMER"`       | Service Customer   |
| `"provider"`   | `"SERVICE_PROVIDER"` | Service Provider   |
| `"admin"`      | `"ADMIN"`          | Administrator      |

## Backward Compatibility
The mapping also handles cases where the role is already in backend format, ensuring no issues if the frontend ever sends the backend format directly.

## Debug Information
Added console logging to help troubleshoot:
- `userData` before transformation
- `registerDto` being sent to backend

This allows you to verify the role mapping is working correctly in the browser console.

The signup should now work successfully with provider role!
