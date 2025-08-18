"use client";

import { usePathname } from "next/navigation";
import GuestNavbar from "./guestNavbar";
import AuthenticatedNavbar from "./authenticatedNavbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Check if user is on account pages or other authenticated routes
  const isAuthenticated =
    pathname.startsWith("/account") ||
    pathname.startsWith("/my-tasks") ||
    pathname.startsWith("/book-task");

  return isAuthenticated ? <AuthenticatedNavbar /> : <GuestNavbar />;
}
