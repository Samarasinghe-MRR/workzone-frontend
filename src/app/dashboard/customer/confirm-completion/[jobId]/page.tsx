"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/common";
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  MapPin, 
  User, 
  DollarSign,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  providerName: string;
  providerPhone: string;
  amount: number;
  status: string;
  completedAt: string;
  workDescription: string;
  hoursWorked: number;
  materialsUsed: string;
  beforePhotos: string[];
  afterPhotos: string[];
  completionNotes: string;
}

interface ReviewData {
  rating: number;
  reviewText: string;
  wouldRecommend: boolean;
}

export default function ConfirmJobCompletionPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const [reviewData, setReviewData] = useState<ReviewData>({
    rating: 5,
    reviewText: "",
    wouldRecommend: true,
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        
        // Mock job completion data for UI testing
        const mockJob: Job = {
          id: jobId,
          title: "Kitchen Deep Cleaning",
          description: "Complete deep cleaning of kitchen including appliances, cabinets, countertops, and floors.",
          location: "Downtown Apartment Complex, Unit 4B",
          providerName: "Alex Johnson",
          providerPhone: "+1-555-0123",
          amount: 180,
          status: "COMPLETED",
          completedAt: "2025-09-03T14:30:00Z",
          workDescription: "Completed thorough deep cleaning of kitchen including: \\n- Deep cleaned all appliances (oven, refrigerator, microwave, dishwasher)\\n- Scrubbed and sanitized all countertops and backsplash\\n- Cleaned inside and outside of all cabinets\\n- Mopped and disinfected floors\\n- Cleaned light fixtures and ceiling fan",
          hoursWorked: 4.5,
          materialsUsed: "Eco-friendly cleaning supplies, degreasing agents, microfiber cloths, specialized appliance cleaners",
          beforePhotos: [
            "/api/placeholder/200/150",
            "/api/placeholder/200/150",
            "/api/placeholder/200/150"
          ],
          afterPhotos: [
            "/api/placeholder/200/150",
            "/api/placeholder/200/150",
            "/api/placeholder/200/150"
          ],
          completionNotes: "Kitchen is now spotless and sanitized. All surfaces have been deep cleaned and disinfected. I recommend regular maintenance cleaning every 2-3 weeks to maintain this level of cleanliness."
        };
        
        setJob(mockJob);
      } catch (err) {
        setError("Failed to load job details");
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const handleConfirmCompletion = async () => {
    setSubmitting(true);
    setError(null);

    try {
      // Mock completion confirmation
      console.log("Confirming job completion:", jobId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowReviewForm(true);
      
    } catch (err) {
      setError("Failed to confirm completion. Please try again.");
      console.error("Error confirming completion:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReview = async () => {
    setSubmitting(true);
    setError(null);

    try {
      // Mock review submission
      console.log("Submitting review:", reviewData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to jobs page with success message
      router.push("/dashboard/customer/jobs?success=reviewed");
      
    } catch (err) {
      setError("Failed to submit review. Please try again.");
      console.error("Error submitting review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDispute = () => {
    // Navigate to dispute form
    router.push(`/dashboard/customer/dispute/${jobId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Job Completion Review</h1>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Completed
        </Badge>
      </div>

      {/* Job Details Card */}
      {job && (
        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-4">{job.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    {job.providerName} - {job.providerPhone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    ${job.amount}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Completed: {new Date(job.completedAt).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Work Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hours Worked:</span>
                    <span className="text-sm font-medium">{job.hoursWorked} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Work Completed Details */}
      <Card>
        <CardHeader>
          <CardTitle>Work Completed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Description of Work Done:</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line">{job?.workDescription}</p>
            </div>
          </div>

          {job?.materialsUsed && (
            <div>
              <h4 className="font-medium mb-2">Materials & Equipment Used:</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{job.materialsUsed}</p>
              </div>
            </div>
          )}

          {/* Before/After Photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Before Photos:</h4>
              <div className="grid grid-cols-2 gap-2">
                {job?.beforePhotos.map((photo, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Before {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">After Photos:</h4>
              <div className="grid grid-cols-2 gap-2">
                {job?.afterPhotos.map((photo, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">After {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {job?.completionNotes && (
            <div>
              <h4 className="font-medium mb-2">Provider Notes:</h4>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-blue-800">{job.completionNotes}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Rating */}
            <div>
              <Label>Rating</Label>
              <div className="flex items-center space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setReviewData(prev => ({ ...prev, rating }))}
                    className={`p-1 ${rating <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({reviewData.rating} star{reviewData.rating !== 1 ? 's' : ''})
                </span>
              </div>
            </div>

            {/* Review Text */}
            <div>
              <Label htmlFor="reviewText">Review</Label>
              <Textarea
                id="reviewText"
                placeholder="Share your experience with this service provider..."
                rows={4}
                value={reviewData.reviewText}
                onChange={(e) => setReviewData(prev => ({ ...prev, reviewText: e.target.value }))}
                className="mt-1"
              />
            </div>

            {/* Recommendation */}
            <div>
              <Label>Would you recommend this service provider?</Label>
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => setReviewData(prev => ({ ...prev, wouldRecommend: true }))}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                    reviewData.wouldRecommend 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Yes</span>
                </button>
                <button
                  onClick={() => setReviewData(prev => ({ ...prev, wouldRecommend: false }))}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                    !reviewData.wouldRecommend 
                      ? 'bg-red-50 border-red-200 text-red-800' 
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>No</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                onClick={handleSubmitReview}
                disabled={submitting || !reviewData.reviewText.trim()}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2" />
                    Submitting Review...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Completion Confirmation */
        <Card>
          <CardHeader>
            <CardTitle>Confirm Job Completion</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            
            <p className="text-gray-600 mb-6">
              Please review the work completed above. If you&apos;re satisfied with the service, 
              confirm the completion to proceed with payment and leave a review. 
              If there are any issues, you can open a dispute.
            </p>
            
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={handleDispute}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Report Issue
              </Button>
              <Button
                onClick={handleConfirmCompletion}
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Completion
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
