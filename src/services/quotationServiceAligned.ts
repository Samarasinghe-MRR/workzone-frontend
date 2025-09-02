import { gatewayServices } from "@/lib/gatewayApi";
import type { ApiResponse, QuotationAligned } from "@/types";

class QuotationService {
  // Create a new quotation
  async createQuotation(
    quotationData: QuotationAligned.CreateQuotationRequest
  ): Promise<QuotationAligned.QuotationResponse> {
    return gatewayServices.quotations.post<QuotationAligned.QuotationResponse>(
      "/",
      quotationData,
      true
    );
  }

  // Get quotation by ID
  async getQuotationById(
    id: string
  ): Promise<QuotationAligned.QuotationResponse> {
    return gatewayServices.quotations.get<QuotationAligned.QuotationResponse>(
      `/${id}`,
      true
    );
  }

  // Update quotation
  async updateQuotation(
    id: string,
    quotationData: QuotationAligned.UpdateQuotationRequest
  ): Promise<QuotationAligned.QuotationResponse> {
    return gatewayServices.quotations.put<QuotationAligned.QuotationResponse>(
      `/${id}`,
      quotationData,
      true
    );
  }

  // Delete quotation
  async deleteQuotation(id: string): Promise<ApiResponse<{ message: string }>> {
    return gatewayServices.quotations.delete<ApiResponse<{ message: string }>>(
      `/${id}`,
      true
    );
  }

  // Get quotations with filters
  async getQuotations(
    page = 1,
    limit = 10,
    filters?: QuotationAligned.QuotationFilters
  ): Promise<QuotationAligned.QuotationsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v.toString()));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    const endpoint = `/?${queryParams.toString()}`;
    return gatewayServices.quotations.get<QuotationAligned.QuotationsResponse>(
      endpoint,
      true
    );
  }

  // Get quotations for a specific job
  async getJobQuotations(
    jobId: string
  ): Promise<QuotationAligned.QuotationsResponse> {
    return gatewayServices.quotations.get<QuotationAligned.QuotationsResponse>(
      `/job/${jobId}`,
      true
    );
  }

  // Get quotations submitted by current provider
  async getMyQuotations(
    page = 1,
    limit = 10,
    status?: QuotationAligned.QuoteStatus
  ): Promise<QuotationAligned.QuotationsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (status) {
      queryParams.append("status", status);
    }

    const endpoint = `/my-quotations?${queryParams.toString()}`;
    return gatewayServices.quotations.get<QuotationAligned.QuotationsResponse>(
      endpoint,
      true
    );
  }

  // Get quotations received by current customer
  async getReceivedQuotations(
    page = 1,
    limit = 10,
    status?: QuotationAligned.QuoteStatus
  ): Promise<QuotationAligned.QuotationsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (status) {
      queryParams.append("status", status);
    }

    const endpoint = `/received?${queryParams.toString()}`;
    return gatewayServices.quotations.get<QuotationAligned.QuotationsResponse>(
      endpoint,
      true
    );
  }

  // Accept quotation (customer)
  async acceptQuotation(
    id: string
  ): Promise<QuotationAligned.QuotationResponse> {
    return gatewayServices.quotations.post<QuotationAligned.QuotationResponse>(
      `/${id}/accept`,
      {},
      true
    );
  }

  // Reject quotation (customer)
  async rejectQuotation(
    id: string,
    reason?: string
  ): Promise<QuotationAligned.QuotationResponse> {
    return gatewayServices.quotations.post<QuotationAligned.QuotationResponse>(
      `/${id}/reject`,
      { reason },
      true
    );
  }

  // Cancel/withdraw quotation (provider)
  async cancelQuotation(
    id: string
  ): Promise<QuotationAligned.QuotationResponse> {
    return gatewayServices.quotations.post<QuotationAligned.QuotationResponse>(
      `/${id}/cancel`,
      {},
      true
    );
  }

  // Get quotation invitations for current provider
  async getInvitations(
    page = 1,
    limit = 10,
    status?: QuotationAligned.InviteStatus
  ): Promise<QuotationAligned.InvitationsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (status) {
      queryParams.append("status", status);
    }

    const endpoint = `/invitations?${queryParams.toString()}`;
    return gatewayServices.quotations.get<QuotationAligned.InvitationsResponse>(
      endpoint,
      true
    );
  }

  // Get invitation by ID
  async getInvitationById(
    id: string
  ): Promise<QuotationAligned.InvitationResponse> {
    return gatewayServices.quotations.get<QuotationAligned.InvitationResponse>(
      `/invitations/${id}`,
      true
    );
  }

  // Respond to invitation by submitting quotation
  async respondToInvitation(
    inviteId: string,
    quotationData: QuotationAligned.CreateQuotationRequest
  ): Promise<QuotationAligned.QuotationResponse> {
    return gatewayServices.quotations.post<QuotationAligned.QuotationResponse>(
      `/invitations/${inviteId}/respond`,
      quotationData,
      true
    );
  }

  // Ignore invitation
  async ignoreInvitation(
    inviteId: string
  ): Promise<QuotationAligned.InvitationResponse> {
    return gatewayServices.quotations.post<QuotationAligned.InvitationResponse>(
      `/invitations/${inviteId}/ignore`,
      {},
      true
    );
  }

  // Create job eligibility criteria (customer/admin)
  async createJobEligibilityCriteria(
    criteria: QuotationAligned.CreateJobEligibilityCriteriaRequest
  ): Promise<ApiResponse<QuotationAligned.JobEligibilityCriteria>> {
    return gatewayServices.quotations.post<
      ApiResponse<QuotationAligned.JobEligibilityCriteria>
    >("/job-criteria", criteria, true);
  }

  // Get eligibility criteria for a job
  async getJobEligibilityCriteria(
    jobId: string
  ): Promise<ApiResponse<QuotationAligned.JobEligibilityCriteria>> {
    return gatewayServices.quotations.get<
      ApiResponse<QuotationAligned.JobEligibilityCriteria>
    >(`/job-criteria/${jobId}`, true);
  }

  // Get provider metrics
  async getProviderMetrics(
    providerId?: string
  ): Promise<ApiResponse<QuotationAligned.QuotationMetrics>> {
    const endpoint = providerId
      ? `/metrics/provider/${providerId}`
      : "/metrics/my";

    return gatewayServices.quotations.get<
      ApiResponse<QuotationAligned.QuotationMetrics>
    >(endpoint, true);
  }

  // Get quotation statistics for admin/analytics
  async getQuotationStatistics(): Promise<
    ApiResponse<QuotationAligned.QuotationStatistics>
  > {
    return gatewayServices.quotations.get<
      ApiResponse<QuotationAligned.QuotationStatistics>
    >("/statistics", true);
  }

  // Search quotations
  async searchQuotations(
    searchTerm: string,
    filters?: QuotationAligned.QuotationFilters
  ): Promise<QuotationAligned.QuotationsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("q", searchTerm);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v.toString()));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    return gatewayServices.quotations.get<QuotationAligned.QuotationsResponse>(
      `/search?${queryParams.toString()}`,
      true
    );
  }

  // Get enhanced quotation with populated relationships
  async getEnhancedQuotation(
    id: string
  ): Promise<ApiResponse<QuotationAligned.EnhancedQuotation>> {
    return gatewayServices.quotations.get<
      ApiResponse<QuotationAligned.EnhancedQuotation>
    >(`/${id}/enhanced`, true);
  }

  // Bulk update quotation status (admin)
  async bulkUpdateQuotationStatus(
    quotationIds: string[],
    status: QuotationAligned.QuoteStatus
  ): Promise<ApiResponse<{ message: string; updated: number }>> {
    return gatewayServices.quotations.patch<
      ApiResponse<{ message: string; updated: number }>
    >("/bulk-update-status", { quotationIds, status }, true);
  }
}

// Export singleton instance
export const quotationService = new QuotationService();
export default quotationService;
