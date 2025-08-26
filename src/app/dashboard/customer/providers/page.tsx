"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Heart,
  Eye,
  MessageCircle,
  Shield,
  Clock,
  DollarSign,
} from "lucide-react";

interface Provider {
  id: string;
  name: string;
  category: string;
  specialties: string[];
  location: string;
  distance: number;
  rating: number;
  reviewCount: number;
  hourlyRate?: number;
  fixedPriceRange?: { min: number; max: number };
  avatar: string;
  isVerified: boolean;
  responseTime: string;
  completedJobs: number;
  description: string;
  availability: "available" | "busy" | "offline";
}

const mockProviders: Provider[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    category: "Cleaning",
    specialties: ["Deep Cleaning", "Regular Cleaning", "Move-out Cleaning"],
    location: "Downtown",
    distance: 2.3,
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 35,
    avatar: "SJ",
    isVerified: true,
    responseTime: "Usually responds within 1 hour",
    completedJobs: 156,
    description:
      "Professional cleaning service with 5 years of experience. Eco-friendly products used.",
    availability: "available",
  },
  {
    id: "2",
    name: "Mike Wilson",
    category: "Plumbing",
    specialties: ["Emergency Repairs", "Installation", "Maintenance"],
    location: "Midtown",
    distance: 3.7,
    rating: 4.8,
    reviewCount: 89,
    fixedPriceRange: { min: 100, max: 500 },
    avatar: "MW",
    isVerified: true,
    responseTime: "Usually responds within 30 minutes",
    completedJobs: 234,
    description:
      "Licensed plumber with 10+ years experience. Available for emergency calls.",
    availability: "available",
  },
  {
    id: "3",
    name: "Green Thumb Co.",
    category: "Gardening",
    specialties: ["Lawn Care", "Landscaping", "Tree Service"],
    location: "Suburbs",
    distance: 5.1,
    rating: 4.7,
    reviewCount: 203,
    hourlyRate: 45,
    avatar: "GT",
    isVerified: true,
    responseTime: "Usually responds within 2 hours",
    completedJobs: 312,
    description:
      "Full-service landscaping company. Serving the area for over 15 years.",
    availability: "busy",
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    category: "Electrical",
    specialties: ["Wiring", "Installation", "Repairs"],
    location: "Downtown",
    distance: 1.8,
    rating: 4.9,
    reviewCount: 156,
    fixedPriceRange: { min: 150, max: 800 },
    avatar: "AR",
    isVerified: true,
    responseTime: "Usually responds within 1 hour",
    completedJobs: 189,
    description:
      "Licensed electrician specializing in residential and commercial work.",
    availability: "available",
  },
];

const categories = [
  "All Categories",
  "Cleaning",
  "Plumbing",
  "Electrical",
  "Gardening",
  "Painting",
  "Carpentry",
  "Moving",
  "Handyman",
];

const priceRanges = [
  "All Prices",
  "$0 - $50",
  "$50 - $100",
  "$100 - $200",
  "$200+",
];

export default function FindProvidersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices");
  const [sortBy, setSortBy] = useState("rating");
  const [providers] = useState<Provider[]>(mockProviders);
  const [savedProviders, setSavedProviders] = useState<string[]>([]);

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.specialties.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All Categories" ||
      provider.category === selectedCategory;

    const matchesPrice =
      selectedPriceRange === "All Prices" ||
      (() => {
        const rate = provider.hourlyRate || provider.fixedPriceRange?.min || 0;
        switch (selectedPriceRange) {
          case "$0 - $50":
            return rate <= 50;
          case "$50 - $100":
            return rate > 50 && rate <= 100;
          case "$100 - $200":
            return rate > 100 && rate <= 200;
          case "$200+":
            return rate > 200;
          default:
            return true;
        }
      })();

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "distance":
        return a.distance - b.distance;
      case "price":
        const aPrice = a.hourlyRate || a.fixedPriceRange?.min || 0;
        const bPrice = b.hourlyRate || b.fixedPriceRange?.min || 0;
        return aPrice - bPrice;
      default:
        return 0;
    }
  });

  const toggleSaveProvider = (providerId: string) => {
    setSavedProviders((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId]
    );
  };

  const ProviderCard = ({ provider }: { provider: Provider }) => {
    const isSaved = savedProviders.includes(provider.id);

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-medium mr-4">
                {provider.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {provider.name}
                  </h3>
                  {provider.isVerified && (
                    <div title="Verified Provider">
                      <Shield className="w-4 h-4 text-blue-500" />
                    </div>
                  )}
                  <span
                    className={`w-2 h-2 rounded-full ${
                      provider.availability === "available"
                        ? "bg-green-500"
                        : provider.availability === "busy"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  />
                </div>
                <p className="text-emerald-600 font-medium">
                  {provider.category}
                </p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">
                    {provider.rating}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">
                    ({provider.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleSaveProvider(provider.id)}
              className={`p-2 rounded-full transition-colors ${
                isSaved
                  ? "text-red-500 bg-red-50"
                  : "text-gray-400 hover:text-red-500 hover:bg-red-50"
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
            </button>
          </div>

          <p className="text-gray-600 text-sm mb-3">{provider.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {provider.specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {provider.location} ({provider.distance} mi)
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              {provider.responseTime}
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-2" />
              {provider.hourlyRate
                ? `$${provider.hourlyRate}/hour`
                : `$${provider.fixedPriceRange?.min} - $${provider.fixedPriceRange?.max}`}
            </div>
            <div className="flex items-center text-gray-600">
              <Shield className="w-4 h-4 mr-2" />
              {provider.completedJobs} jobs completed
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </Button>
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Find Providers</h1>
        <div className="text-sm text-gray-600">
          {sortedProviders.length} provider
          {sortedProviders.length !== 1 ? "s" : ""} found
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, category, or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {priceRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="distance">Nearest</option>
                <option value="price">Lowest Price</option>
              </select>
            </div>

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedProviders.length > 0 ? (
          sortedProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No providers found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters to find more
                  providers.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
