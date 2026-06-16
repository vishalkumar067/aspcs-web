import type { Metadata } from "next";
import HeroSection           from "@/components/sections/HeroSection";
import StatsSection          from "@/components/sections/StatsSection";
import AboutSection          from "@/components/sections/AboutSection";
import ProgramsSection       from "@/components/sections/ProgramsSection";
import NoticesSection        from "@/components/sections/NoticesSection";
import GallerySection        from "@/components/sections/GallerySection";
import CareersSection        from "@/components/sections/CareersSection";
import TCVerificationSection from "@/components/sections/TCVerificationSection";
import TestimonialsSection   from "@/components/sections/TestimonialsSection";
import CTASection            from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Acharya Shree Sudarshan Patna Central School — Session 2026–27",
  description:
    "ASPCS is a forward-thinking educational institution providing world-class education with a focus on creativity, technology, and holistic development. Admissions open for 2026–27.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ProgramsSection />
      <NoticesSection />
      <GallerySection />
      <CareersSection />
      <TCVerificationSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
