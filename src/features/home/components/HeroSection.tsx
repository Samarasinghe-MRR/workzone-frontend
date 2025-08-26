"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  const handleGetStarted = () => {
    // Redirect customers to create account (signup as customer)
    router.push("/auth/signup?type=customer");
  };

  const handleBecomeProvider = () => {
    // Redirect to provider signup
    router.push("/auth/signup?type=provider");
  };

  return (
    <section className="relative bg-emerald-600 text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Find Trusted Professionals Near You
        </motion.h1>
        <p className="max-w-2xl mx-auto text-lg mb-8 text-emerald-50">
          From electricians to cleaners, WorkZone connects you with verified
          laborers to get the job done right.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            className="bg-white text-emerald-600 font-semibold hover:bg-emerald-50"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-emerald-600"
            onClick={handleBecomeProvider}
          >
            Become a Provider
          </Button>
        </div>
      </div>
    </section>
  );
}
