"use client";

import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="bg-emerald-600 text-white py-16">
      <div className="container mx-auto px-6 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Get Started?
        </h2>
        <p className="mb-8 max-w-xl text-emerald-50">
          Join thousands of customers and professionals using WorkZone today.
        </p>
        <Button
          size="lg"
          className="bg-white text-emerald-600 font-semibold hover:bg-gray-100"
        >
          Sign Up Now
        </Button>
      </div>
    </section>
  );
}
