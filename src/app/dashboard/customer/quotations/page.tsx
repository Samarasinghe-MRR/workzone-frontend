"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MessageCircle,
  DollarSign,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";

interface Quotation {
  id: string;
  jobId: string;
  jobTitle: string;
  provider: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    completedJobs: number;
  };
  price: number;
  estimatedDuration: string;
  description: string;
  submittedAt: string;
  status: "pending" | "accepted" | "rejected";
  validUntil: string;
}

const mockQuotations: Quotation[] = [
  {
    id: "1",
    jobId: "job-1",
    jobTitle: "Kitchen Deep Cleaning",
    provider: {
      id: "provider-1",
      name: "Sarah Johnson",
      avatar: "SJ",
      rating: 4.9,
      reviewCount: 127,
      completedJobs: 156,
    },
    price: 150,
    estimatedDuration: "3-4 hours",
    description:
      "I'll provide a comprehensive deep cleaning of your kitchen including all appliances, countertops, cabinets, and floors. I use eco-friendly products and bring all necessary equipment.",
    submittedAt: "2025-08-25T10:30:00Z",
    status: "pending",
    validUntil: "2025-08-30T23:59:59Z",
  },
  {
    id: "2",
    jobId: "job-1",
    jobTitle: "Kitchen Deep Cleaning",
    provider: {
      id: "provider-2",
      name: "Clean Pro Services",
      avatar: "CP",
      rating: 4.7,
      reviewCount: 89,
      completedJobs: 234,
    },
    price: 180,
    estimatedDuration: "4-5 hours",
    description:
      "Professional kitchen deep cleaning service. We'll clean all surfaces, appliances inside and out, degrease everything, and sanitize all areas. Satisfaction guaranteed.",
    submittedAt: "2025-08-25T14:15:00Z",
    status: "pending",
    validUntil: "2025-08-31T23:59:59Z",
  },
  {
    id: "3",
    jobId: "job-2",
    jobTitle: "Plumbing Repair",
    provider: {
      id: "provider-3",
      name: "Mike Wilson",
      avatar: "MW",
      rating: 4.8,
      reviewCount: 156,
      completedJobs: 289,
    },
    price: 200,
    estimatedDuration: "2-3 hours",
    description:
      "I'll fix the leaking faucet and check all plumbing connections in the bathroom. Price includes parts and labor. Licensed and insured.",
    submittedAt: "2025-08-24T16:45:00Z",
    status: "accepted",
    validUntil: "2025-08-29T23:59:59Z",
  },
  {
    id: "4",
    jobId: "job-3",
    jobTitle: "Electrical Installation",
    provider: {
      id: "provider-4",
      name: "Alex Rodriguez",
      avatar: "AR",
      rating: 4.9,
      reviewCount: 203,
      completedJobs: 189,
    },
    price: 320,
    estimatedDuration: "3-4 hours",
    description:
      "Professional ceiling fan installation with proper wiring and safety compliance. Includes fan mounting, electrical connections, and testing.",
    submittedAt: "2025-08-25T09:20:00Z",
    status: "rejected",
    validUntil: "2025-08-30T23:59:59Z",
  },
];

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotations);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [sortBy, setSortBy] = useState("newest");

  const tabs = [
    { id: "all", label: "All Quotations", count: quotations.length },
    {
      id: "pending",
      label: "Pending",
      count: quotations.filter((q) => q.status === "pending").length,
    },
    {
      id: "accepted",
      label: "Accepted",
      count: quotations.filter((q) => q.status === "accepted").length,
    },
    {
      id: "rejected",
      label: "Rejected",
      count: quotations.filter((q) => q.status === "rejected").length,
    },
  ];

  const filteredQuotations = quotations.filter((quotation) => {
    return selectedTab === "all" || quotation.status === selectedTab;
  });

  const sortedQuotations = [...filteredQuotations].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
        );
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.provider.rating - a.provider.rating;
      default:
        return 0;
    }
  });

  const handleAcceptQuotation = (quotationId: string) => {
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === quotationId ? { ...q, status: "accepted" as const } : q
      )
    );
  };

  const handleRejectQuotation = (quotationId: string) => {
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === quotationId ? { ...q, status: "rejected" as const } : q
      )
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          color: "bg-yellow-100 text-yellow-800",
          label: "Pending",
        };
      case "accepted":
        return {
          icon: CheckCircle,
          color: "bg-green-100 text-green-800",
          label: "Accepted",
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "bg-red-100 text-red-800",
          label: "Rejected",
        };
      default:
        return {
          icon: AlertCircle,
          color: "bg-gray-100 text-gray-800",
          label: "Unknown",
        };
    }
  };

  const QuotationCard = ({ quotation }: { quotation: Quotation }) => {
    const statusConfig = getStatusConfig(quotation.status);
    const StatusIcon = statusConfig.icon;
    const isExpired = new Date(quotation.validUntil) < new Date();

    return (
      <Card
        className={`hover:shadow-md transition-shadow ${
          quotation.status === "accepted"
            ? "ring-2 ring-green-200"
            : quotation.status === "rejected"
            ? "ring-2 ring-red-200"
            : ""
        }`}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {quotation.jobTitle}
                </h3>
                <Badge className={statusConfig.color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig.label}
                </Badge>
                {isExpired && quotation.status === "pending" && (
                  <Badge
                    variant="outline"
                    className="text-red-600 border-red-300"
                  >
                    Expired
                  </Badge>
                )}
              </div>

              <div className="flex items-center text-lg font-bold text-emerald-600 mb-2">
                <DollarSign className="w-5 h-5 mr-1" />
                {quotation.price}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-medium mr-3">
                {quotation.provider.avatar}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {quotation.provider.name}
                </p>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm text-gray-600">
                    {quotation.provider.rating} (
                    {quotation.provider.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>{quotation.provider.completedJobs} jobs completed</p>
              <p className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {quotation.estimatedDuration}
              </p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{quotation.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Submitted: {formatDate(quotation.submittedAt)}
            </div>
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Valid until: {new Date(quotation.validUntil).toLocaleDateString()}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1">
              <User className="w-4 h-4 mr-2" />
              View Provider
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>

            {quotation.status === "pending" && !isExpired && (
              <>
                <Button
                  onClick={() => handleRejectQuotation(quotation.id)}
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleAcceptQuotation(quotation.id)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Quotations</h1>
        <div className="text-sm text-gray-600">
          {sortedQuotations.length} quotation
          {sortedQuotations.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.id
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    selectedTab === tab.id
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Quotations List */}
      <div className="space-y-4">
        {sortedQuotations.length > 0 ? (
          sortedQuotations.map((quotation) => (
            <QuotationCard key={quotation.id} quotation={quotation} />
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No quotations found
              </h3>
              <p className="text-gray-600 mb-4">
                You haven&apos;t received any quotations yet. Post a job to
                start receiving quotes from providers.
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Post a Job
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
