"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import GuestNavbar from "./guestNavbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Ensure this only renders on the client to avoid hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted on client
  if (!mounted) {
    return null;
  }

  // Show navbar only on homepage, remove from all other pages including dashboard/auth
  const showNavbar = pathname === "/";

  return showNavbar ? <GuestNavbar /> : null;
}
