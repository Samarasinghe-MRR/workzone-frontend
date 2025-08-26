"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupSchema, SignupFormValues } from "../schema/signupSchema";
import { authService } from "../services/authService";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Get signup type from URL params (customer or provider)
  const signupType = searchParams.get("type") || "customer";
  const isProvider = signupType === "provider";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: signupType as "customer" | "provider",
    },
  });

  // Set role based on signup type
  useEffect(() => {
    setValue("role", signupType as "customer" | "provider");
  }, [signupType, setValue]);

  const onSubmit = async (data: SignupFormValues) => {
    console.log("SignupForm - onSubmit called with data:", data);
    setLoading(true);
    setApiError(null);

    try {
      const response = await authService.signup(data);

      if (response.success) {
        // Redirect to login page after successful signup
        router.push("/auth/login");
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isProvider ? "Join as a Professional" : "Create Your Account"}
          </CardTitle>
          <p className="text-sm text-gray-600 text-center">
            {isProvider
              ? "Start offering your services on WorkZone"
              : "Join WorkZone to find the best services"}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Hidden Role Field */}
            <input type="hidden" {...register("role")} />

            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                {...register("phone")}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Provider-specific fields */}
            {isProvider && (
              <>
                {/* Location Field */}
                <div className="space-y-2">
                  <Label htmlFor="location">Service Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter your service location"
                    {...register("location")}
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                {/* Service Category Field */}
                <div className="space-y-2">
                  <Label htmlFor="category">Service Category</Label>
                  <Input
                    id="category"
                    type="text"
                    placeholder="e.g., Plumbing, Electrical, Cleaning"
                    {...register("category")}
                    className={errors.category ? "border-red-500" : ""}
                  />
                  {errors.category && (
                    <p className="text-sm text-red-600">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Experience Years Field */}
                <div className="space-y-2">
                  <Label htmlFor="experienceYears">Years of Experience</Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    min="0"
                    placeholder="Enter years of experience"
                    {...register("experienceYears", { valueAsNumber: true })}
                    className={errors.experienceYears ? "border-red-500" : ""}
                  />
                  {errors.experienceYears && (
                    <p className="text-sm text-red-600">
                      {errors.experienceYears.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Error Message */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
                {apiError}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : isProvider
                ? "Join as Professional"
                : "Create Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign in
            </Link>
          </div>

          {/* Switch signup type */}
          <div className="text-xs text-center text-gray-500">
            {isProvider ? (
              <span>
                Looking for services?{" "}
                <Link
                  href="/auth/signup?type=customer"
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Sign up as Customer
                </Link>
              </span>
            ) : (
              <span>
                Want to offer services?{" "}
                <Link
                  href="/auth/signup?type=provider"
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Join as Professional
                </Link>
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
