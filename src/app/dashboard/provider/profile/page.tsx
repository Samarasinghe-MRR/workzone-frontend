"use client";

import { useState, useEffect } from "react";
import {
  Camera,
  MapPin,
  Star,
  Award,
  Clock,
  DollarSign,
  Loader2,
  X,
  Plus,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useProviderProfile } from "@/features/provider/hooks/useProviderProfile";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
}

interface Service {
  id: string;
  category: string;
  subcategory: string;
  hourlyRate: string;
}

export default function ProfilePage() {
  const { profile, loading, error, updateProfile } = useProviderProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessAddress: "",
    bio: "",
    yearsOfExperience: 0,
    serviceRadius: 0,
    hourlyRate: 0,
    responseTimeHours: 0,
    isAvailable: true,
  });

  const [alertState, setAlertState] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  // Mock data for services and certifications (these would come from backend in full implementation)
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      category: "Electrical",
      subcategory: "Installation",
      hourlyRate: "$85",
    },
    {
      id: "2",
      category: "Electrical",
      subcategory: "Repair",
      hourlyRate: "$75",
    },
  ]);

  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: "1",
      name: "Licensed Electrician",
      issuer: "State Board",
      date: "2015-03-15",
      expiryDate: "2026-03-15",
    },
  ]);

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        businessName: profile.businessName || profile.category || "",
        businessAddress: profile.businessAddress || profile.location || "",
        bio: profile.bio || "",
        yearsOfExperience:
          profile.yearsOfExperience || profile.experienceYears || 0,
        serviceRadius: profile.serviceRadius || 0,
        hourlyRate: profile.hourlyRate || 0,
        responseTimeHours:
          profile.responseTimeHours || profile.averageResponseTime || 0,
        isAvailable: profile.isAvailable,
      });
    }
  }, [profile]);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlertState({ show: true, type, message });
    setTimeout(
      () => setAlertState({ show: false, type: "success", message: "" }),
      5000
    );
  };

  const handleSaveProfile = async () => {
    try {
      // Only send fields that exist in the Prisma schema
      const updateData = {
        category: formData.businessName, // Map businessName to category
        location: formData.businessAddress, // Map businessAddress to location
        experienceYears: formData.yearsOfExperience,
        serviceRadius: formData.serviceRadius,
        averageResponseTime: formData.responseTimeHours,
        isAvailable: formData.isAvailable,
        availability: formData.isAvailable, // Both fields for compatibility
      };

      console.log("Sending update data:", updateData);

      const result = await updateProfile(updateData);
      if (result.success) {
        setIsEditing(false);
        showAlert("success", result.message || "Profile updated successfully");
      } else {
        showAlert("error", result.message || "Failed to update profile");
      }
    } catch (error) {
      showAlert(
        "error",
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  };

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      category: "",
      subcategory: "",
      hourlyRate: "",
    };
    setServices([...services, newService]);
  };

  const removeService = (id: string) => {
    setServices(services.filter((service) => service.id !== id));
  };

  const updateService = (id: string, field: keyof Service, value: string) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      date: "",
    };
    setCertifications([...certifications, newCert]);
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter((cert) => cert.id !== id));
  };

  const updateCertification = (
    id: string,
    field: keyof Certification,
    value: string
  ) => {
    setCertifications(
      certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            <strong>Error loading profile:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alertState.show && (
        <div
          className={`p-4 rounded-md ${
            alertState.type === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div
            className={
              alertState.type === "success" ? "text-green-800" : "text-red-800"
            }
          >
            {alertState.message}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-emerald-600 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                    {profile?.businessName || profile?.category
                      ? (profile.businessName || profile.category)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                      : "SP"}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-white border-2 border-gray-300 rounded-full p-2 hover:bg-gray-50">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          value={formData.businessName}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              businessName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="businessAddress">
                          Business Address
                        </Label>
                        <Input
                          id="businessAddress"
                          value={formData.businessAddress}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              businessAddress: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-2xl font-bold">
                        {profile?.businessName ||
                          profile?.category ||
                          "Business Name"}
                      </h3>
                      <p className="text-gray-600">
                        {profile?.businessAddress ||
                          profile?.location ||
                          "Business Address"}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium">
                            {profile?.rating || 4.8}
                          </span>
                          <span className="ml-1 text-sm text-gray-500">
                            ({profile?.completedJobs || 127} reviews)
                          </span>
                        </div>
                        <Badge variant="outline">
                          {profile?.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <textarea
                    id="bio"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bio: e.target.value }))
                    }
                  />
                ) : (
                  <p className="text-gray-700 mt-1">
                    {profile?.bio || "No bio available"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  {isEditing ? (
                    <Input
                      id="experience"
                      type="number"
                      value={formData.yearsOfExperience}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          yearsOfExperience: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center mt-1">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        {profile?.yearsOfExperience ||
                          profile?.experienceYears ||
                          0}{" "}
                        years
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="radius">Service Radius (miles)</Label>
                  {isEditing ? (
                    <Input
                      id="radius"
                      type="number"
                      value={formData.serviceRadius}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          serviceRadius: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{profile?.serviceRadius || 0} miles</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  {isEditing ? (
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hourlyRate: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center mt-1">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <span>${profile?.hourlyRate || 0}/hr</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="responseTime">Response Time (hours)</Label>
                  {isEditing ? (
                    <Input
                      id="responseTime"
                      type="number"
                      value={formData.responseTimeHours}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          responseTimeHours: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center mt-1">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        {profile?.responseTimeHours ||
                          profile?.averageResponseTime ||
                          0}{" "}
                        hours
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isAvailable: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <Label htmlFor="isAvailable">
                    Currently Available for New Projects
                  </Label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services Offered */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Services Offered</CardTitle>
                {isEditing && (
                  <Button onClick={addService} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Service
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center space-x-4 p-3 border rounded-lg"
                  >
                    {isEditing ? (
                      <>
                        <Input
                          placeholder="Category"
                          value={service.category}
                          onChange={(e) =>
                            updateService(
                              service.id,
                              "category",
                              e.target.value
                            )
                          }
                          className="flex-1"
                        />
                        <Input
                          placeholder="Subcategory"
                          value={service.subcategory}
                          onChange={(e) =>
                            updateService(
                              service.id,
                              "subcategory",
                              e.target.value
                            )
                          }
                          className="flex-1"
                        />
                        <Input
                          placeholder="Rate"
                          value={service.hourlyRate}
                          onChange={(e) =>
                            updateService(
                              service.id,
                              "hourlyRate",
                              e.target.value
                            )
                          }
                          className="w-24"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeService(service.id)}
                          className="text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1">
                          <span className="font-medium">
                            {service.category}
                          </span>
                          <span className="text-gray-500">
                            {" "}
                            • {service.subcategory}
                          </span>
                        </div>
                        <Badge variant="outline">{service.hourlyRate}/hr</Badge>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Certifications & Licenses</CardTitle>
                {isEditing && (
                  <Button
                    onClick={addCertification}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Certification
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    {isEditing ? (
                      <>
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Certification Name"
                            value={cert.name}
                            onChange={(e) =>
                              updateCertification(
                                cert.id,
                                "name",
                                e.target.value
                              )
                            }
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <Input
                              placeholder="Issuer"
                              value={cert.issuer}
                              onChange={(e) =>
                                updateCertification(
                                  cert.id,
                                  "issuer",
                                  e.target.value
                                )
                              }
                            />
                            <Input
                              type="date"
                              placeholder="Issue Date"
                              value={cert.date}
                              onChange={(e) =>
                                updateCertification(
                                  cert.id,
                                  "date",
                                  e.target.value
                                )
                              }
                            />
                            <Input
                              type="date"
                              placeholder="Expiry Date"
                              value={cert.expiryDate || ""}
                              onChange={(e) =>
                                updateCertification(
                                  cert.id,
                                  "expiryDate",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCertification(cert.id)}
                          className="text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Award className="w-8 h-8 text-emerald-600" />
                        <div className="flex-1">
                          <h4 className="font-medium">{cert.name}</h4>
                          <p className="text-sm text-gray-600">
                            Issued by {cert.issuer}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(cert.date).toLocaleDateString()}
                            {cert.expiryDate &&
                              ` - Expires ${new Date(
                                cert.expiryDate
                              ).toLocaleDateString()}`}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">4.8</div>
                <div className="flex justify-center my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">Based on 127 reviews</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Jobs Completed</span>
                  <span className="font-medium">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="font-medium">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">On-time Rate</span>
                  <span className="font-medium">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Repeat Customers
                  </span>
                  <span className="font-medium">23</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Upload Portfolio Photos
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Award className="w-4 h-4 mr-2" />
                Verify Certifications
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Star className="w-4 h-4 mr-2" />
                View All Reviews
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
