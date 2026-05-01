import { HeroSection } from "@/components/home/HeroSection";
import { TrendingMovies } from "@/components/home/TrendingMovies";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ReadyToExplore } from "@/components/home/ReadyToExplore";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function Home() {
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
