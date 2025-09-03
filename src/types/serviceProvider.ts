// Service Provider Profile Types
export interface ServiceProviderProfile {
  id: string;
  userId: string;
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
  // Additional fields for UI compatibility
  businessName?: string; // Can be derived from category or user info
  businessAddress?: string; // Can be derived from location
  bio?: string; // Not in schema, for UI purposes
  yearsOfExperience?: number; // Maps to experienceYears
  hourlyRate?: number; // Not in schema, for UI purposes
  responseTimeHours?: number; // Maps to averageResponseTime
  completedJobs?: number; // Not in schema, for UI purposes
  certifications?: string[]; // Not in schema, for UI purposes
  portfolioImages?: string[]; // Not in schema, for UI purposes
  specializations?: Specialization[];
}

export interface Specialization {
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

export interface UpdateServiceProviderProfileDto {
  category?: string;
  experienceYears?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  serviceRadius?: number;
  averageResponseTime?: number;
  availability?: boolean;
  isAvailable?: boolean;
  // UI compatibility fields (will be mapped to schema fields)
  businessName?: string; // Maps to category
  businessAddress?: string; // Maps to location
  bio?: string; // Stored separately or ignored
  yearsOfExperience?: number; // Maps to experienceYears
  hourlyRate?: number; // Stored separately or ignored
  responseTimeHours?: number; // Maps to averageResponseTime
  certifications?: string[]; // Stored separately or ignored
  portfolioImages?: string[]; // Stored separately or ignored
  specializationCategoryIds?: string[];
}

export interface ServiceProviderProfileResponse {
  success: boolean;
  data: ServiceProviderProfile | null;
  message: string;
}
