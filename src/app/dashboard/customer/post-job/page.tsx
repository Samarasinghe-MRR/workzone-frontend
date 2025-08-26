"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  //CardHeader,
  //CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  MapPin,
  DollarSign,
  Upload,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const jobSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(5, "Please provide a valid location"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  budget: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

const categories = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Painting",
  "Carpentry",
  "Gardening",
  "Moving",
  "Handyman",
  "HVAC",
  "Roofing",
  "Other",
];

export default function PostJobPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
  });

  const onSubmit = async (data: JobFormValues) => {
    setLoading(true);
    try {
      // Here you would call your API to create the job
      console.log("Job data:", data);
      console.log("Files:", selectedFiles);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      router.push("/dashboard/customer/jobs");
    } catch (error) {
      console.error("Error posting job:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Job Details
              </h2>
              <p className="text-gray-600">
                Tell us about the job you need done
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Fix leaking kitchen faucet"
                  {...register("title")}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  {...register("category")}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the job in detail..."
                  rows={4}
                  {...register("description")}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Location & Schedule
              </h2>
              <p className="text-gray-600">
                When and where should the work be done?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="location" className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="Enter full address"
                  {...register("location")}
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date")}
                    className={errors.date ? "border-red-500" : ""}
                  />
                  {errors.date && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    {...register("time")}
                    className={errors.time ? "border-red-500" : ""}
                  />
                  {errors.time && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.time.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="budget" className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Budget (Optional)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="Enter your budget"
                  {...register("budget")}
                />
                <p className="text-sm text-gray-500 mt-1">
                  This helps providers give you accurate quotes
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Upload Photos
              </h2>
              <p className="text-gray-600">
                Help providers understand the job better (Optional)
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photos
                </Label>
                <div className="mt-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors"
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Click to upload photos
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB each
                    </span>
                  </label>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm text-gray-600 text-center px-2">
                          {file.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Job Summary</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    <strong>Title:</strong> {watch("title") || "Not specified"}
                  </p>
                  <p>
                    <strong>Category:</strong>{" "}
                    {watch("category") || "Not specified"}
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {watch("location") || "Not specified"}
                  </p>
                  <p>
                    <strong>Date:</strong> {watch("date") || "Not specified"}
                  </p>
                  <p>
                    <strong>Time:</strong> {watch("time") || "Not specified"}
                  </p>
                  {watch("budget") && (
                    <p>
                      <strong>Budget:</strong> ${watch("budget")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Post a Job</h1>
          <div className="flex space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center bg-emerald-600 hover:bg-emerald-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {loading ? "Posting Job..." : "Post Job"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
