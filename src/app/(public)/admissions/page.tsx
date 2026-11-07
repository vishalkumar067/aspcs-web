import type { Metadata } from "next";
import AdmissionsHero        from "@/components/sections/admissions/AdmissionsHero";
import AdmissionsProcess     from "@/components/sections/admissions/AdmissionsProcess";
import AdmissionsEligibility from "@/components/sections/admissions/AdmissionsEligibility";
import AdmissionsForm        from "@/components/sections/admissions/AdmissionsForm";
import AdmissionsFAQ         from "@/components/sections/admissions/AdmissionsFAQ";
import CTASection            from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Admissions 2027–28 | Nursery to Class IX",
  description:
    "Admissions open at ASPCS for Academic Session 2027–28 from Nursery to Class IX. Explore Day Boarding, Week Boarding and Term Boarding.",
  keywords: ["ASPCS admissions", "school admission 2027", "apply online", "school enrollment"],
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
