/**
 * Home Page Schemas
 * Zod validation schemas for home page related forms and data
 */

import { z } from "zod";

// Contact Form Schema - for the contact section
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must not exceed 255 characters"),
  phone: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^[\+]?[(]?[\d\s\-\(\)]{10,}$/.test(value),
      "Please enter a valid phone number"
    ),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must not exceed 200 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must not exceed 1000 characters"),
  preferredContact: z
    .enum(["email", "phone"], {
      required_error: "Please select a preferred contact method",
    })
    .optional(),
});

// Newsletter Subscription Schema
export const newsletterSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must not exceed 255 characters"),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .optional(),
  interests: z.array(z.string()).optional(),
});

// Service Request Schema - for quick service booking from home page
export const serviceRequestSchema = z.object({
  serviceType: z.string().min(1, "Please select a service type"),
  location: z
    .string()
    .min(5, "Please enter your location")
    .max(200, "Location must not exceed 200 characters"),
  urgency: z.enum(["low", "medium", "high", "urgent"], {
    required_error: "Please select urgency level",
  }),
  description: z
    .string()
    .min(10, "Please provide more details about your request")
    .max(500, "Description must not exceed 500 characters"),
  budget: z
    .object({
      min: z.number().min(0, "Minimum budget must be at least $0"),
      max: z.number().min(0, "Maximum budget must be at least $0"),
    })
    .optional()
    .refine(
      (budget) => !budget || budget.min <= budget.max,
      "Minimum budget must be less than or equal to maximum budget"
    ),
  preferredDate: z
    .string()
    .optional()
    .refine(
      (date) => !date || new Date(date) >= new Date(),
      "Preferred date must be in the future"
    ),
  contactInfo: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
  }),
});

// Search Form Schema - for service search
export const searchFormSchema = z.object({
  query: z
    .string()
    .min(2, "Search query must be at least 2 characters")
    .max(100, "Search query must not exceed 100 characters"),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must not exceed 100 characters")
    .optional(),
  category: z.string().optional(),
  priceRange: z
    .object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
    })
    .optional(),
  radius: z
    .number()
    .min(1, "Radius must be at least 1 mile")
    .max(100, "Radius must not exceed 100 miles")
    .optional(),
});

// Feedback Form Schema - for home page feedback
export const feedbackSchema = z.object({
  rating: z
    .number()
    .min(1, "Please provide a rating")
    .max(5, "Rating must be between 1 and 5"),
  feedback: z
    .string()
    .min(10, "Feedback must be at least 10 characters")
    .max(500, "Feedback must not exceed 500 characters"),
  category: z.enum(["website", "service", "support", "other"], {
    required_error: "Please select a feedback category",
  }),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  anonymous: z.boolean().default(false),
});

// Get Started Form Schema - for initial user onboarding
export const getStartedSchema = z.object({
  userType: z.enum(["customer", "provider"], {
    required_error:
      "Please select whether you want to book services or provide services",
  }),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must not exceed 100 characters"),
  interestedServices: z
    .array(z.string())
    .min(1, "Please select at least one service category")
    .optional(),
});

// Type exports for use in components
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;
export type ServiceRequestData = z.infer<typeof serviceRequestSchema>;
export type SearchFormData = z.infer<typeof searchFormSchema>;
export type FeedbackData = z.infer<typeof feedbackSchema>;
export type GetStartedData = z.infer<typeof getStartedSchema>;

// Schema collection for easy import
export const homeSchemas = {
  contactForm: contactFormSchema,
  newsletter: newsletterSchema,
  serviceRequest: serviceRequestSchema,
  searchForm: searchFormSchema,
  feedback: feedbackSchema,
  getStarted: getStartedSchema,
};

export default homeSchemas;
