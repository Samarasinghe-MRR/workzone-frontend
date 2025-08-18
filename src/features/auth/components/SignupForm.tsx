// "use client";

// import { useState } from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useSignup } from "../hooks/useSignup";
// import { SignupFormValues } from "../schema/signupSchema";

// export default function SignupForm() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useSignup();

//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   const onSubmit = async (data: SignupFormValues) => {
//     setLoading(true);
//     setApiError(null);
//     setSuccess(null);
//     try {
//       const response = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setApiError(errorData.message || "Signup failed");
//         setLoading(false);
//         return;
//       }

//       setSuccess("Signup successful! You can now log in.");
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (error) {
//       setApiError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // <form
//     //   onSubmit={handleSubmit(onSubmit)}
//     //   className="space-y-6 max-w-sm mx-auto p-8 rounded-lg shadow bg-emerald-50"
//     // >
//     //   <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Sign Up</h2>
//     //   {apiError && <p className="text-red-600 text-center font-medium">{apiError}</p>}
//     //   {success && <p className="text-green-700 text-center font-medium">{success}</p>}
//     //   {/* <div>
//     //     <label className="block mb-1 text-gray-900 font-medium">Name</label>
//     //     <input
//     //       type="text"
//     //       {...register("name")}
//     //       className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 bg-white"
//     //     />
//     //     {errors.name && (
//     //       <p className="text-red-600 mt-1 text-sm">{errors.name.message}</p>
//     //     )}
//     //   </div> */}
//     //   <div>
//     //     <label className="block mb-1 text-gray-900 font-medium">Email</label>
//     //     <input
//     //       type="email"
//     //       {...register("email")}
//     //       className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 bg-white"
//     //     />
//     //     {errors.email && (
//     //       <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>
//     //     )}
//     //   </div>
//     //   <div>
//     //     <label className="block mb-1 text-gray-900 font-medium">Password</label>
//     //     <input
//     //       type="password"
//     //       {...register("password")}
//     //       className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 bg-white"
//     //     />
//     //     {errors.password && (
//     //       <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>
//     //     )}
//     //   </div>
//     //   <div>
//     //     <label className="block mb-1 text-gray-900 font-medium">Confirm Password</label>
//     //     <input
//     //       type="password"
//     //       {...register("confirmPassword")}
//     //       className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 bg-white"
//     //     />
//     //     {errors.confirmPassword && (
//     //       <p className="text-red-600 mt-1 text-sm">{errors.confirmPassword.message}</p>
//     //     )}
//     //   </div>
//     //   <button
//     //     type="submit"
//     //     disabled={loading}
//     //     className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-60"
//     //   >
//     //     {loading ? "Signing up..." : "Sign Up"}
//     //   </button>
//     // </form>
//     // <form
//     //   onSubmit={handleSubmit(onSubmit)}
//     //   className="space-y-6 max-w-md mx-auto p-10 rounded-xl shadow-md bg-white dark:bg-gray-900"
//     // >
//     //   <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
//     //     Create an Account
//     //   </h2>
//     //   {apiError && (
//     //     <p className="text-red-600 text-center font-medium">{apiError}</p>
//     //   )}
//     //   {success && (
//     //     <p className="text-green-700 text-center font-medium">{success}</p>
//     //   )}

//     //   {/* Email field example with spacing and accessibility */}
//     //   <div className="space-y-2">
//     //     <label
//     //       htmlFor="email"
//     //       className="block text-sm font-medium text-gray-700 dark:text-gray-200"
//     //     >
//     //       Email
//     //     </label>
//     //     <input
//     //       id="email"
//     //       type="email"
//     //       {...register("email")}
//     //       className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-600 focus:border-emerald-600 text-gray-900 bg-white dark:bg-gray-800 dark:text-white"
//     //     />
//     //     {errors.email && (
//     //       <p className="text-sm text-red-600">{errors.email.message}</p>
//     //     )}
//     //   </div>

//     //   {/* Repeat similarly for password fields */}

//     //   <button
//     //     type="submit"
//     //     disabled={loading}
//     //     className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
//     //   >
//     //     {loading ? "Signing up..." : "Sign Up"}
//     //   </button>

//     //   <p className="text-sm text-center text-gray-600 dark:text-gray-400">
//     //     Already have an account?{" "}
//     //     <a
//     //       href="/login"
//     //       className="text-emerald-700 hover:underline dark:text-emerald-400"
//     //     >
//     //       Log in
//     //     </a>
//     //   </p>
//     // </form>
//     // <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50 dark:bg-gray-900">
//     //   {/* Left section (branding / hero) */}
//     //   <div className="hidden md:flex flex-col justify-center items-center bg-emerald-600 text-white p-10">
//     //     <h2 className="text-4xl font-bold mb-4">Welcome to WorkZone</h2>
//     //     <p className="text-lg text-center max-w-xs">
//     //       Connect with trusted professionals for any job, any time.
//     //     </p>
//     //     {/* You could place an SVG or image here */}
//     //   </div>

//     //   {/* Right section (form) */}
//     //   <div className="flex justify-center items-center p-6">
//     //     <form
//     //       onSubmit={handleSubmit(onSubmit)}
//     //       className="space-y-6 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl px-10 py-8"
//     //     >
//     //       <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
//     //         Create an Account
//     //       </h2>

//     //       {apiError && (
//     //         <p className="text-red-600 text-center font-medium">{apiError}</p>
//     //       )}
//     //       {success && (
//     //         <p className="text-green-600 text-center font-medium">{success}</p>
//     //       )}

//     //       {/* Email */}
//     //       <div className="space-y-2">
//     //         <label
//     //           htmlFor="email"
//     //           className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//     //         >
//     //           Email
//     //         </label>
//     //         <input
//     //           id="email"
//     //           type="email"
//     //           aria-invalid={!!errors.email}
//     //           aria-describedby="email-error"
//     //           {...register("email")}
//     //           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 dark:bg-gray-700 dark:text-white"
//     //         />
//     //         {errors.email && (
//     //           <p id="email-error" className="text-sm text-red-600">
//     //             {errors.email.message}
//     //           </p>
//     //         )}
//     //       </div>

//     //       {/* Password */}
//     //       <div className="space-y-2">
//     //         <label
//     //           htmlFor="password"
//     //           className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//     //         >
//     //           Password
//     //         </label>
//     //         <input
//     //           id="password"
//     //           type="password"
//     //           {...register("password")}
//     //           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 dark:bg-gray-700 dark:text-white"
//     //         />
//     //         {errors.password && (
//     //           <p className="text-sm text-red-600">{errors.password.message}</p>
//     //         )}
//     //       </div>

//     //       {/* Confirm Password */}
//     //       <div className="space-y-2">
//     //         <label
//     //           htmlFor="confirmPassword"
//     //           className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//     //         >
//     //           Confirm Password
//     //         </label>
//     //         <input
//     //           id="confirmPassword"
//     //           type="password"
//     //           {...register("confirmPassword")}
//     //           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 dark:bg-gray-700 dark:text-white"
//     //         />
//     //         {errors.confirmPassword && (
//     //           <p className="text-sm text-red-600">
//     //             {errors.confirmPassword.message}
//     //           </p>
//     //         )}
//     //       </div>

//     //       {/* Submit Button */}
//     //       <button
//     //         type="submit"
//     //         disabled={loading}
//     //         className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
//     //       >
//     //         {loading ? "Signing up..." : "Sign Up"}
//     //       </button>

//     //       {/* Redirect */}
//     //       <p className="text-sm text-center text-gray-600 dark:text-gray-400">
//     //         Already have an account?{" "}
//     //         <a
//     //           href="/auth/login"
//     //           className="text-emerald-700 hover:underline dark:text-emerald-400"
//     //         >
//     //           Log in
//     //         </a>
//     //       </p>
//     //     </form>
//     //   </div>
//     // </div>
//     <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50 dark:bg-gray-900">
//       {/* Left section (branding / hero) */}
//       <div className="hidden md:flex flex-col justify-center items-center bg-emerald-600 text-white p-10">
//         <h2 className="text-4xl font-bold mb-4">Welcome to WorkZone</h2>
//         <p className="text-lg text-center max-w-xs">
//           Connect with trusted professionals for any job, any time.
//         </p>
//       </div>

//       {/* Right section (form) */}
//       <div className="flex justify-center items-center p-6">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle className="text-center">Create an Account</CardTitle>
//           </CardHeader>

//           <CardContent>
//             {apiError && (
//               <p className="text-red-600 text-center font-medium">{apiError}</p>
//             )}
//             {success && (
//               <p className="text-green-600 text-center font-medium">
//                 {success}
//               </p>
//             )}

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               {/* Email */}
//               <div className="space-y-2">
//                 <label htmlFor="email" className="block text-sm font-medium">
//                   Email
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   {...register("email")}
//                   aria-invalid={!!errors.email}
//                   aria-describedby="email-error"
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 dark:bg-gray-700 dark:text-white"
//                 />
//                 {errors.email && (
//                   <p id="email-error" className="text-sm text-red-600">
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>

//               {/* Password */}
//               <div className="space-y-2">
//                 <label htmlFor="password" className="block text-sm font-medium">
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   type="password"
//                   {...register("password")}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 dark:bg-gray-700 dark:text-white"
//                 />
//                 {errors.password && (
//                   <p className="text-sm text-red-600">
//                     {errors.password.message}
//                   </p>
//                 )}
//               </div>

//               {/* Confirm Password */}
//               <div className="space-y-2">
//                 <label
//                   htmlFor="confirmPassword"
//                   className="block text-sm font-medium"
//                 >
//                   Confirm Password
//                 </label>
//                 <input
//                   id="confirmPassword"
//                   type="password"
//                   {...register("confirmPassword")}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 dark:bg-gray-700 dark:text-white"
//                 />
//                 {errors.confirmPassword && (
//                   <p className="text-sm text-red-600">
//                     {errors.confirmPassword.message}
//                   </p>
//                 )}
//               </div>

//               {/* Submit Button */}
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-emerald-600 hover:bg-emerald-700"
//               >
//                 {loading ? "Signing up..." : "Sign Up"}
//               </Button>
//             </form>
//           </CardContent>

//           <CardFooter className="flex justify-center">
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               Already have an account?{" "}
//               <a
//                 href="/auth/login"
//                 className="text-emerald-700 hover:underline dark:text-emerald-400"
//               >
//                 Log in
//               </a>
//             </p>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSignup } from "../hooks/useSignup";
import { SignupFormValues } from "../schema/signupSchema";

// shadcn carousel
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// autoplay plugin
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { FcGoogle } from "react-icons/fc";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useSignup();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // autoplay ref (5 seconds delay)
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setApiError(null);
    setSuccess(null);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setApiError(errorData.message || "Signup failed");
        setLoading(false);
        return;
      }

      setSuccess("Signup successful! You can now log in.");
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    // Example: http://localhost:3001/auth/google
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50 dark:bg-gray-900">
      {/* Left section (sliding carousel) */}
      <div className="hidden md:flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <Carousel plugins={[autoplay.current]} className="w-full h-full">
          <CarouselContent>
            {[
              "/carousal/slide1.jpg",
              "/carousal/slide2.jpg",
              "/carousal/slide3.jpg",
            ].map((src, idx) => (
              <CarouselItem
                key={idx}
                className="flex items-center justify-center"
              >
                <Image
                  src={src}
                  alt={`Slide ${idx + 1}`}
                  width={700}
                  height={700}
                  className="w-full h-screen object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Right section (form card) */}
      <div className="flex justify-center items-center p-6">
        <Card className="w-full max-w-md shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Create an Account
            </CardTitle>
          </CardHeader>

          <CardContent>
            {apiError && (
              <p className="text-red-600 text-center font-medium">{apiError}</p>
            )}
            {success && (
              <p className="text-green-600 text-center font-medium">
                {success}
              </p>
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
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-600 text-gray-900 dark:bg-gray-700 dark:text-white"
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-600">
                    {errors.email.message}
                  </p>
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-600 text-gray-900 dark:bg-gray-700 dark:text-white"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>

              <Button
                onClick={handleGoogleSignup}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <FcGoogle className="text-xl" /> Sign up with Google
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-emerald-700 hover:underline dark:text-emerald-400"
              >
                Log in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
