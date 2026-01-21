"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";

export default function ConditionalHeader() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <header>
      <Navigation />
    </header>
  );
}
