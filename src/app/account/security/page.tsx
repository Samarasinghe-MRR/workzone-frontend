import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Smartphone, Globe, Check, AlertTriangle } from "lucide-react";

export default function SecurityPage() {
  const securitySettings = [
    {
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      status: "enabled",
      icon: Smartphone,
    },
    {
      title: "Login Notifications",
      description: "Get notified when someone logs into your account",
      status: "enabled",
      icon: Globe,
    },
    {
      title: "Account Recovery",
      description: "Set up account recovery options",
      status: "pending",
      icon: Shield,
    },
  ];

  const recentActivity = [
    {
      action: "Login from Chrome on Windows",
      location: "New York, NY",
      time: "2 hours ago",
      status: "success",
    },
    {
      action: "Password changed",
      location: "New York, NY",
      time: "3 days ago",
      status: "success",
    },
    {
      action: "Failed login attempt",
      location: "Unknown location",
      time: "1 week ago",
      status: "warning",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Security Settings */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-2xl font-bold">
              Account Security
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            {securitySettings.map((setting, index) => {
              const IconComponent = setting.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{setting.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        setting.status === "enabled" ? "default" : "secondary"
                      }
                      className={
                        setting.status === "enabled"
                          ? "bg-emerald-100 text-emerald-700"
                          : ""
                      }
                    >
                      {setting.status === "enabled" ? "Enabled" : "Pending"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      {setting.status === "enabled" ? "Manage" : "Setup"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Security Checkup
            </Button>
            <Button variant="outline">Download Security Report</Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold">
            Recent Security Activity
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 border rounded-lg"
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {activity.status === "success" ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">{activity.action}</h4>
                    <p className="text-xs text-muted-foreground">
                      {activity.location} • {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full">
            View All Activity
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
