import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: {
    default: "STS Enterprises | Premium Industrial Safety Equipment",
    template: "%s | STS Enterprises"
  },
  description: "Leading wholesale trader of industrial safety equipment including Safety Gloves, Hillson Gumboots, Body Protection, and Face Protection. Quality you can trust.",
  keywords: [
    "Safety Gloves",
    "Industrial Safety",
    "Hand Protection",
    "Body Protection",
    "Face Protection",
    "Hillson Gumboots",
    "Safety Equipment Wholesale",
    "STS Enterprises",
    "Workwear"
  ],
  authors: [{ name: "STS Enterprises" }],
  creator: "STS Enterprises",
  publisher: "STS Enterprises",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://stsenterprises.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "STS Enterprises | Premium Industrial Safety Equipment",
    description: "Your trusted partner for industrial safety gear. Explore our wide range of gloves, gumboots, and protective wear.",
    url: "https://stsenterprises.in",
    siteName: "STS Enterprises",
    images: [
      {
        url: "/og-image.jpg", // Ensure this exists in public/
        width: 1200,
        height: 630,
        alt: "STS Enterprises Safety Equipment",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STS Enterprises | Safety First",
    description: "Official distributor of top-tier industrial safety gear.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-gray-50`}>
        <Navbar />
        {children}
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
