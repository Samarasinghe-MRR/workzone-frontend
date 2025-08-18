"use client";

import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Nuwan Perera",
    feedback:
      "WorkZone made it so easy to find a reliable electrician. Highly recommended!",
  },
  {
    name: "Sajani Fernando",
    feedback:
      "Great service and verified providers. I felt safe and taken care of.",
  },
  {
    name: "Amal Jayasinghe",
    feedback: "Fast, professional, and affordable. Will definitely use again.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">What Our Customers Say</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="rounded-2xl shadow-md p-6">
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                  “{t.feedback}”
                </p>
                <h4 className="font-semibold">{t.name}</h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
