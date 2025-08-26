"use client";

import { useState, useEffect } from "react";
import {
  Camera,
  MapPin,
  Star,
  Award,
  Clock,
  DollarSign,
  Upload,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useProviderProfile } from "@/features/provider/hooks/useProviderProfile";
import type {
  Service,
  Certification,
} from "@/features/provider/hooks/useProviderProfile";

export default function ProfilePage() {
  const {
    profileData,
    loading,
    error,
    updateBasicProfile,
    addService,
    updateService,
    removeService,
    addCertification,
    updateCertification,
    removeCertification,
  } = useProviderProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Form state for basic profile
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    yearsExperience: 0,
    serviceRadius: 0,
    pricingModel: "hourly",
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profileData) {
      setProfileForm({
        name: profileData.user.name || "",
        email: profileData.user.email || "",
        phone: profileData.user.phone || "",
        bio: profileData.bio || "",
        yearsExperience: profileData.yearsExperience || 0,
        serviceRadius: profileData.serviceRadius || 0,
        pricingModel: profileData.pricingModel || "hourly",
      });
    }
  }, [profileData]);
  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      const success = await updateBasicProfile(profileForm);
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddService = () => {
    const newService: Omit<Service, "id"> = {
      category: "",
      subcategory: "",
      hourlyRate: "",
    };
    addService(newService);
  };

  const handleRemoveService = (id: string) => {
    removeService(id);
  };

  const handleUpdateService = (
    id: string,
    field: keyof Service,
    value: string
  ) => {
    updateService(id, { [field]: value });
  };

  const handleAddCertification = () => {
    const newCert: Omit<Certification, "id"> = {
      name: "",
      issuer: "",
      date: "",
    };
    addCertification(newCert);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRemoveCertification = (id: string) => {
    removeCertification(id);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdateCertification = (
    id: string,
    field: keyof Certification,
    value: string
  ) => {
    updateCertification(id, field, value, { [field]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">No profile data found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={saveLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={saveLoading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {saveLoading ? "Saving..." : "Save Changes"}
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
                    {profileData.user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
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
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-2xl font-bold">
                        {profileData.user.name}
                      </h3>
                      <p className="text-gray-600">{profileData.user.email}</p>
                      <p className="text-gray-600">{profileData.user.phone}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium">
                            {profileData.stats.rating}
                          </span>
                          <span className="ml-1 text-sm text-gray-500">
                            ({profileData.stats.reviewCount} reviews)
                          </span>
                        </div>
                        <Badge variant="outline">
                          {profileData.user.verified
                            ? "Verified"
                            : "Unverified"}
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
                    value={profileForm.bio}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <p className="text-gray-700 mt-1">{profileData.bio}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  {isEditing ? (
                    <Input
                      id="experience"
                      type="number"
                      value={profileForm.yearsExperience}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          yearsExperience: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center mt-1">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{profileData.yearsExperience} years</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="radius">Service Radius (miles)</Label>
                  {isEditing ? (
                    <Input
                      id="radius"
                      type="number"
                      value={profileForm.serviceRadius}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          serviceRadius: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{profileData.serviceRadius} miles</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="pricing">Pricing Model</Label>
                  {isEditing ? (
                    <select
                      id="pricing"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                      value={profileForm.pricingModel}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          pricingModel: e.target.value,
                        }))
                      }
                    >
                      <option value="hourly">Hourly Rate</option>
                      <option value="fixed">Fixed Price</option>
                      <option value="both">Both</option>
                    </select>
                  ) : (
                    <div className="flex items-center mt-1">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="capitalize">
                        {profileData.pricingModel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Offered */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Services Offered</CardTitle>
                {isEditing && (
                  <Button
                    onClick={handleAddService}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Service
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileData.services.map((service) => (
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
                            handleUpdateService(
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
                            handleUpdateService(
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
                            handleUpdateService(
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
                          onClick={() => handleRemoveService(service.id)}
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
                    onClick={handleAddCertification}
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
                {profileData.certifications.map((cert) => (
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
                                e.target.value,
                                { name: e.target.value }
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
                                  e.target.value,
                                  { issuer: e.target.value }
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
                                  e.target.value,
                                  { date: e.target.value }
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
                                  e.target.value,
                                  { expiryDate: e.target.value }
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
                        {isEditing && (
                          <Button variant="outline" size="sm">
                            <Upload className="w-4 h-4 mr-1" />
                            Upload
                          </Button>
                        )}
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
