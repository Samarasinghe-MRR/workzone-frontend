/**
 * Updated Quotation types aligned with Quotation Service Prisma Schema
 */

// Invite Status enum matching schema
export enum InviteStatus {
  INVITED = "INVITED", // Provider was invited (based on location & category)
  RESPONDED = "RESPONDED", // Provider submitted a quotation
  IGNORED = "IGNORED", // Did not respond until expiry
  EXPIRED = "EXPIRED", // Invitation expired
}

// Quote Status enum matching schema
export enum QuoteStatus {
  PENDING = "PENDING", // Provider sent quote, awaiting customer response
  ACCEPTED = "ACCEPTED", // Customer accepted this quote
  REJECTED = "REJECTED", // Customer rejected this quote
  CANCELLED = "CANCELLED", // Provider cancelled/withdrew their quote
  EXPIRED = "EXPIRED", // Quote expired (past valid_until date)
}

// Event Type enum matching schema
export enum EventType {
  // Invitation events
  QUOTE_INVITED = "QUOTE_INVITED", // Provider was invited to quote
  INVITE_EXPIRED = "INVITE_EXPIRED", // Invitation expired without response

  // Quote lifecycle events
  QUOTE_SUBMITTED = "QUOTE_SUBMITTED", // Provider submitted a quotation
  QUOTE_UPDATED = "QUOTE_UPDATED", // Provider updated their quotation
  QUOTE_WITHDRAWN = "QUOTE_WITHDRAWN", // Provider cancelled/withdrew their quote

  // Customer decision events
  QUOTE_ACCEPTED = "QUOTE_ACCEPTED", // Customer accepted this quote
  QUOTE_REJECTED = "QUOTE_REJECTED", // Customer rejected this quote

  // System events
  QUOTE_EXPIRED = "QUOTE_EXPIRED", // Quote expired (past valid_until date)
  PROVIDER_IGNORED = "PROVIDER_IGNORED", // Provider ignored invitation
}

// Job Quotation Invite aligned with schema
export interface JobQuotationInvite {
  id: string;
  job_id: string;
  provider_id: string;
  provider_email: string;
  job_category: string; // e.g., "plumbing", "electrical"
  distance_km?: number; // Distance from job location to provider
  invited_at: string;
  expires_at: string; // Invitation expires after X hours
  responded: boolean;
  response_at?: string;
  status: InviteStatus;

  // Job details cached for quick access
  job_title?: string;
  job_location?: string;
  customer_id?: string;

  // Relations
  quotations?: Quotation[]; // All quotes submitted for this invitation

  // UI computed fields
  jobId?: string; // Alias for job_id
  providerId?: string; // Alias for provider_id
  providerEmail?: string; // Alias for provider_email
  jobCategory?: string; // Alias for job_category
  distanceKm?: number; // Alias for distance_km
  invitedAt?: string; // Alias for invited_at
  expiresAt?: string; // Alias for expires_at
  responseAt?: string; // Alias for response_at
  jobTitle?: string; // Alias for job_title
  jobLocation?: string; // Alias for job_location
  customerId?: string; // Alias for customer_id
}

// Quotation aligned with schema
export interface Quotation {
  id: string;
  job_id: string;
  provider_id: string;
  provider_email: string;
  invite_id?: string; // Links back to the invitation
  price: number;
  estimated_time?: string; // e.g., "2 hours", "1 day"
  message?: string; // Provider's custom note/description
  status: QuoteStatus;
  created_at: string;
  updated_at: string;

  // Extended fields based on UI requirements
  proposed_start?: string; // When provider can start - e.g., "Today 3:00 PM"
  includes_tools: boolean; // Provider brings own tools
  eco_friendly: boolean; // Eco-friendly service option
  valid_until?: string; // Quote expiry date

  // Additional service details
  warranty_period?: string; // e.g., "1 year", "6 months"
  materials_cost?: number; // Separate materials cost
  labor_cost?: number; // Separate labor cost

  // Customer interaction
  customer_notes?: string; // Customer's special requests/notes
  accepted_at?: string;
  rejected_at?: string;
  cancelled_at?: string;

  // Response timing analytics
  response_time_hours?: number; // How long after invitation was this quote submitted

  // Relations
  invitation?: JobQuotationInvite;

  // UI computed fields
  jobId?: string; // Alias for job_id
  providerId?: string; // Alias for provider_id
  providerEmail?: string; // Alias for provider_email
  inviteId?: string; // Alias for invite_id
  estimatedTime?: string; // Alias for estimated_time
  createdAt?: string; // Alias for created_at
  updatedAt?: string; // Alias for updated_at
  proposedStart?: string; // Alias for proposed_start
  ecoFriendly?: boolean; // Alias for eco_friendly
  validUntil?: string; // Alias for valid_until
  warrantyPeriod?: string; // Alias for warranty_period
  materialsCost?: number; // Alias for materials_cost
  laborCost?: number; // Alias for labor_cost
  customerNotes?: string; // Alias for customer_notes
  acceptedAt?: string; // Alias for accepted_at
  rejectedAt?: string; // Alias for rejected_at
  cancelledAt?: string; // Alias for cancelled_at
  responseTimeHours?: number; // Alias for response_time_hours

  // Legacy fields for UI compatibility
  amount?: number; // Alias for price
  currency?: string; // Default currency
  description?: string; // Alias for message
  notes?: string; // Alias for message
  items?: QuotationItem[]; // For itemized quotes (UI enhancement)
}

// Quote Event aligned with schema
export interface QuoteEvent {
  id: string;
  event_type: EventType; // Structured event types
  quote_id?: string; // Nullable for invite events
  invite_id?: string; // For invitation-related events
  job_id: string;
  provider_id: string;
  customer_id?: string;
  payload: Record<string, unknown>; // Event data (JSON)
  processed: boolean;
  created_at: string;

  // UI computed fields
  eventType?: EventType; // Alias for event_type
  quoteId?: string; // Alias for quote_id
  inviteId?: string; // Alias for invite_id
  jobId?: string; // Alias for job_id
  providerId?: string; // Alias for provider_id
  customerId?: string; // Alias for customer_id
  createdAt?: string; // Alias for created_at
}

// Quotation Metrics aligned with schema
export interface QuotationMetrics {
  id: string;
  provider_id: string;

  // Invitation metrics
  total_invites: number; // How many jobs provider was invited to
  total_responses: number; // How many invites provider responded to
  ignored_invites: number; // How many invites provider ignored

  // Quote submission metrics
  total_quotes: number; // Total quotes submitted
  accepted_quotes: number; // Quotes accepted by customers
  rejected_quotes: number; // Quotes rejected by customers
  withdrawn_quotes: number; // Quotes withdrawn by provider

  // Performance metrics
  average_price?: number; // Average quote price
  average_response_time_hours?: number; // Average time to respond to invitations
  response_rate?: number; // Percentage of invites that got responses
  success_rate?: number; // Percentage of quotes that got accepted

  // Geographic metrics
  average_distance_km?: number; // Average distance from jobs
  max_distance_km?: number; // Furthest job provider quoted for

  // Time-based metrics
  last_invite_at?: string; // Last time provider was invited
  last_quote_at?: string; // Last time provider submitted a quote

  created_at: string;
  updated_at: string;

  // UI computed fields
  providerId?: string; // Alias for provider_id
  totalInvites?: number; // Alias for total_invites
  totalResponses?: number; // Alias for total_responses
  ignoredInvites?: number; // Alias for ignored_invites
  totalQuotes?: number; // Alias for total_quotes
  acceptedQuotes?: number; // Alias for accepted_quotes
  rejectedQuotes?: number; // Alias for rejected_quotes
  withdrawnQuotes?: number; // Alias for withdrawn_quotes
  averagePrice?: number; // Alias for average_price
  averageResponseTimeHours?: number; // Alias for average_response_time_hours
  responseRate?: number; // Alias for response_rate
  successRate?: number; // Alias for success_rate
  averageDistanceKm?: number; // Alias for average_distance_km
  maxDistanceKm?: number; // Alias for max_distance_km
  lastInviteAt?: string; // Alias for last_invite_at
  lastQuoteAt?: string; // Alias for last_quote_at
  createdAt?: string; // Alias for created_at
  updatedAt?: string; // Alias for updated_at
}

// Job Eligibility Criteria aligned with schema
export interface JobEligibilityCriteria {
  id: string;
  job_id: string;
  max_distance_km: number; // Maximum distance for provider eligibility
  required_category: string; // Job category (plumbing, electrical, etc.)
  min_provider_rating?: number; // Minimum provider rating required
  max_providers_invited: number; // Maximum number of providers to invite
  invite_expires_hours: number; // How long invites are valid

  // Geographic constraints
  job_latitude?: number;
  job_longitude?: number;
  job_address?: string;

  // Timing constraints
  preferred_start?: string;
  deadline?: string;

  // Special requirements
  requires_tools: boolean;
  eco_friendly_only: boolean;
  emergency_job: boolean;

  created_at: string;
  updated_at: string;

  // UI computed fields
  jobId?: string; // Alias for job_id
  maxDistanceKm?: number; // Alias for max_distance_km
  requiredCategory?: string; // Alias for required_category
  minProviderRating?: number; // Alias for min_provider_rating
  maxProvidersInvited?: number; // Alias for max_providers_invited
  inviteExpiresHours?: number; // Alias for invite_expires_hours
  jobLatitude?: number; // Alias for job_latitude
  jobLongitude?: number; // Alias for job_longitude
  jobAddress?: string; // Alias for job_address
  preferredStart?: string; // Alias for preferred_start
  requiresTools?: boolean; // Alias for requires_tools
  ecoFriendlyOnly?: boolean; // Alias for eco_friendly_only
  emergencyJob?: boolean; // Alias for emergency_job
  createdAt?: string; // Alias for created_at
  updatedAt?: string; // Alias for updated_at
}

// DTOs for API requests
export interface CreateQuotationRequest {
  job_id: string;
  price: number;
  estimated_time?: string;
  message?: string;
  proposed_start?: string;
  includes_tools?: boolean;
  eco_friendly?: boolean;
  valid_until?: string;
  warranty_period?: string;
  materials_cost?: number;
  labor_cost?: number;

  // Legacy field support
  jobId?: string; // Alias for job_id
  amount?: number; // Alias for price
  estimatedTime?: string; // Alias for estimated_time
  description?: string; // Alias for message
  proposedStart?: string; // Alias for proposed_start
  includesTools?: boolean; // Alias for includes_tools
  ecoFriendly?: boolean; // Alias for eco_friendly
  validUntil?: string; // Alias for valid_until
  warrantyPeriod?: string; // Alias for warranty_period
  materialsCost?: number; // Alias for materials_cost
  laborCost?: number; // Alias for labor_cost
  currency?: string;
  notes?: string;
  items?: QuotationItem[];
}

export interface UpdateQuotationRequest {
  price?: number;
  estimated_time?: string;
  message?: string;
  proposed_start?: string;
  includes_tools?: boolean;
  eco_friendly?: boolean;
  valid_until?: string;
  warranty_period?: string;
  materials_cost?: number;
  labor_cost?: number;

  // Legacy field support
  amount?: number;
  estimatedTime?: string;
  description?: string;
  proposedStart?: string;
  includesTools?: boolean;
  ecoFriendly?: boolean;
  validUntil?: string;
  warrantyPeriod?: string;
  materialsCost?: number;
  laborCost?: number;
}

export interface CreateJobEligibilityCriteriaRequest {
  job_id: string;
  max_distance_km?: number;
  required_category: string;
  min_provider_rating?: number;
  max_providers_invited?: number;
  invite_expires_hours?: number;
  job_latitude?: number;
  job_longitude?: number;
  job_address?: string;
  preferred_start?: string;
  deadline?: string;
  requires_tools?: boolean;
  eco_friendly_only?: boolean;
  emergency_job?: boolean;
}

// Legacy support for existing UI
export interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface QuotationFilters {
  status?: QuoteStatus | QuoteStatus[];
  job_id?: string;
  provider_id?: string;
  customer_id?: string;
  date_from?: string;
  date_to?: string;
  min_price?: number;
  max_price?: number;
  includes_tools?: boolean;
  eco_friendly?: boolean;

  // Legacy field support
  jobId?: string;
  providerId?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  minPrice?: number;
  maxPrice?: number;
  includesTools?: boolean;
  ecoFriendly?: boolean;
}

// API Response structures
export interface QuotationResponse {
  success: boolean;
  message: string;
  data?: Quotation;
}

export interface QuotationsResponse {
  success: boolean;
  message: string;
  data?: {
    quotations: Quotation[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface InvitationResponse {
  success: boolean;
  message: string;
  data?: JobQuotationInvite;
}

export interface InvitationsResponse {
  success: boolean;
  message: string;
  data?: {
    invitations: JobQuotationInvite[];
    total: number;
    page: number;
    limit: number;
  };
}

// Quotation Statistics
export interface QuotationStatistics {
  totalQuotations: number;
  pendingQuotations: number;
  acceptedQuotations: number;
  rejectedQuotations: number;
  cancelledQuotations: number;
  expiredQuotations: number;
  totalValue: number;
  averageValue: number;
  averageResponseTime: number; // in hours
  topProviders: Array<{
    providerId: string;
    providerName: string;
    quotationCount: number;
    successRate: number;
    averagePrice: number;
  }>;
}

// Enhanced quotation for UI with populated relationships
export interface EnhancedQuotation extends Quotation {
  job?: {
    id: string;
    title: string;
    description: string;
    category: string;
    location?: string;
    budget_min?: number;
    budget_max?: number;
    customer_id: string;
  };
  provider?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    rating?: number;
    responseTime?: number;
    location?: string;
  };
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    rating?: number;
  };
}
