"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { loginSchema, LoginFormValues } from "../schema/loginSchema";
import { authService } from "../services/authService";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setApiError(null);

    try {
      console.log("Form data being submitted:", data); // Debug log
      const response = await authService.login(data);

      if (response.success && response.data) {
        // Redirect based on user role
        const userRole = response.data.role;

        switch (userRole) {
          case "admin":
            router.push("/dashboard/admin");
            break;
          case "customer":
            router.push("/dashboard/customer");
            break;
          case "provider":
            router.push("/dashboard/provider");
            break;
          default:
            router.push("/dashboard/customer"); // Default fallback
        }
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Sign in to your WorkZone account
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="/auth/forgotPassword"
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                Forgot password?
              </Link>
            </div>

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
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign up
            </Link>
          </div>

          {/* Quick signup links */}
          <div className="flex justify-center space-x-4 text-xs text-gray-500">
            <Link
              href="/auth/signup?type=customer"
              className="hover:text-emerald-600"
            >
              Customer Signup
            </Link>
            <span>|</span>
            <Link
              href="/auth/signup?type=provider"
              className="hover:text-emerald-600"
            >
              Provider Signup
            </Link>
          </div>

          {/* Admin Note */}
          <div className="text-xs text-center text-gray-500 mt-4 pt-4 border-t">
            <p>
              <strong>Admin Access:</strong> Admin accounts are created
              manually. Contact system administrator for admin credentials.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
