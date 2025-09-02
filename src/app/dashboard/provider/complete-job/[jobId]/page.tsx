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
  Camera,
  FileText
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  status: string;
  startedAt: string;
  estimatedDuration: string;
}

interface CompletionData {
  workDescription: string;
  completionNotes: string;
  beforePhotos: File[];
  afterPhotos: File[];
  hoursWorked: number;
  materialsUsed: string;
}

export default function CompleteJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [completionData, setCompletionData] = useState<CompletionData>({
    workDescription: "",
    completionNotes: "",
    beforePhotos: [],
    afterPhotos: [],
    hoursWorked: 0,
    materialsUsed: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        
        // Mock job data for UI testing
        const mockJob: Job = {
          id: jobId,
          title: "Kitchen Deep Cleaning",
          description: "Complete deep cleaning of kitchen including appliances, cabinets, countertops, and floors.",
          location: "Downtown Apartment Complex, Unit 4B",
          customerName: "Sarah Johnson",
          customerPhone: "+1-555-0123",
          amount: 180,
          status: "IN_PROGRESS",
          startedAt: "2025-09-03T09:00:00Z",
          estimatedDuration: "4 hours"
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

  const handleFileUpload = (type: 'before' | 'after', files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setCompletionData(prev => ({
        ...prev,
        [`${type}Photos`]: [...prev[`${type}Photos` as keyof CompletionData] as File[], ...fileArray]
      }));
    }
  };

  const removePhoto = (type: 'before' | 'after', index: number) => {
    setCompletionData(prev => ({
      ...prev,
      [`${type}Photos`]: (prev[`${type}Photos` as keyof CompletionData] as File[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      // Mock completion submission
      console.log("Completing job:", jobId, completionData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page or back to jobs
      router.push("/dashboard/provider/jobs?success=completed");
      
    } catch (err) {
      setError("Failed to complete job. Please try again.");
      console.error("Error completing job:", err);
    } finally {
      setSubmitting(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Complete Job</h1>
        </div>
        <Badge className="bg-yellow-100 text-yellow-800">
          <Clock className="w-4 h-4 mr-1" />
          In Progress
        </Badge>
      </div>

      {/* Job Details Card */}
      {job && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Job Information
            </CardTitle>
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
                    {job.customerName} - {job.customerPhone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    ${job.amount}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Started: {new Date(job.startedAt).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Job Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Estimated Duration:</span>
                    <span className="text-sm font-medium">{job.estimatedDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Time Elapsed:</span>
                    <span className="text-sm font-medium">
                      {Math.round((Date.now() - new Date(job.startedAt).getTime()) / (1000 * 60 * 60))} hours
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Form */}
      <Card>
        <CardHeader>
          <CardTitle>Job Completion Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Work Description */}
          <div>
            <Label htmlFor="workDescription">Work Completed</Label>
            <Textarea
              id="workDescription"
              placeholder="Describe the work you completed..."
              rows={4}
              value={completionData.workDescription}
              onChange={(e) => setCompletionData(prev => ({ ...prev, workDescription: e.target.value }))}
              className="mt-1"
            />
          </div>

          {/* Hours Worked */}
          <div>
            <Label htmlFor="hoursWorked">Total Hours Worked</Label>
            <input
              id="hoursWorked"
              type="number"
              step="0.5"
              min="0"
              placeholder="0"
              value={completionData.hoursWorked || ""}
              onChange={(e) => setCompletionData(prev => ({ ...prev, hoursWorked: parseFloat(e.target.value) || 0 }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Materials Used */}
          <div>
            <Label htmlFor="materialsUsed">Materials/Equipment Used</Label>
            <Textarea
              id="materialsUsed"
              placeholder="List any materials or special equipment used..."
              rows={3}
              value={completionData.materialsUsed}
              onChange={(e) => setCompletionData(prev => ({ ...prev, materialsUsed: e.target.value }))}
              className="mt-1"
            />
          </div>

          {/* Before Photos */}
          <div>
            <Label>Before Photos</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="before-photos" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload before photos
                    </span>
                    <input
                      id="before-photos"
                      type="file"
                      multiple
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleFileUpload('before', e.target.files)}
                    />
                  </label>
                </div>
              </div>
              
              {completionData.beforePhotos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {completionData.beforePhotos.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Before ${index + 1}`}
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto('before', index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* After Photos */}
          <div>
            <Label>After Photos</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="after-photos" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload after photos
                    </span>
                    <input
                      id="after-photos"
                      type="file"
                      multiple
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleFileUpload('after', e.target.files)}
                    />
                  </label>
                </div>
              </div>
              
              {completionData.afterPhotos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {completionData.afterPhotos.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`After ${index + 1}`}
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto('after', index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Completion Notes */}
          <div>
            <Label htmlFor="completionNotes">Additional Notes</Label>
            <Textarea
              id="completionNotes"
              placeholder="Any additional notes for the customer..."
              rows={3}
              value={completionData.completionNotes}
              onChange={(e) => setCompletionData(prev => ({ ...prev, completionNotes: e.target.value }))}
              className="mt-1"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !completionData.workDescription.trim()}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 mr-2" />
                  Marking as Complete...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Job as Complete
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
