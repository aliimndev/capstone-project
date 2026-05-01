import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function RecommendPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#ffffff]">
      <SiteHeader />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>Rekomendasi Film</h1>
      </main>
      <SiteFooter />
    </div>
  );
}
