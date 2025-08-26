"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, Edit, Trash2, AlertCircle } from "lucide-react";

interface Review {
  id: string;
  jobId: string;
  jobTitle: string;
  provider: {
    id: string;
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  canEdit: boolean;
}

interface PendingReview {
  id: string;
  jobId: string;
  jobTitle: string;
  provider: {
    id: string;
    name: string;
    avatar: string;
  };
  completedAt: string;
}

const mockReviews: Review[] = [
  {
    id: "1",
    jobId: "job-1",
    jobTitle: "Garden Maintenance",
    provider: {
      id: "provider-1",
      name: "Green Thumb Co.",
      avatar: "GT",
    },
    rating: 5,
    comment:
      "Excellent service! They did a fantastic job on our garden. Very professional and thorough. Would definitely hire again.",
    createdAt: "2025-08-20T15:30:00Z",
    canEdit: true,
  },
  {
    id: "2",
    jobId: "job-2",
    jobTitle: "House Cleaning",
    provider: {
      id: "provider-2",
      name: "Sarah Johnson",
      avatar: "SJ",
    },
    rating: 4,
    comment:
      "Good cleaning service. Arrived on time and did a decent job. House was clean but missed a few spots in the bathroom.",
    createdAt: "2025-08-15T10:45:00Z",
    canEdit: true,
  },
  {
    id: "3",
    jobId: "job-3",
    jobTitle: "Electrical Repair",
    provider: {
      id: "provider-3",
      name: "Alex Rodriguez",
      avatar: "AR",
    },
    rating: 5,
    comment:
      "Outstanding electrician! Fixed the wiring issue quickly and explained everything clearly. Fair pricing and excellent workmanship.",
    createdAt: "2025-08-10T14:20:00Z",
    canEdit: false,
  },
];

const mockPendingReviews: PendingReview[] = [
  {
    id: "pending-1",
    jobId: "job-4",
    jobTitle: "Kitchen Deep Cleaning",
    provider: {
      id: "provider-1",
      name: "Sarah Johnson",
      avatar: "SJ",
    },
    completedAt: "2025-08-24T16:00:00Z",
  },
  {
    id: "pending-2",
    jobId: "job-5",
    jobTitle: "Plumbing Repair",
    provider: {
      id: "provider-4",
      name: "Mike Wilson",
      avatar: "MW",
    },
    completedAt: "2025-08-23T11:30:00Z",
  },
];

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [pendingReviews, setPendingReviews] =
    useState<PendingReview[]>(mockPendingReviews);
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [formData, setFormData] = useState({ rating: 5, comment: "" });

  const tabs = [
    { id: "pending", label: "Pending Reviews", count: pendingReviews.length },
    { id: "given", label: "Given Reviews", count: reviews.length },
  ];

  const handleSubmitReview = (pendingReviewId: string) => {
    const pendingReview = pendingReviews.find(
      (pr) => pr.id === pendingReviewId
    );
    if (!pendingReview) return;

    const newReview: Review = {
      id: `review-${Date.now()}`,
      jobId: pendingReview.jobId,
      jobTitle: pendingReview.jobTitle,
      provider: pendingReview.provider,
      rating: formData.rating,
      comment: formData.comment,
      createdAt: new Date().toISOString(),
      canEdit: true,
    };

    setReviews((prev) => [newReview, ...prev]);
    setPendingReviews((prev) => prev.filter((pr) => pr.id !== pendingReviewId));
    setShowReviewForm(null);
    setFormData({ rating: 5, comment: "" });
  };

  const handleEditReview = (reviewId: string) => {
    const review = reviews.find((r) => r.id === reviewId);
    if (review) {
      setFormData({ rating: review.rating, comment: review.comment });
      setEditingReview(reviewId);
    }
  };

  const handleUpdateReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? { ...review, rating: formData.rating, comment: formData.comment }
          : review
      )
    );
    setEditingReview(null);
    setFormData({ rating: 5, comment: "" });
  };

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    }
  };

  const renderStarRating = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            } transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const ReviewForm = ({
    onSubmit,
    onCancel,
    submitLabel = "Submit Review",
  }: {
    onSubmit: () => void;
    onCancel: () => void;
    submitLabel?: string;
  }) => (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        {renderStarRating(formData.rating, true, (rating) =>
          setFormData((prev) => ({ ...prev, rating }))
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comment
        </label>
        <textarea
          value={formData.comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData((prev) => ({ ...prev, comment: e.target.value }))
          }
          placeholder="Share your experience with this provider..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex space-x-3">
        <Button
          onClick={onSubmit}
          className="bg-emerald-600 hover:bg-emerald-700"
          disabled={!formData.comment.trim()}
        >
          {submitLabel}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );

  const PendingReviewCard = ({
    pendingReview,
  }: {
    pendingReview: PendingReview;
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {pendingReview.jobTitle}
            </h3>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                {pendingReview.provider.avatar}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {pendingReview.provider.name}
                </p>
                <p className="text-sm text-gray-600">
                  Completed{" "}
                  {new Date(pendingReview.completedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <Badge className="bg-orange-100 text-orange-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        </div>

        {showReviewForm === pendingReview.id ? (
          <ReviewForm
            onSubmit={() => handleSubmitReview(pendingReview.id)}
            onCancel={() => {
              setShowReviewForm(null);
              setFormData({ rating: 5, comment: "" });
            }}
          />
        ) : (
          <Button
            onClick={() => setShowReviewForm(pendingReview.id)}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Star className="w-4 h-4 mr-2" />
            Write Review
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const ReviewCard = ({ review }: { review: Review }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {review.jobTitle}
            </h3>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                {review.provider.avatar}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {review.provider.name}
                </p>
                <div className="flex items-center">
                  {renderStarRating(review.rating)}
                  <span className="ml-2 text-sm text-gray-600">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {review.canEdit && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditReview(review.id)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleDeleteReview(review.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {editingReview === review.id ? (
          <ReviewForm
            onSubmit={() => handleUpdateReview(review.id)}
            onCancel={() => {
              setEditingReview(null);
              setFormData({ rating: 5, comment: "" });
            }}
            submitLabel="Update Review"
          />
        ) : (
          <p className="text-gray-700">{review.comment}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <div className="text-sm text-gray-600">
          {activeTab === "pending" ? pendingReviews.length : reviews.length}{" "}
          review
          {(activeTab === "pending"
            ? pendingReviews.length
            : reviews.length) !== 1
            ? "s"
            : ""}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "pending" ? (
          pendingReviews.length > 0 ? (
            pendingReviews.map((pendingReview) => (
              <PendingReviewCard
                key={pendingReview.id}
                pendingReview={pendingReview}
              />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No pending reviews
                </h3>
                <p className="text-gray-600">
                  You&apos;re all caught up! Complete more jobs to leave reviews
                  for providers.
                </p>
              </CardContent>
            </Card>
          )
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-600">
                You haven&apos;t written any reviews yet. Complete some jobs to
                start reviewing providers.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
