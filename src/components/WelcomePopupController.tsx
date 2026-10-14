
"use client";

import { usePathname } from "next/navigation";
import WelcomePopup from "@/components/WelcomePopup";

export default function WelcomePopupController() {
  const pathname = usePathname();

  if (pathname === "/virtual-tour") {
    return null;
  }

  return <WelcomePopup />;
}
