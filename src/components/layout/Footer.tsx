import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/workzoneLogo-v2.PNG"
                alt="WorkZone Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-emerald-600">
                taskrabbit
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted platform for connecting with skilled professionals
              and getting things done.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/services/cleaning"
                  className="hover:text-emerald-600"
                >
                  Home Cleaning
                </Link>
              </li>
              <li>
                <Link
                  href="/services/handyman"
                  className="hover:text-emerald-600"
                >
                  Handyman Services
                </Link>
              </li>
              <li>
                <Link
                  href="/services/moving"
                  className="hover:text-emerald-600"
                >
                  Moving & Delivery
                </Link>
              </li>
              <li>
                <Link
                  href="/services/furniture"
                  className="hover:text-emerald-600"
                >
                  Furniture Assembly
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-emerald-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-emerald-600">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-emerald-600">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-emerald-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-emerald-600">
                  Safety
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-600">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 TaskRabbit. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/social/facebook"
              className="text-muted-foreground hover:text-emerald-600"
            >
              Facebook
            </Link>
            <Link
              href="/social/twitter"
              className="text-muted-foreground hover:text-emerald-600"
            >
              Twitter
            </Link>
            <Link
              href="/social/instagram"
              className="text-muted-foreground hover:text-emerald-600"
            >
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
