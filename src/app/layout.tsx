import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "Vantage - Growth Analytics & Velocity Engine",
  description:
    "Analyze website performance, calculate ROI impact, and track conversions. Built with Next.js 16, React 19, and Framer Motion.",
  keywords: [
    "web performance",
    "page speed",
    "core web vitals",
    "LCP",
    "CLS",
    "FID",
    "ROI calculator",
    "analytics",
    "growth",
    "velocity",
  ],
  authors: [{ name: "Vantage Team" }],
  openGraph: {
    title: "Vantage - Growth Analytics & Velocity Engine",
    description:
      "Analyze website performance, calculate ROI impact, and track conversions.",
    type: "website",
    locale: "en_US",
    siteName: "Vantage",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vantage - Growth Analytics & Velocity Engine",
    description:
      "Analyze website performance, calculate ROI impact, and track conversions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b] text-zinc-100`}
      >
        {children}
      </body>
    </html>
  );
}
