"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  MessageSquare,
  CheckCircle,
  DollarSign,
  AlertCircle,
  Gift,
  X,
  Check,
  Trash2,
  Settings,
} from "lucide-react";

interface Notification {
  id: string;
  type: "quotation" | "job_update" | "payment" | "system" | "promotion";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "quotation",
    title: "New Quotation Received",
    message:
      "Sarah Johnson sent you a quotation for Kitchen Deep Cleaning - $150",
    timestamp: "2025-08-25T10:30:00Z",
    isRead: false,
    actionUrl: "/dashboard/customer/quotations",
  },
  {
    id: "2",
    type: "job_update",
    title: "Job Status Updated",
    message:
      "Your Plumbing Repair job has been scheduled for August 31st at 10:00 AM",
    timestamp: "2025-08-25T09:15:00Z",
    isRead: false,
    actionUrl: "/dashboard/customer/jobs",
  },
  {
    id: "3",
    type: "payment",
    title: "Payment Confirmed",
    message:
      "Payment of $120 for Garden Maintenance has been successfully processed",
    timestamp: "2025-08-24T16:45:00Z",
    isRead: true,
    actionUrl: "/dashboard/customer/payments",
  },
  {
    id: "4",
    type: "quotation",
    title: "New Quotation Received",
    message:
      "Clean Pro Services sent you a quotation for Kitchen Deep Cleaning - $180",
    timestamp: "2025-08-24T14:20:00Z",
    isRead: true,
    actionUrl: "/dashboard/customer/quotations",
  },
  {
    id: "5",
    type: "job_update",
    title: "Job Completed",
    message:
      "Your Garden Maintenance job has been completed. Please review your experience.",
    timestamp: "2025-08-24T11:30:00Z",
    isRead: true,
    actionUrl: "/dashboard/customer/reviews",
  },
  {
    id: "6",
    type: "promotion",
    title: "Special Offer!",
    message: "Get 20% off your next cleaning service. Limited time offer!",
    timestamp: "2025-08-23T08:00:00Z",
    isRead: false,
    actionUrl: "/dashboard/customer/providers?category=Cleaning",
  },
  {
    id: "7",
    type: "system",
    title: "Account Verification Complete",
    message:
      "Your email address has been successfully verified. Welcome to WorkZone!",
    timestamp: "2025-08-20T12:00:00Z",
    isRead: true,
  },
];

const notificationConfig = {
  quotation: {
    icon: MessageSquare,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  job_update: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  payment: {
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  system: { icon: AlertCircle, color: "text-gray-600", bgColor: "bg-gray-100" },
  promotion: { icon: Gift, color: "text-purple-600", bgColor: "bg-purple-100" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filters = [
    { id: "all", label: "All", count: notifications.length },
    { id: "unread", label: "Unread", count: unreadCount },
    {
      id: "quotation",
      label: "Quotations",
      count: notifications.filter((n) => n.type === "quotation").length,
    },
    {
      id: "job_update",
      label: "Job Updates",
      count: notifications.filter((n) => n.type === "job_update").length,
    },
    {
      id: "payment",
      label: "Payments",
      count: notifications.filter((n) => n.type === "payment").length,
    },
    {
      id: "promotion",
      label: "Promotions",
      count: notifications.filter((n) => n.type === "promotion").length,
    },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "unread") return !notification.isRead;
    return notification.type === selectedFilter;
  });

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAsUnread = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: false }
          : notification
      )
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearAllRead = () => {
    if (
      window.confirm("Are you sure you want to delete all read notifications?")
    ) {
      setNotifications((prev) => prev.filter((n) => !n.isRead));
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const NotificationCard = ({
    notification,
  }: {
    notification: Notification;
  }) => {
    const config = notificationConfig[notification.type];
    const Icon = config.icon;

    return (
      <Card
        className={`hover:shadow-md transition-shadow ${
          !notification.isRead ? "ring-2 ring-blue-200 bg-blue-50/30" : ""
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <div className={`flex-shrink-0 p-2 rounded-full ${config.bgColor}`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
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
                  {!notification.isRead && (
                    <Badge className="bg-blue-600 text-white text-xs px-2 py-1">
                      New
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                </div>
              </div>

              <p
                className={`text-sm ${
                  !notification.isRead ? "text-gray-800" : "text-gray-600"
                }`}
              >
                {notification.message}
              </p>

              <div className="flex items-center justify-between mt-3">
                <div className="flex space-x-2">
                  {notification.actionUrl && (
                    <Button size="sm" variant="outline" className="text-xs">
                      View Details
                    </Button>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  {!notification.isRead ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs p-1 h-auto"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsUnread(notification.id)}
                      className="text-xs p-1 h-auto text-gray-400"
                    >
                      <Bell className="w-3 h-3" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                    className="text-xs p-1 h-auto text-red-400 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              You have {unreadCount} unread notification
              {unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" onClick={clearAllRead}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Read
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
                className={
                  selectedFilter === filter.id
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : ""
                }
              >
                {filter.label}
                {filter.count > 0 && (
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      selectedFilter === filter.id
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {filter.count}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedFilter === "unread"
                  ? "No unread notifications"
                  : "No notifications"}
              </h3>
              <p className="text-gray-600">
                {selectedFilter === "unread"
                  ? "You're all caught up! No new notifications to read."
                  : "We'll notify you when there's something important to share."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
