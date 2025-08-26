"use client";

import { usePathname } from "next/navigation";
import GuestNavbar from "./guestNavbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Show navbar only on homepage, remove from all other pages including dashboard/auth
  const showNavbar = pathname === "/";

  return showNavbar ? <GuestNavbar /> : null;
}
