"use client";

import { useState } from "react";
import {
  Star,
  MessageCircle,
  ThumbsUp,
  Filter,
  TrendingUp,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Review {
  id: string;
  customerName: string;
  customerInitials: string;
  jobTitle: string;
  jobType: string;
  rating: number;
  reviewText: string;
  date: string;
  helpful: number;
  providerResponse?: string;
  responseDate?: string;
}

const mockReviews: Review[] = [
  {
    id: "1",
    customerName: "Emma Wilson",
    customerInitials: "EW",
    jobTitle: "Kitchen Deep Cleaning",
    jobType: "Cleaning",
    rating: 5,
    reviewText:
      "Alex did an outstanding job cleaning our kitchen. Very professional, punctual, and thorough. The kitchen looks brand new! Highly recommend for anyone needing deep cleaning services.",
    date: "2025-08-24",
    helpful: 3,
    providerResponse:
      "Thank you so much for the kind words! It was a pleasure working with you and I'm glad you're happy with the results.",
    responseDate: "2025-08-24",
  },
  {
    id: "2",
    customerName: "Mike Johnson",
    customerInitials: "MJ",
    jobTitle: "Electrical Installation",
    jobType: "Electrical",
    rating: 5,
    reviewText:
      "Excellent electrical work! Alex was knowledgeable, efficient, and explained everything clearly. The installation was completed exactly as discussed and on time.",
    date: "2025-08-22",
    helpful: 2,
  },
  {
    id: "3",
    customerName: "Sarah Davis",
    customerInitials: "SD",
    jobTitle: "Plumbing Repair",
    jobType: "Plumbing",
    rating: 4,
    reviewText:
      "Good work overall. Fixed the leak quickly and cleaned up after. Only minor issue was arriving 15 minutes late, but called to let me know. Would use again.",
    date: "2025-08-20",
    helpful: 1,
    providerResponse:
      "Thank you for the feedback! I apologize for the delay and appreciate your understanding. I'll make sure to be more punctual in the future.",
    responseDate: "2025-08-21",
  },
  {
    id: "4",
    customerName: "John Smith",
    customerInitials: "JS",
    jobTitle: "Garden Maintenance",
    jobType: "Landscaping",
    rating: 5,
    reviewText:
      "Fantastic garden maintenance service! Alex transformed our overgrown yard into a beautiful, well-maintained space. Very fair pricing and professional service.",
    date: "2025-08-18",
    helpful: 4,
  },
  {
    id: "5",
    customerName: "Lisa Brown",
    customerInitials: "LB",
    jobTitle: "Office Cleaning",
    jobType: "Cleaning",
    rating: 4,
    reviewText:
      "Reliable and thorough cleaning service. Alex is professional and pays attention to detail. Office was spotless after the service. Will definitely book again.",
    date: "2025-08-15",
    helpful: 2,
  },
];

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);

  const filteredReviews = mockReviews.filter((review) => {
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.jobType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      filterRating === "all" || review.rating === filterRating;
    return matchesSearch && matchesRating;
  });

  // Calculate statistics
  const totalReviews = mockReviews.length;
  const averageRating =
    mockReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: mockReviews.filter((r) => r.rating === rating).length,
    percentage: Math.round(
      (mockReviews.filter((r) => r.rating === rating).length / totalReviews) *
        100
    ),
  }));

  const handleReply = (reviewId: string) => {
    console.log("Replying to review:", reviewId, replyText[reviewId]);
    // Save reply to backend
    setShowReplyForm(null);
    setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
  };

  const renderStars = (rating: number, className = "w-4 h-4") => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${className} ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Export Reviews
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Overall Rating
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {averageRating.toFixed(1)}
                  </p>
                  {renderStars(Math.round(averageRating), "w-5 h-5")}
                </div>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Reviews
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalReviews}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +8 this month
                </p>
              </div>
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  5-Star Reviews
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {ratingDistribution.find((r) => r.rating === 5)?.count || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {ratingDistribution.find((r) => r.rating === 5)?.percentage ||
                    0}
                  % of total
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-green-600 fill-current" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Response Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">60%</p>
                <p className="text-xs text-gray-500 mt-1">3 of 5 replied</p>
              </div>
              <MessageCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-4">
                <span className="w-8 text-sm font-medium">{rating} ⭐</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="w-12 text-sm text-gray-600">{count}</span>
                <span className="w-12 text-sm text-gray-500">
                  {percentage}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <select
              value={filterRating}
              onChange={(e) =>
                setFilterRating(
                  e.target.value === "all" ? "all" : Number(e.target.value)
                )
              }
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    {review.customerInitials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {review.customerName}
                      </h3>
                      {renderStars(review.rating)}
                      <Badge variant="outline">{review.jobType}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {review.jobTitle}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {review.reviewText}
                </p>
              </div>

              {review.providerResponse && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <User className="w-4 h-4 text-emerald-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-emerald-900 mb-1">
                        Your Response:
                      </p>
                      <p className="text-sm text-emerald-800">
                        {review.providerResponse}
                      </p>
                      {review.responseDate && (
                        <p className="text-xs text-emerald-600 mt-2">
                          {new Date(review.responseDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {showReplyForm === review.id && (
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reply to this review:
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Thank you for your feedback..."
                    value={replyText[review.id] || ""}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [review.id]: e.target.value,
                      }))
                    }
                  />
                  <div className="flex justify-end space-x-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReplyForm(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleReply(review.id)}
                      disabled={!replyText[review.id]?.trim()}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Post Reply
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                </div>

                {!review.providerResponse && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReplyForm(review.id)}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Reply
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reviews found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "You haven't received any reviews yet. Complete some jobs to start getting feedback!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
