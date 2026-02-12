import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import ProductShowcase from "@/components/home/ProductShowcase";
import BrandScroller from "@/components/home/BrandScroller";
import AboutSection from "@/components/home/AboutSection";
import Counter from "@/components/ui/Counter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | STS Enterprises - Industrial Safety Solutions",
  description: "Discover premium safety equipment at STS Enterprises. We specialize in hand protection, safety shoes, and industrial workwear. Contact us for bulk orders.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "STS Enterprises",
  "url": "https://stsenterprises.co.in",
  "logo": "https://stsenterprises.co.in/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9876543210", // Replace with real number from env/config if possible, or placeholder
    "contactType": "sales",
    "areaServed": "IN",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://facebook.com/stsenterprises",
    "https://instagram.com/stsenterprises"
  ]
};
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />


      {/* Brand Scroller (Trusted Distributions) */}
      <BrandScroller />
      {/* About Section */}
      <AboutSection />

      <CategorySection />
      <ProductShowcase />
    </main>
  );
}
