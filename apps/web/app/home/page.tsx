import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ReadyToExplore } from "@/components/home/ReadyToExplore";
import { TrendingMovies } from "@/components/home/TrendingMovies";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#000000]">
      <SiteHeader />
      <main>
        <HeroSection />
        <TrendingMovies />
        <HowItWorks />
        <ReadyToExplore />
      </main>
      <SiteFooter />
    </div>
  );
}
