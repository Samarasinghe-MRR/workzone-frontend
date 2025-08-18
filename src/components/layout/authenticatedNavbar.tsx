"use client";

import Link from "next/link";
import Image from "next/image";

export default function AuthenticatedNavbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/workzoneLogo-v2.PNG"
                alt="TaskRabbit Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-emerald-600">
                taskrabbit
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              href="/book-task"
              className="text-gray-700 hover:text-emerald-600 font-medium"
            >
              Book a Task
            </Link>
            <Link
              href="/my-tasks"
              className="text-gray-700 hover:text-emerald-600 font-medium"
            >
              My Tasks
            </Link>
            <Link
              href="/account"
              className="text-gray-700 hover:text-emerald-600 font-medium"
            >
              Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
