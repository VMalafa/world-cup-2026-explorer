import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { ProfileProvider } from "@/components/Profiles";
import { ProfileGate } from "@/components/ProfileGate";
import { FeedbackButton } from "@/components/FeedbackButton";

const display = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "World Cup Explorer ⚽ | A learning adventure for kids",
  description:
    "A playful World Cup 2026 learning explorer for young children — maps, countries, match-day stories and fun facts.",
  applicationName: "World Cup Explorer",
};

export const viewport: Viewport = {
  themeColor: "#234c9e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {/* The Malafa signature: four homelands pinned to the top of every page. */}
        <div className="unity-ribbon-top" aria-hidden />
        <ProfileProvider>
          <ProfileGate>{children}</ProfileGate>
          <FeedbackButton />
        </ProfileProvider>
      </body>
    </html>
  );
}
