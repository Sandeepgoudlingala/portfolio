import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. About / Manifesto & Marquee */}
      <AboutSection />

      {/* 3. Selected Work */}
      <WorkSection />

      {/* 4. Skills */}
      <SkillsSection />

      {/* 5. Contact & 6. Footer (Halftone) */}
      <ContactSection />
    </>
  );
}
