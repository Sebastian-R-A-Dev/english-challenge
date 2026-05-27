import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const rajdhani = Rajdhani({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "English Challenge | Competitive English Gaming",
  description:
    "Futuristic English skill arena — climb the leaderboard, chase tiers, and prove you are the ultimate master.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${rajdhani.variable} ${orbitron.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-slate-950 font-sans text-slate-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
