"use client";

import { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Quotation {
  id: string;
  jobTitle: string;
  customerName: string;
  jobDate: string;
  quotedPrice: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  sentDate: string;
  notes: string;
  customerMessage?: string;
  responseDate?: string;
}

const mockQuotations: Quotation[] = [
  {
    id: "1",
    jobTitle: "Electrical Installation",
    customerName: "Mike Johnson",
    jobDate: "2025-08-26",
    quotedPrice: "$350",
    status: "pending",
    sentDate: "2025-08-25",
    notes:
      "Complete electrical setup for new office space including outlets and lighting fixtures. Materials included in price.",
  },
  {
    id: "2",
    jobTitle: "Plumbing Repair",
    customerName: "Sarah Davis",
    jobDate: "2025-08-27",
    quotedPrice: "$200",
    status: "accepted",
    sentDate: "2025-08-24",
    notes: "Kitchen sink leak repair and bathroom faucet replacement.",
    customerMessage: "Great! Can we schedule for 10 AM?",
    responseDate: "2025-08-24",
  },
  {
    id: "3",
    jobTitle: "Garden Maintenance",
    customerName: "John Smith",
    jobDate: "2025-08-28",
    quotedPrice: "$120",
    status: "rejected",
    sentDate: "2025-08-23",
    notes: "Lawn mowing and hedge trimming for medium-sized property.",
    customerMessage:
      "Thank you for the quote, but we found someone closer to our budget.",
    responseDate: "2025-08-24",
  },
  {
    id: "4",
    jobTitle: "Kitchen Deep Cleaning",
    customerName: "Emma Wilson",
    jobDate: "2025-08-25",
    quotedPrice: "$150",
    status: "accepted",
    sentDate: "2025-08-23",
    notes: "Deep cleaning service including all appliances and surfaces.",
    customerMessage: "Perfect! Looking forward to working with you.",
    responseDate: "2025-08-23",
  },
];

export default function QuotationsPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "accepted" | "rejected"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "withdrawn":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "withdrawn":
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredQuotations = mockQuotations.filter((quote) => {
    const matchesTab = activeTab === "all" || quote.status === activeTab;
    const matchesSearch =
      quote.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabCounts = {
    all: mockQuotations.length,
    pending: mockQuotations.filter((q) => q.status === "pending").length,
    accepted: mockQuotations.filter((q) => q.status === "accepted").length,
    rejected: mockQuotations.filter((q) => q.status === "rejected").length,
  };

  const handleWithdrawQuote = (quoteId: string) => {
    if (window.confirm("Are you sure you want to withdraw this quotation?")) {
      console.log("Withdrawing quote:", quoteId);
      // Update quote status to withdrawn
    }
  };

  const handleMessageCustomer = (customerName: string) => {
    console.log("Messaging customer:", customerName);
    // Open messaging interface
  };

  const tabs = [
    { key: "all" as const, label: "All", count: tabCounts.all },
    { key: "pending" as const, label: "Pending", count: tabCounts.pending },
    { key: "accepted" as const, label: "Accepted", count: tabCounts.accepted },
    { key: "rejected" as const, label: "Rejected", count: tabCounts.rejected },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Quotations</h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search quotations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tabCounts.all}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tabCounts.pending}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tabCounts.accepted}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Success Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((tabCounts.accepted / tabCounts.all) * 100)}%
                </p>
              </div>
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-emerald-600 font-bold">%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-1 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? "bg-emerald-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quotations List */}
      <div className="space-y-4">
        {filteredQuotations.map((quote) => (
          <Card key={quote.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{quote.jobTitle}</h3>
                    <Badge className={getStatusColor(quote.status)}>
                      {getStatusIcon(quote.status)}
                      <span className="ml-1 capitalize">{quote.status}</span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      {quote.customerName}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(quote.jobDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {quote.quotedPrice}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      Sent {new Date(quote.sentDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-900 mb-1">
                      Quote Details:
                    </h4>
                    <p className="text-sm text-gray-700">{quote.notes}</p>
                  </div>

                  {quote.customerMessage && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Customer Response:
                          </p>
                          <p className="text-sm text-blue-800">
                            {quote.customerMessage}
                          </p>
                          {quote.responseDate && (
                            <p className="text-xs text-blue-600 mt-1">
                              {new Date(
                                quote.responseDate
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMessageCustomer(quote.customerName)}
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Message Customer
                </Button>

                {quote.status === "pending" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => handleWithdrawQuote(quote.id)}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Withdraw Quote
                  </Button>
                )}

                {quote.status === "accepted" && (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    View Job Details
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuotations.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No quotations found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search criteria."
                : activeTab === "all"
                ? "You haven't sent any quotations yet."
                : `No ${activeTab} quotations found.`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
