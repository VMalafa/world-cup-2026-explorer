import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { ReadingLevelProvider } from "@/components/ReadingLevel";

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
  themeColor: "#38bdf8",
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
        <ReadingLevelProvider>{children}</ReadingLevelProvider>
      </body>
    </html>
  );
}
