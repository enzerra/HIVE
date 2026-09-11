import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { CommunityBackground } from "@/components/community-background";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "HIVE — Your people. Your perspective.",
  description:
    "Temukan komunitasmu, bentuk Squad, dan bawa sudut pandangmu ke Arena.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body>
        <CommunityBackground />
        <Providers>
          <a href="#main-content" className="skip-link">
            Lewati ke konten
          </a>
          {children}
        </Providers>
      </body>
    </html>
  );
}
