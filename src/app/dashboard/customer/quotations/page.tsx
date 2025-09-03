'use client';

import { useState, useEffect } from 'react';
import { quotationService } from '@/services/quotationService';
import { jobService } from '@/services/jobService';
import { Loader } from '@/components/common';

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
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Job {
  id: string;
  title: string;
  description?: string;
  status?: string;
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch customer jobs first
        const jobsResponse = await jobService.getMyJobs();
        if (jobsResponse.success && jobsResponse.data) {
          setJobs(jobsResponse.data);
          
          // Fetch quotations for each job
          const allQuotations: Quotation[] = [];
          for (const job of jobsResponse.data) {
            try {
              const quotationsResponse = await quotationService.getJobQuotations(job.id);
              if (quotationsResponse.success && quotationsResponse.data) {
                allQuotations.push(...quotationsResponse.data);
              }
            } catch (err) {
              console.error(`Failed to fetch quotations for job ${job.id}:`, err);
            }
          }
          
          setQuotations(allQuotations);
        } else {
          setError('Failed to load jobs');
        }
      } catch (err) {
        setError('Failed to load quotations');
        console.error('Error fetching quotations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAcceptQuotation = async (quotationId: string) => {
    try {
      await quotationService.acceptQuotation(quotationId);
      // Update the quotation status locally
      setQuotations(prev => 
        prev.map(q => 
          q.id === quotationId 
            ? { ...q, status: 'accepted' as const }
            : q
        )
      );
    } catch (err) {
      console.error('Failed to accept quotation:', err);
      setError('Failed to accept quotation');
    }
  };

  const handleRejectQuotation = async (quotationId: string) => {
    try {
      await quotationService.rejectQuotation(quotationId);
      // Update the quotation status locally
      setQuotations(prev => 
        prev.map(q => 
          q.id === quotationId 
            ? { ...q, status: 'rejected' as const }
            : q
        )
      );
    } catch (err) {
      console.error('Failed to reject quotation:', err);
      setError('Failed to reject quotation');
    }
  };

  const getJobTitle = (jobId: string) => {
    return jobs.find(job => job.id === jobId)?.title || 'Unknown Job';
  };

  const filteredQuotations = quotations.filter(quotation => {
    if (selectedTab === "all") return true;
    return quotation.status === selectedTab;
  });

  const sortedQuotations = [...filteredQuotations].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "amount-high":
        return b.amount - a.amount;
      case "amount-low":
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
        <div className="text-sm text-gray-500">
          {quotations.length} total quotations
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "all", label: "All", count: quotations.length },
            { id: "pending", label: "Pending", count: quotations.filter(q => q.status === "pending").length },
            { id: "accepted", label: "Accepted", count: quotations.filter(q => q.status === "accepted").length },
            { id: "rejected", label: "Rejected", count: quotations.filter(q => q.status === "rejected").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-high">Highest Amount</option>
            <option value="amount-low">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Quotations List */}
      {sortedQuotations.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quotations found</h3>
          <p className="text-gray-500">
            {selectedTab === "all" 
              ? "You haven't received any quotations yet."
              : `No ${selectedTab} quotations to display.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedQuotations.map((quotation) => {
            const isExpired = new Date(quotation.validUntil) < new Date();
            
            return (
              <div key={quotation.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getJobTitle(quotation.jobId)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quotation ID: {quotation.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ${quotation.amount}
                    </div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      quotation.status === "accepted" 
                        ? "bg-green-100 text-green-800"
                        : quotation.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : isExpired
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {isExpired && quotation.status === "pending" ? "Expired" : quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700">{quotation.description}</p>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <div>
                    Submitted: {new Date(quotation.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    Valid until: {new Date(quotation.validUntil).toLocaleDateString()}
                  </div>
                </div>

                {quotation.status === "pending" && !isExpired && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleAcceptQuotation(quotation.id)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Accept Quotation
                    </button>
                    <button
                      onClick={() => handleRejectQuotation(quotation.id)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Reject Quotation
                    </button>
                  </div>
                )}

                {quotation.status === "accepted" && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <p className="text-green-800 text-sm">
                      ✓ This quotation has been accepted. The service provider will contact you soon.
                    </p>
                  </div>
                )}

                {quotation.status === "rejected" && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-800 text-sm">
                      ✗ This quotation has been rejected.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
