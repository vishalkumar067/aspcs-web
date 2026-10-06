import type { Metadata } from "next";
import VirtualTourPageClient from "./VirtualTourPageClient";

export const metadata: Metadata = {
  title: "Virtual Campus Tour",
  description:
    "Explore Acharya Shree Sudarshan Patna Central School virtually through an immersive interactive campus tour.",
};

export default function VirtualTourPage() {
  return <VirtualTourPageClient />;
}
