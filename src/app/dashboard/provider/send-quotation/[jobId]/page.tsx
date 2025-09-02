"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/common";
import { ArrowLeft, DollarSign, Clock, FileText } from "lucide-react";
// import { jobService } from "@/services/jobService";
// import { quotationService } from "@/services/quotationService";
import type { Job } from "@/types/job";
import { JobStatus } from "@/types/job";

const quotationSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  estimatedDuration: z.string().min(1, "Please provide estimated duration"),
  validUntil: z.string().min(1, "Please set quotation validity period"),
  items: z.array(z.object({
    description: z.string().min(1, "Item description is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.number().min(0, "Unit price must be positive"),
  })).optional(),
});

type QuotationFormValues = z.infer<typeof quotationSchema>;

interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function SendQuotationPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<QuotationItem[]>([
    { description: "", quantity: 1, unitPrice: 0 }
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    }
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        
        // Mock job data for UI testing
        const mockJob: Job = {
          id: jobId,
          title: "Kitchen Deep Cleaning",
          description: "Complete deep cleaning of kitchen including appliances, cabinets, countertops, and floors. Special attention needed for grease removal and sanitization.",
          category: "Cleaning",
          location: "Downtown Apartment Complex, Unit 4B",
          budget: 250,
          priority: "MEDIUM",
          status: JobStatus.OPEN,
          requirements: [
            "Bring own cleaning supplies",
            "Complete within 4 hours", 
            "Kitchen appliances cleaning included",
            "Post-cleaning sanitization required"
          ],
          customerId: "customer-1",
          customerEmail: "customer@example.com",
          createdAt: "2025-09-01T10:00:00Z",
          updatedAt: "2025-09-01T10:00:00Z"
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

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof QuotationItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
    calculateTotal();
  };

  const calculateTotal = () => {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    setValue("amount", total);
    return total;
  };

  const onSubmit = async (data: QuotationFormValues) => {
    setSubmitting(true);
    setError(null);

    try {
      const quotationData = {
        jobId,
        providerId: "current-provider-id", // TODO: Get from auth context
        description: data.message,
        amount: data.amount,
        currency: "USD",
        validUntil: data.validUntil,
        items: items.filter(item => item.description.trim() !== "").map(item => ({
          ...item,
          total: item.quantity * item.unitPrice
        })),
        notes: `Estimated duration: ${data.estimatedDuration}`,
      };

      console.log("Submitting quotation:", quotationData);
      
      // Mock success response for UI testing
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      // Navigate to quotations page with success message
      router.push("/dashboard/provider/quotations?success=sent");
      
    } catch (err) {
      setError("Failed to send quotation. Please try again.");
      console.error("Error sending quotation:", err);
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
          <h1 className="text-3xl font-bold text-gray-900">Send Quotation</h1>
        </div>
      </div>

      {/* Job Details Card */}
      {job && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <p className="text-gray-600 mt-2">{job.description}</p>
                <div className="mt-4 space-y-2">
                  <p><span className="font-medium">Category:</span> {job.category}</p>
                  <p><span className="font-medium">Location:</span> {job.location}</p>
                  <p><span className="font-medium">Priority:</span> {job.priority}</p>
                  {job.budget && (
                    <p><span className="font-medium">Customer Budget:</span> ${job.budget}</p>
                  )}
                </div>
              </div>
              <div>
                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="text-gray-600">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quotation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create Your Quotation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Items Breakdown */}
            <div>
              <Label className="text-base font-medium">Service Breakdown</Label>
              <div className="mt-2 space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-lg">
                    <div className="md:col-span-2">
                      <Label htmlFor={`item-desc-${index}`}>Description</Label>
                      <Input
                        id={`item-desc-${index}`}
                        placeholder="Service description"
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`item-qty-${index}`}>Quantity</Label>
                      <Input
                        id={`item-qty-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <Label htmlFor={`item-price-${index}`}>Unit Price ($)</Label>
                        <Input
                          id={`item-price-${index}`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  className="w-full"
                >
                  Add Item
                </Button>
              </div>
            </div>

            {/* Total Amount */}
            <div>
              <Label htmlFor="amount" className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Total Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register("amount", { valueAsNumber: true })}
                value={calculateTotal()}
                readOnly
                className="text-lg font-semibold"
              />
              {errors.amount && (
                <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
              )}
            </div>

            {/* Estimated Duration */}
            <div>
              <Label htmlFor="estimatedDuration" className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Estimated Duration
              </Label>
              <Input
                id="estimatedDuration"
                placeholder="e.g., 3 hours, 2 days, 1 week"
                {...register("estimatedDuration")}
                className={errors.estimatedDuration ? "border-red-500" : ""}
              />
              {errors.estimatedDuration && (
                <p className="text-sm text-red-600 mt-1">{errors.estimatedDuration.message}</p>
              )}
            </div>

            {/* Valid Until */}
            <div>
              <Label htmlFor="validUntil">Quotation Valid Until</Label>
              <Input
                id="validUntil"
                type="date"
                {...register("validUntil")}
                className={errors.validUntil ? "border-red-500" : ""}
              />
              {errors.validUntil && (
                <p className="text-sm text-red-600 mt-1">{errors.validUntil.message}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message">Message to Customer</Label>
              <Textarea
                id="message"
                placeholder="Explain your approach, timeline, and any additional details..."
                rows={4}
                {...register("message")}
                className={errors.message ? "border-red-500" : ""}
              />
              {errors.message && (
                <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {submitting ? "Sending..." : "Send Quotation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
