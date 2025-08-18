// "use client";

// import { useState } from "react";
// import { useLogin } from "../hooks/useLogin";
// import { LoginFormValues } from "../schema/loginSchema";

// export default function LoginForm() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useLogin()

//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState<string | null>(null);

//   const onSubmit = async (data: LoginFormValues) => {
//     setLoading(true);
//     setApiError(null);
//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setApiError(errorData.message || "Login failed");
//         setLoading(false);
//         return;
//       }

//       // Success: handle login (save token, redirect, etc.)
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       const result = await response.json();
//       // Example: localStorage.setItem("token", result.token);
//       alert("Login successful!");
//       // Redirect or update UI as needed
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (error) {
//       setApiError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="space-y-6 max-w-sm mx-auto p-8 rounded-lg shadow bg-emerald-50"
//     >
//       <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Login</h2>
//       {apiError && (
//         <p className="text-red-600 text-center font-medium">{apiError}</p>
//       )}
//       <div>
//         <label className="block mb-1 text-gray-900 font-medium">Email</label>
//         <input
//           type="email"
//           {...register("email")}
//           className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 bg-white"
//         />
//         {errors.email && (
//           <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>
//         )}
//       </div>
//       <div>
//         <label className="block mb-1 text-gray-900 font-medium">Password</label>
//         <input
//           type="password"
//           {...register("password")}
//           className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 bg-white"
//         />
//         {errors.password && (
//           <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>
//         )}
//       </div>
//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-60"
//       >
//         {loading ? "Logging in..." : "Login"}
//       </button>
//     </form>
//   );
// }

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useLogin } from "../hooks/useLogin";
import { LoginFormValues } from "../schema/loginSchema";

// shadcn/ui components
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// carousel
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { FcGoogle } from "react-icons/fc";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useLogin();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setApiError(errorData.message || "Login failed");
        setLoading(false);
        return;
      }

      await response.json();
      alert("Login successful!");
      // e.g. localStorage.setItem("token", result.token);
      // redirect as needed
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    // Example: http://localhost:3001/auth/google
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50 dark:bg-gray-900">
      {/* Left carousel */}
      <div className="hidden md:flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <Carousel plugins={[autoplay.current]} className="w-full h-full">
          <CarouselContent>
            {[
              "/carousal/slide1.webp",
              "/carousal/slide2.webp",
              "/carousal/slide3.webp",
            ].map((src, idx) => (
              <CarouselItem
                key={idx}
                className="flex items-center justify-center"
              >
                <Image
                  src={src}
                  alt={`Slide ${idx + 1}`}
                  width={1920}
                  height={1280}
                  className="w-full h-screen object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Right login card */}
      <div className="flex justify-center items-center p-6">
        <Card className="w-full max-w-md shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Login
            </CardTitle>
          </CardHeader>

          <CardContent>
            {apiError && (
              <p className="text-red-600 text-center font-medium">{apiError}</p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-600 text-gray-900 dark:bg-gray-700 dark:text-white"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-600 text-gray-900 dark:bg-gray-700 dark:text-white"
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Button
                onClick={handleGoogleLogin}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <FcGoogle className="text-xl" /> Continue with Google
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don’t have an account?{" "}
              <a
                href="/auth/signup"
                className="text-emerald-700 hover:underline dark:text-emerald-400"
              >
                Sign up
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
