"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  Download,
  Filter,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface EarningRecord {
  id: string;
  jobTitle: string;
  customerName: string;
  completedDate: string;
  amount: number;
  paymentStatus: "paid" | "pending" | "processing";
  paymentMethod: string;
  transactionId?: string;
}

const mockEarnings: EarningRecord[] = [
  {
    id: "1",
    jobTitle: "Kitchen Deep Cleaning",
    customerName: "Emma Wilson",
    completedDate: "2025-08-25",
    amount: 150,
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    transactionId: "TXN123456",
  },
  {
    id: "2",
    jobTitle: "Garden Maintenance",
    customerName: "John Smith",
    completedDate: "2025-08-24",
    amount: 120,
    paymentStatus: "paid",
    paymentMethod: "Bank Transfer",
    transactionId: "TXN123455",
  },
  {
    id: "3",
    jobTitle: "Electrical Installation",
    customerName: "Mike Johnson",
    completedDate: "2025-08-23",
    amount: 350,
    paymentStatus: "processing",
    paymentMethod: "Credit Card",
  },
  {
    id: "4",
    jobTitle: "Plumbing Repair",
    customerName: "Sarah Davis",
    completedDate: "2025-08-22",
    amount: 200,
    paymentStatus: "pending",
    paymentMethod: "Cash",
  },
  {
    id: "5",
    jobTitle: "Office Cleaning",
    customerName: "Tech Corp",
    completedDate: "2025-08-21",
    amount: 180,
    paymentStatus: "paid",
    paymentMethod: "Business Account",
    transactionId: "TXN123453",
  },
];

export default function EarningsPage() {
  const [dateRange, setDateRange] = useState({
    start: "2025-08-01",
    end: "2025-08-31",
  });
  const [filterStatus, setFilterStatus] = useState<
    "all" | "paid" | "pending" | "processing"
  >("all");

  const filteredEarnings = mockEarnings.filter((earning) => {
    const matchesStatus =
      filterStatus === "all" || earning.paymentStatus === filterStatus;
    const earningDate = new Date(earning.completedDate);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const matchesDate = earningDate >= startDate && earningDate <= endDate;
    return matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Calculate summary stats
  const totalEarnings = filteredEarnings.reduce(
    (sum, earning) => sum + earning.amount,
    0
  );
  const paidEarnings = filteredEarnings
    .filter((e) => e.paymentStatus === "paid")
    .reduce((sum, earning) => sum + earning.amount, 0);
  const pendingEarnings = filteredEarnings
    .filter(
      (e) => e.paymentStatus === "pending" || e.paymentStatus === "processing"
    )
    .reduce((sum, earning) => sum + earning.amount, 0);

  const completedJobs = filteredEarnings.length;
  const averageJobValue = completedJobs > 0 ? totalEarnings / completedJobs : 0;

  const handleExportData = () => {
    console.log("Exporting earnings data...");
    // Generate CSV or PDF export
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalEarnings}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +12% from last month
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Out</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${paidEarnings}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Available in account
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${pendingEarnings}
                </p>
                <p className="text-xs text-gray-500 mt-1">Processing payment</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Job Value
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${Math.round(averageJobValue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {completedJobs} jobs completed
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Date Range */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">From:</label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="w-40"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">To:</label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="w-40"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as "all" | "paid" | "pending" | "processing"
                  )
                }
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Job
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Payment
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEarnings.map((earning) => (
                  <tr key={earning.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {earning.jobTitle}
                        </p>
                        {earning.transactionId && (
                          <p className="text-xs text-gray-500">
                            ID: {earning.transactionId}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {earning.customerName}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {new Date(earning.completedDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">
                        ${earning.amount}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          earning.paymentStatus
                        )}`}
                      >
                        {earning.paymentStatus.charAt(0).toUpperCase() +
                          earning.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {earning.paymentMethod}
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEarnings.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No earnings found
              </h3>
              <p className="text-gray-600">
                {filterStatus === "all"
                  ? "No earnings recorded for the selected date range."
                  : `No ${filterStatus} earnings found for the selected period.`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium">Bank Account</p>
                  <p className="text-sm text-gray-600">**** **** **** 1234</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600">
                  Remove
                </Button>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <CreditCard className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Earnings chart will be displayed here
              </p>
              <p className="text-sm text-gray-500">
                Install a charting library for detailed analytics
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
