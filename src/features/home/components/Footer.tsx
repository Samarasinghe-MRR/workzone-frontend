"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <h3 className="text-xl font-bold text-white">WorkZone</h3>
        <nav className="flex gap-6 text-sm">
          <a href="#" className="hover:text-emerald-400">
            Home
          </a>
          <a href="#" className="hover:text-emerald-400">
            Services
          </a>
          <a href="#" className="hover:text-emerald-400">
            About
          </a>
          <a href="#" className="hover:text-emerald-400">
            Contact
          </a>
        </nav>
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} WorkZone. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
