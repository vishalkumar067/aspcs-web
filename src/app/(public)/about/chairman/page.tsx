import type { Metadata } from "next";
import ChairmanPageClient from "./ChairmanPageClient";

export const metadata: Metadata = {
  title: "Leadership Messages — Chairman, Director & Principal | ASPCS Patna",
  description:
    "Read inspiring messages from ASPCS leadership — Chairman, Executive Chairman, Director, and Principal on education, vision, and the school's mission for 2026–27.",
};

export default function ChairmanPage() {
  return <ChairmanPageClient />;
}
