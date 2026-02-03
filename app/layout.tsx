import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HideUnicornAttribution from "@/components/HideUnicornAttribution";
import UnicornBackground from "@/components/UnicornBackground";
import IntroScreen from "@/components/IntroScreen";
import PlusGrid from "@/components/PlusGrid";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Werobot",
  description: "Werobot 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: "#e3f2fd" }}>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `html,body{background-color:#e3f2fd!important}`
        }} />
      </head>
      <body
        className={`${inter.variable} antialiased`}
        style={{ backgroundColor: "#e3f2fd", fontFamily: "var(--font-inter)" }}
      >
        <IntroScreen />
        <UnicornBackground />
        <PlusGrid />
        <HideUnicornAttribution />
        {children}
      </body>
    </html>
  );
}
