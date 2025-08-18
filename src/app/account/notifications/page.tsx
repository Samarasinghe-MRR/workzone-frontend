import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, Check, X } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "Task Completed",
      message: "Your furniture assembly task has been completed successfully.",
      time: "2 hours ago",
      unread: true,
      type: "success",
    },
    {
      id: 2,
      title: "Payment Processed",
      message: "Payment of $125.00 has been processed for your recent task.",
      time: "1 day ago",
      unread: true,
      type: "info",
    },
    {
      id: 3,
      title: "New Task Request",
      message: "You have a new task request for home cleaning.",
      time: "3 days ago",
      unread: false,
      type: "default",
    },
  ];

  const notificationSettings = [
    { label: "Email notifications", enabled: true },
    { label: "SMS notifications", enabled: false },
    { label: "Push notifications", enabled: true },
    { label: "Task reminders", enabled: true },
    { label: "Payment updates", enabled: true },
    { label: "Marketing emails", enabled: false },
  ];

  return (
    <div className="space-y-6">
      {/* Recent Notifications */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-2xl font-bold">
                Recent Notifications
              </CardTitle>
            </div>
            <Button variant="outline" size="sm">
              Mark All as Read
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start justify-between p-4 border rounded-lg ${
                notification.unread ? "bg-muted/30" : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  {notification.unread && (
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{notification.title}</h4>
                    {notification.unread && (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </div>
              </div>

              <div className="flex gap-1">
                <Button variant="ghost" size="sm">
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold">
            Notification Preferences
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-4">
            {notificationSettings.map((setting, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="font-medium">{setting.label}</span>
                <Button
                  variant={setting.enabled ? "default" : "outline"}
                  size="sm"
                  className={
                    setting.enabled ? "bg-emerald-600 hover:bg-emerald-700" : ""
                  }
                >
                  {setting.enabled ? "Enabled" : "Disabled"}
                </Button>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Save Preferences
            </Button>
            <Button variant="outline">Reset to Default</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
