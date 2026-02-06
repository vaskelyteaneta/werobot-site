import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HideUnicornAttribution from "@/components/HideUnicornAttribution";
import UnicornBackground from "@/components/UnicornBackground";
import IntroScreen from "@/components/IntroScreen";
import PlusGrid from "@/components/PlusGrid";
import Footer from "@/components/Footer";

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
    <html lang="en" style={{ backgroundColor: "#D1E4F6" }}>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `html,body{background-color:#D1E4F6!important}`
        }} />
      </head>
      <body
        className={`${inter.variable} antialiased`}
        style={{ 
          backgroundColor: "#D1E4F6", 
          fontFamily: "var(--font-inter)",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh"
        }}
      >
        <IntroScreen />
        <UnicornBackground />
        <PlusGrid />
        <HideUnicornAttribution />
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
