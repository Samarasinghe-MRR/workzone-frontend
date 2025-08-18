"use client";

import { Wrench, Paintbrush, Hammer, Plug } from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Plumbing",
    desc: "Fix leaks, install taps, and more.",
  },
  {
    icon: Plug,
    title: "Electrical",
    desc: "Wiring, repairs, and installations.",
  },
  {
    icon: Paintbrush,
    title: "Painting",
    desc: "Interior and exterior painting.",
  },
  { icon: Hammer, title: "Carpentry", desc: "Custom furniture and repairs." },
];

export default function ServicesSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition"
            >
              <service.icon className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
              <h3 className="font-semibold text-xl mb-2">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
