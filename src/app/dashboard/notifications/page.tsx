"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  FileText, 
  MessageSquare,
  UserCheck,
  AlertTriangle,
  X
} from "lucide-react";

interface Notification {
  id: string;
  type: "quotation" | "job_update" | "payment" | "message" | "assignment" | "completion" | "review";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  actionUrl?: string;
  metadata?: Record<string, string | number>;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "quotation",
    title: "New Quotation Received",
    message: "Alex Johnson sent you a quotation for Kitchen Deep Cleaning - $180",
    timestamp: "2025-09-03T10:30:00Z",
    isRead: false,
    priority: "high",
    actionUrl: "/dashboard/customer/quotations",
    metadata: { providerId: "alex_johnson", amount: 180 }
  },
  {
    id: "2", 
    type: "job_update",
    title: "Job Started",
    message: "Alex Johnson has started working on your Kitchen Deep Cleaning job",
    timestamp: "2025-09-03T09:00:00Z",
    isRead: false,
    priority: "medium",
    actionUrl: "/dashboard/customer/jobs/job-123",
    metadata: { jobId: "job-123", providerId: "alex_johnson" }
  },
  {
    id: "3",
    type: "completion",
    title: "Job Completed",
    message: "Your Kitchen Deep Cleaning job has been marked as completed. Please review.",
    timestamp: "2025-09-03T14:30:00Z",
    isRead: true,
    priority: "high",
    actionUrl: "/dashboard/customer/confirm-completion/job-123",
    metadata: { jobId: "job-123" }
  },
  {
    id: "4",
    type: "payment", 
    title: "Payment Processed",
    message: "Payment of $180 has been processed for Kitchen Deep Cleaning",
    timestamp: "2025-09-02T16:45:00Z",
    isRead: true,
    priority: "medium",
    metadata: { amount: 180, jobId: "job-122" }
  },
  {
    id: "5",
    type: "message",
    title: "New Message",
    message: "Alex Johnson: I'll arrive at 9 AM tomorrow for the cleaning job",
    timestamp: "2025-09-02T18:20:00Z", 
    isRead: true,
    priority: "medium",
    actionUrl: "/dashboard/messages",
    metadata: { fromUser: "alex_johnson" }
  }
];

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "high">("all");

  const getIcon = (type: string) => {
    switch (type) {
      case "quotation":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "job_update":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "payment":
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case "message":
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case "assignment":
        return <UserCheck className="w-5 h-5 text-emerald-600" />;
      case "completion":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "review":
        return <MessageSquare className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50";
      case "low":
        return "border-l-gray-500 bg-gray-50";
      default:
        return "border-l-gray-500 bg-white";
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case "unread":
        return !notif.isRead;
      case "high":
        return notif.priority === "high";
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <Badge className="bg-red-100 text-red-800">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: "all", label: "All", count: notifications.length },
          { key: "unread", label: "Unread", count: unreadCount },
          { key: "high", label: "Priority", count: notifications.filter(n => n.priority === "high").length }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as typeof filter)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-600">
                {filter === "unread" 
                  ? "You're all caught up! No unread notifications."
                  : filter === "high"
                  ? "No high priority notifications at this time."
                  : "You don't have any notifications yet."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`border-l-4 ${getPriorityColor(notification.priority)} ${
                !notification.isRead ? 'ring-2 ring-blue-100' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        {notification.priority === "high" && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      
                      <p className={`text-sm ${
                        !notification.isRead ? 'text-gray-700' : 'text-gray-600'
                      } mb-2`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          {notification.actionUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                markAsRead(notification.id);
                                // In a real app, navigate to actionUrl
                                console.log("Navigate to:", notification.actionUrl);
                              }}
                            >
                              View
                            </Button>
                          )}
                          
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                    className="text-gray-400 hover:text-gray-600 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Actions */}
      {filteredNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2"
                onClick={() => console.log("Navigate to jobs")}
              >
                <Clock className="w-4 h-4" />
                <span>View Active Jobs</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2"
                onClick={() => console.log("Navigate to quotations")}
              >
                <FileText className="w-4 h-4" />
                <span>Check Quotations</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2"
                onClick={() => console.log("Navigate to messages")}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Messages</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
