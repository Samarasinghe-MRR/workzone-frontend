import { gatewayServices } from "@/lib/gatewayApi";
import type { ApiResponse } from "@/types";

interface QuotationRequest {
  jobId: string;
  providerId: string;
  description: string;
  amount: number;
  currency: string;
  validUntil: string;
  items?: QuotationItem[];
  notes?: string;
}

interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ProviderMetrics {
  totalQuotations: number;
  acceptedQuotations: number;
  rejectedQuotations: number;
  pendingQuotations: number;
  totalEarnings: number;
  averageQuoteValue: number;
}

interface Quotation {
  id: string;
  jobId: string;
  providerId: string;
  customerId: string;
  description: string;
  amount: number;
  currency: string;
  status: "pending" | "accepted" | "rejected" | "expired";
  validUntil: string;
  items: QuotationItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface QuotationFilters {
  status?: string;
  jobId?: string;
  providerId?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
}

class QuotationService {
  // Provider submits a quotation - uses Next.js API route
  async createProviderQuotation(
    quotationData: QuotationRequest
  ): Promise<ApiResponse<Quotation>> {
    const response = await fetch("/api/quotations/provider", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quotationData),
    });

    return response.json();
  }

  // Get provider's quotations - uses Next.js API route
  async getProviderQuotations(status?: string): Promise<ApiResponse<Quotation[]>> {
    const endpoint = status 
      ? `/api/quotations/provider?status=${encodeURIComponent(status)}`
      : "/api/quotations/provider";
    
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }

  // Update provider's quotation - matches backend: PATCH /provider/quotes/:id
  async updateProviderQuotation(
    quotationId: string,
    updateData: Partial<QuotationRequest>
  ): Promise<ApiResponse<Quotation>> {
    return gatewayServices.quotations.patch<ApiResponse<Quotation>>(
      `/provider/quotes/${quotationId}`,
      updateData,
      true
    );
  }

  // Cancel provider's quotation - matches backend: DELETE /provider/quotes/:id
  async cancelProviderQuotation(quotationId: string): Promise<ApiResponse<{ message: string }>> {
    return gatewayServices.quotations.delete<ApiResponse<{ message: string }>>(
      `/provider/quotes/${quotationId}`,
      true
    );
  }

  // Get provider quotation metrics - matches backend: GET /provider/metrics
  async getProviderMetrics(): Promise<ApiResponse<ProviderMetrics>> {
    return gatewayServices.quotations.get<ApiResponse<ProviderMetrics>>(
      "/provider/metrics",
      true
    );
  }

  // Get quotation by ID
  async getQuotationById(quotationId: string): Promise<ApiResponse<Quotation>> {
    return gatewayServices.quotations.get<ApiResponse<Quotation>>(
      `/${quotationId}`,
      true
    );
  }

  // Get all quotations with filters
  async getQuotations(
    filters?: QuotationFilters,
    page = 1,
    limit = 10
  ): Promise<
    ApiResponse<{
      quotations: Quotation[];
      total: number;
      page: number;
      limit: number;
    }>
  > {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/?${queryParams.toString()}`;
    return gatewayServices.quotations.get<
      ApiResponse<{
        quotations: Quotation[];
        total: number;
        page: number;
        limit: number;
      }>
    >(endpoint, true);
  }

  // Get quotations for a specific job
  async getQuotationsForJob(jobId: string): Promise<ApiResponse<Quotation[]>> {
    return gatewayServices.quotations.get<ApiResponse<Quotation[]>>(
      `/job/${jobId}`,
      true
    );
  }

  // Get quotations created by current provider
  async getMyQuotations(
    status?: string,
    page = 1,
    limit = 10
  ): Promise<
    ApiResponse<{
      quotations: Quotation[];
      total: number;
      page: number;
      limit: number;
    }>
  > {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (status) {
      queryParams.append("status", status);
    }

    const endpoint = `/my-quotations?${queryParams.toString()}`;
    return gatewayServices.quotations.get<
      ApiResponse<{
        quotations: Quotation[];
        total: number;
        page: number;
        limit: number;
      }>
    >(endpoint, true);
  }

    // Get quotations received by current customer for a specific job - uses Next.js API route
  async getJobQuotations(jobId: string): Promise<ApiResponse<Quotation[]>> {
    const response = await fetch(`/api/quotations/jobs/${jobId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }

  // Get specific quotation details (customer view)
  async getQuotationDetails(quotationId: string): Promise<ApiResponse<Quotation>> {
    return gatewayServices.quotations.get<ApiResponse<Quotation>>(
      `/customer/quotes/${quotationId}`,
      true
    );
  }

  // Accept quotation (by customer) - matches backend: POST /customer/quotes/:id/accept
  async acceptQuotation(
    quotationId: string, 
    customerNotes?: string
  ): Promise<ApiResponse<Quotation>> {
    return gatewayServices.quotations.post<ApiResponse<Quotation>>(
      `/customer/quotes/${quotationId}/accept`,
      { customer_notes: customerNotes },
      true
    );
  }

  // Reject quotation (by customer) - matches backend: POST /customer/quotes/:id/reject
  async rejectQuotation(
    quotationId: string,
    customerNotes?: string
  ): Promise<ApiResponse<Quotation>> {
    return gatewayServices.quotations.post<ApiResponse<Quotation>>(
      `/customer/quotes/${quotationId}/reject`,
      { customer_notes: customerNotes },
      true
    );
  }

  // Withdraw quotation (by provider)
  async withdrawQuotation(
    quotationId: string
  ): Promise<ApiResponse<Quotation>> {
    return gatewayServices.quotations.post<ApiResponse<Quotation>>(
      `/${quotationId}/withdraw`,
      {},
      true
    );
  }

  // Delete quotation
  async deleteQuotation(
    quotationId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return gatewayServices.quotations.delete<ApiResponse<{ message: string }>>(
      `/${quotationId}`,
      true
    );
  }

  // Get quotation statistics
  async getQuotationStats(): Promise<
    ApiResponse<{
      totalQuotations: number;
      pendingQuotations: number;
      acceptedQuotations: number;
      rejectedQuotations: number;
      totalValue: number;
      averageValue: number;
    }>
  > {
    return gatewayServices.quotations.get<
      ApiResponse<{
        totalQuotations: number;
        pendingQuotations: number;
        acceptedQuotations: number;
        rejectedQuotations: number;
        totalValue: number;
        averageValue: number;
      }>
    >("/stats", true);
  }

  // Generate PDF for quotation
  async generateQuotationPDF(quotationId: string): Promise<Blob> {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/quotations/${quotationId}/pdf`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    return response.blob();
  }

  // Send quotation via email
  async sendQuotationEmail(
    quotationId: string,
    recipientEmail: string,
    message?: string
  ): Promise<ApiResponse<{ message: string }>> {
    return gatewayServices.quotations.post<ApiResponse<{ message: string }>>(
      `/${quotationId}/send-email`,
      { recipientEmail, message },
      true
    );
  }
}

// Export singleton instance
export const quotationService = new QuotationService();
export default quotationService;
