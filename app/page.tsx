import { FloatingParticles } from "@/components/layout/floating-particles";
import { SiteHeader } from "@/components/layout/site-header";
import { HeroSection } from "@/components/hero/hero-section";
import { PlayerHub } from "@/components/player/player-hub";
import { HowItWorks } from "@/components/challenge/how-it-works";
import { RankingTable } from "@/components/ranking/ranking-table";
import { SiteFooter } from "@/components/footer/site-footer";

export default function Home() {
  return (
    <>
      <FloatingParticles />
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <HeroSection />
          <PlayerHub />
          <HowItWorks />
          <RankingTable />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
