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
  Loader2,
} from "lucide-react";
import { useServiceProviders } from "@/hooks/useServiceProviders";
import type { ServiceProvider } from "@/types/serviceProviders";

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
  const [sortBy, setSortBy] = useState<
    "rating" | "distance" | "price" | "experience"
  >("rating");
  const [savedProviders, setSavedProviders] = useState<string[]>([]);

  // Use the backend integration hook
  const {
    providers,
    loading,
    error,
    total,
    hasMore,
    searchProviders,
    filterByCategory,
    loadMore,
    refresh,
    clearError,
  } = useServiceProviders({
    page: 1,
    limit: 20,
    sortBy: "rating",
    sortOrder: "desc",
  });

  // Handle search
  const handleSearch = async () => {
    if (searchTerm.trim()) {
      await searchProviders(searchTerm, {
        category:
          selectedCategory === "All Categories" ? undefined : selectedCategory,
        sortBy,
        sortOrder: "desc",
      });
    } else {
      await filterByCategory(selectedCategory, {
        sortBy,
        sortOrder: "desc",
      });
    }
  };

  // Handle category filter
  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    await filterByCategory(category, {
      search: searchTerm || undefined,
      sortBy,
      sortOrder: "desc",
    });
  };

  // Handle sort change
  const handleSortChange = async (newSortBy: typeof sortBy) => {
    setSortBy(newSortBy);
    await filterByCategory(selectedCategory, {
      search: searchTerm || undefined,
      sortBy: newSortBy,
      sortOrder: "desc",
    });
  };

  // Handle search input enter key
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleSavedProvider = (providerId: string) => {
    setSavedProviders((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId]
    );
  };

  const getProviderName = (provider: ServiceProvider) => {
    if (provider.businessName) {
      return provider.businessName;
    }
    if (provider.user) {
      return `${provider.user.firstName} ${provider.user.lastName}`;
    }
    return "Service Provider";
  };

  const getProviderInitials = (provider: ServiceProvider) => {
    const name = getProviderName(provider);
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getAvailabilityStatus = (provider: ServiceProvider) => {
    if (!provider.availability || !provider.isAvailable) {
      return "offline";
    }
    return "available";
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "busy":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatResponseTime = (hours: number) => {
    if (hours < 1) {
      return "Usually responds within 30 minutes";
    } else if (hours === 1) {
      return "Usually responds within 1 hour";
    } else {
      return `Usually responds within ${hours} hours`;
    }
  };

  const ProviderCard = ({ provider }: { provider: ServiceProvider }) => {
    const isSaved = savedProviders.includes(provider.id);
    const providerName = getProviderName(provider);
    const availabilityStatus = getAvailabilityStatus(provider);

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-medium mr-4">
                {getProviderInitials(provider)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {providerName}
                  </h3>
                  {provider.user?.isVerified && (
                    <div title="Verified Provider">
                      <Shield className="w-4 h-4 text-blue-500" />
                    </div>
                  )}
                  <span
                    className={`w-2 h-2 rounded-full ${getAvailabilityColor(
                      availabilityStatus
                    )}`}
                  />
                </div>
                <p className="text-emerald-600 font-medium">
                  {provider.category}
                </p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">
                    {provider.rating.toFixed(1)}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">
                    (Reviews available)
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleSavedProvider(provider.id)}
              className={`p-2 rounded-full transition-colors ${
                isSaved
                  ? "text-red-500 bg-red-50"
                  : "text-gray-400 hover:text-red-500 hover:bg-red-50"
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
            </button>
          </div>

          {provider.businessName && (
            <p className="text-gray-600 text-sm mb-3">
              Business: {provider.businessName}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {provider.specializations?.map((spec, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {spec.category?.name || spec.categoryId}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {provider.location}{" "}
              {provider.distance && `(${provider.distance.toFixed(1)} mi)`}
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              {provider.averageResponseTime
                ? formatResponseTime(provider.averageResponseTime)
                : "Response time varies"}
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-2" />
              {provider.hourlyRate
                ? `$${provider.hourlyRate}/hour`
                : "Price on request"}
            </div>
            <div className="flex items-center text-gray-600">
              <Shield className="w-4 h-4 mr-2" />
              {provider.completedJobs || 0} jobs completed
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
          {loading ? (
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Loading...
            </div>
          ) : (
            <>
              {providers.length} provider
              {providers.length !== 1 ? "s" : ""} found
              {total && total > providers.length && (
                <span className="ml-2 text-gray-500">
                  (showing {providers.length} of {total})
                </span>
              )}
            </>
          )}
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
                  onKeyPress={handleSearchKeyPress}
                  className="pl-10"
                />
              </div>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
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
                onChange={(e) =>
                  handleSortChange(e.target.value as typeof sortBy)
                }
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
        {error && (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-red-600 mb-4">
                  Error loading providers: {error}
                </p>
                <Button onClick={() => clearError()} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {!error && (
          <>
            {loading && providers.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardContent className="p-12 text-center">
                    <Loader2 className="mx-auto h-12 w-12 text-gray-400 mb-4 animate-spin" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Loading providers...
                    </h3>
                    <p className="text-gray-600">
                      Please wait while we search for service providers.
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : providers.length > 0 ? (
              <>
                {providers.map((provider: ServiceProvider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}

                {/* Load More Button */}
                {hasMore && (
                  <div className="col-span-full flex justify-center">
                    <Button
                      onClick={loadMore}
                      disabled={loading}
                      variant="outline"
                      className="w-full max-w-md"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading more...
                        </>
                      ) : (
                        "Load More Providers"
                      )}
                    </Button>
                  </div>
                )}
              </>
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
                    <Button
                      onClick={refresh}
                      variant="outline"
                      className="mt-4"
                    >
                      Refresh Search
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
