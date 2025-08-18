import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Lock } from "lucide-react";

export default function PasswordPage() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-emerald-600" />
          <CardTitle className="text-2xl font-bold">Password</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter your current password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter your new password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your new password"
            />
          </div>
        </div>

        <Separator />

        <div className="flex gap-3">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Update Password
          </Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}
