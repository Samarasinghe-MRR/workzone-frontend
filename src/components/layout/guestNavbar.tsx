// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";

// export default function Navbar() {
//   return (
//     <nav className="w-full flex items-center justify-between px-8 py-4 bg-white shadow">
//       <Link href="/" className="text-3xl font-bold text-primary">
//         {/* WorkZone */}
//         <Image src="/workzoneLogo-v2.png" alt="WorkZone Logo" width={128} height={128} />
//       </Link>
//       <div className="flex gap-4">
//         <Link href="/providers">Services</Link>
//         {/* <Link href="/jobs">SignUp/Login</Link> */}
//         <Link href="/profile">Become a Professional</Link>
//         <Button asChild>
//           <Link href="/login">Login</Link>
//         </Button>
//       </div>
//     </nav>
//   );
// }
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";

// export default function Navbar() {
//   return (
//     <nav className="w-full flex items-center justify-between px-12 py-6 bg-white shadow">
//       <Link href="/" className="text-3xl font-extrabold text-primary flex items-center gap-3">
//         <Image src="/workzoneLogo-v2.png" alt="WorkZone Logo" width={128} height={128} />
//         {/* WorkZone */}
//       </Link>
//       <div className="flex gap-6">
//         <Link href="/providers" className="text-2xl text-gray-700 hover:text-primary hover:underline font-extrabold">
//           Services
//         </Link>
//         <Link href="/profile" className="text-2xl text-gray-700 hover:text-primary hover:underline font-extrabold">
//           Become a Professional
//         </Link>
//         <Button asChild>
//           <Link href="/login" className="text-2xl">Login</Link>
//         </Button>
//       </div>
//     </nav>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/providers", label: "Services" },
    // Updated to redirect to provider signup instead of profile
    { href: "/auth/signup?type=provider", label: "Become a Professional" },
  ];

  return (
    <nav className="w-full flex items-center justify-between px-8 md:px-12 py-4 bg-white shadow-md sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/workzoneLogo-v2.png"
          alt="WorkZone Logo"
          width={56}
          height={56}
        />
        <span className="text-2xl font-extrabold text-emerald-700">
          WorkZone
        </span>
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-lg font-semibold transition ${
              pathname === link.href
                ? "text-emerald-700 underline"
                : "text-gray-700 hover:text-emerald-700"
            }`}
          >
            {link.label}
          </Link>
        ))}

        <Button
          asChild
          className="bg-emerald-600 hover:bg-emerald-700 text-lg px-5"
        >
          <Link href="/auth/login">Login</Link>
        </Button>
      </div>
    </nav>
  );
}
