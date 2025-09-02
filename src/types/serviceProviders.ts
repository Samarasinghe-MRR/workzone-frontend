// Service Provider types for customer view
export interface ServiceProvider {
  id: string;
  userId: string;
  businessName?: string;
  category: string;
  experienceYears: number;
  location: string;
  latitude: number;
  longitude: number;
  serviceRadius: number;
  averageResponseTime: number;
  rating: number;
  availability: boolean;
  isAvailable: boolean;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    isVerified: boolean;
  };
  specializations?: ServiceProviderSpecialization[];
  completedJobs?: number;
  hourlyRate?: number;
  distance?: number; // Calculated distance from customer
}

export interface ServiceProviderSpecialization {
  id: string;
  providerId: string;
  categoryId: string;
  isActive: boolean;
  category?: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface GetServiceProvidersParams {
  category?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  minRating?: number;
  maxPrice?: number;
  availability?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "rating" | "distance" | "price" | "experience";
  sortOrder?: "asc" | "desc";
}

export interface ServiceProvidersResponse {
  success: boolean;
  data: {
    providers: ServiceProvider[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  message: string;
}
