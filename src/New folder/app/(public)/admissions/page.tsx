import type { Metadata } from "next";
import AdmissionsHero        from "@/components/sections/admissions/AdmissionsHero";
import AdmissionsProcess     from "@/components/sections/admissions/AdmissionsProcess";
import AdmissionsEligibility from "@/components/sections/admissions/AdmissionsEligibility";
import AdmissionsForm        from "@/components/sections/admissions/AdmissionsForm";
import AdmissionsFAQ         from "@/components/sections/admissions/AdmissionsFAQ";
import CTASection            from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Admissions 2025–26",
  description:
    "Apply for admission at ASPCS for session 2025–26. Simple 4-step process, limited seats available across Nursery to Class X. Apply online now.",
  keywords: ["ASPCS admissions", "school admission 2025", "apply online", "school enrollment"],
};

export default function AdmissionsPage() {
  return (
    <>
      <AdmissionsHero />
      <AdmissionsProcess />
      <AdmissionsEligibility />
      <AdmissionsForm />
      <AdmissionsFAQ />
      <CTASection />
    </>
  );
}
