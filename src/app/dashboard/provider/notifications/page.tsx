"use client";

import { useState } from "react";
import {
  Bell,
  MapPin,
  DollarSign,
  Star,
  CheckCircle,
  Trash2,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  type:
    | "new_job"
    | "quotation_response"
    | "job_reminder"
    | "payment"
    | "review"
    | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "new_job",
    title: "New Job Posted Nearby",
    message:
      "A new electrical installation job has been posted 2.3 miles away. Budget: $300-400",
    timestamp: "2025-08-25T10:30:00Z",
    isRead: false,
    priority: "high",
    actionUrl: "/dashboard/provider/available-jobs/1",
    metadata: { jobId: "1", distance: "2.3 miles" },
  },
  {
    id: "2",
    type: "quotation_response",
    title: "Quotation Accepted",
    message:
      "Sarah Davis accepted your quotation for plumbing repair ($200). Job scheduled for Aug 27.",
    timestamp: "2025-08-25T09:15:00Z",
    isRead: false,
    priority: "high",
    actionUrl: "/dashboard/provider/schedule",
    metadata: { customerId: "sarah_davis", amount: 200 },
  },
  {
    id: "3",
    type: "job_reminder",
    title: "Job Starting Soon",
    message:
      "Kitchen deep cleaning with Emma Wilson starts in 30 minutes at Downtown Apartment.",
    timestamp: "2025-08-25T08:30:00Z",
    isRead: true,
    priority: "high",
    actionUrl: "/dashboard/provider/schedule",
    metadata: { jobId: "3", customerId: "emma_wilson" },
  },
  {
    id: "4",
    type: "payment",
    title: "Payment Processed",
    message:
      "Payment of $150 for kitchen cleaning has been processed and added to your account.",
    timestamp: "2025-08-24T16:45:00Z",
    isRead: true,
    priority: "medium",
    actionUrl: "/dashboard/provider/earnings",
    metadata: { amount: 150, transactionId: "TXN123456" },
  },
  {
    id: "5",
    type: "review",
    title: "New Review Received",
    message:
      "Emma Wilson left you a 5-star review for kitchen deep cleaning service.",
    timestamp: "2025-08-24T15:20:00Z",
    isRead: false,
    priority: "medium",
    actionUrl: "/dashboard/provider/reviews",
    metadata: { rating: 5, customerId: "emma_wilson" },
  },
  {
    id: "6",
    type: "system",
    title: "Profile Verification Complete",
    message:
      "Your electrician license has been verified. You can now receive electrical job requests.",
    timestamp: "2025-08-23T12:00:00Z",
    isRead: true,
    priority: "low",
    metadata: { verificationType: "license" },
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<
    "all" | "unread" | "job_related" | "payments"
  >("all");

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_job":
        return <MapPin className="w-5 h-5 text-blue-600" />;
      case "quotation_response":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "job_reminder":
        return <Bell className="w-5 h-5 text-yellow-600" />;
      case "payment":
        return <DollarSign className="w-5 h-5 text-emerald-600" />;
      case "review":
        return <Star className="w-5 h-5 text-purple-600" />;
      case "system":
        return <Settings className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.isRead;
      case "job_related":
        return ["new_job", "quotation_response", "job_reminder"].includes(
          notification.type
        );
      case "payments":
        return notification.type === "payment";
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      // Navigate to the action URL
      console.log("Navigating to:", notification.actionUrl);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-gray-600 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-1">
            {[
              { key: "all", label: "All", count: notifications.length },
              { key: "unread", label: "Unread", count: unreadCount },
              {
                key: "job_related",
                label: "Job Related",
                count: notifications.filter((n) =>
                  ["new_job", "quotation_response", "job_reminder"].includes(
                    n.type
                  )
                ).length,
              },
              {
                key: "payments",
                label: "Payments",
                count: notifications.filter((n) => n.type === "payment").length,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setFilter(
                    tab.key as "all" | "unread" | "job_related" | "payments"
                  )
                }
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === tab.key
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

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              !notification.isRead
                ? "border-l-4 border-l-emerald-600 bg-emerald-50"
                : "hover:bg-gray-50"
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <CardContent className="pt-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`text-sm font-medium ${
                        !notification.isRead ? "text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={getPriorityColor(notification.priority)}
                        variant="outline"
                      >
                        {notification.priority}
                      </Badge>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <p
                    className={`text-sm ${
                      !notification.isRead ? "text-gray-700" : "text-gray-600"
                    } mb-2`}
                  >
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(notification.timestamp)}
                    </span>

                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="text-xs"
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications
            </h3>
            <p className="text-gray-600">
              {filter === "all"
                ? "You're all caught up! No new notifications."
                : `No ${filter.replace("_", " ")} notifications found.`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">New Jobs Nearby</h4>
                <p className="text-sm text-gray-600">
                  Get notified when new jobs are posted in your area
                </p>
              </div>
              <div className="w-11 h-6 bg-emerald-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Quotation Responses</h4>
                <p className="text-sm text-gray-600">
                  Get notified when customers respond to your quotes
                </p>
              </div>
              <div className="w-11 h-6 bg-emerald-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Payment Updates</h4>
                <p className="text-sm text-gray-600">
                  Get notified about payment processing and deposits
                </p>
              </div>
              <div className="w-11 h-6 bg-emerald-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-600">
                  Receive important updates via email
                </p>
              </div>
              <div className="w-11 h-6 bg-gray-200 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
