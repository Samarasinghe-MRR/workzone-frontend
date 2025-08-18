"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Edit3, LogOut } from "lucide-react";

// This would typically come from your auth context or API
const mockUserData = {
  name: "RAJINIE SAMARASINGHE",
  email: "s.rajinie21@gmail.com",
  phone: "+1 8143519165",
  location: "31905",
  avatar: null, // You can add a default avatar path here
  status: "Active",
  memberSince: "2024",
};

export default function AccountProfile() {
  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
  };

  const handleEdit = () => {
    // Implement edit logic here
    console.log("Edit profile...");
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold">Account</CardTitle>
          <Button
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0 space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={mockUserData.avatar || ""} alt="Profile" />
              <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700">
                {mockUserData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Badge variant="secondary" className="w-fit">
              {mockUserData.status}
            </Badge>
          </div>

          {/* Profile Information */}
          <div className="flex-grow space-y-4">
            {/* Name */}
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-semibold">{mockUserData.name}</span>
            </div>

            <Separator />

            {/* Email */}
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-base text-muted-foreground">
                {mockUserData.email}
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span className="text-base text-muted-foreground">
                {mockUserData.phone}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="text-base text-muted-foreground">
                {mockUserData.location}
              </span>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleEdit}
                variant="default"
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
