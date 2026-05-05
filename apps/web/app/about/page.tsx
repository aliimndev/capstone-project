import HeroSection from "@/components/about/HeroSection";
import FeaturesSection   from "@/components/about/FeaturesSection";
import WhyUseSection from "@/components/about/WhyUseSection";
import TeamSection from "@/components/about/TeamSection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-primary-black">
      <SiteHeader />
      <main>
        <HeroSection />
        <FeaturesSection/>
        <WhyUseSection />
        <TeamSection />

      </main>
      <SiteFooter />
    </div>
  );
}
