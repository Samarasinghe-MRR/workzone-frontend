// Shared TypeScript types and interfaces

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  status?: "Active" | "Inactive" | "Pending";
  memberSince?: string;
}

export interface AuthUser extends User {
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  imageUrl?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  userId: string;
}

export interface PaymentMethod {
  id: string;
  type: "Visa" | "Mastercard" | "American Express" | "Discover";
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
