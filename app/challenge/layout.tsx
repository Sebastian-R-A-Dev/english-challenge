import { ChallengeAuthGate } from "@/components/auth/challenge-auth-gate";
import { SiteFooter } from "@/components/footer/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function ChallengeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />
        <ChallengeAuthGate>{children}</ChallengeAuthGate>
        <SiteFooter />
      </div>
    </>
  );
}
