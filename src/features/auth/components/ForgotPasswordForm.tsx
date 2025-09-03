"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/common";
import { useForgotPassword } from "../hooks/usePasswordReset";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const { loading, error, success, sendResetEmail } = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendResetEmail(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert
              type="success"
              message="Password reset email sent successfully! Please check your inbox."
              className="mb-4"
            />
          )}
          {error && <Alert type="error" message={error} className="mb-4" />}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Enter your email address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-600 text-gray-900 dark:bg-gray-700 dark:text-white"
                placeholder="you@email.com"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <a
            href="/auth/login"
            className="text-emerald-700 hover:underline text-sm dark:text-emerald-400"
          >
            Back to Login
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
