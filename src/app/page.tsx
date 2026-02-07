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
  "url": "https://stsenterprises.in",
  "logo": "https://stsenterprises.in/logo.png",
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
export default function Home() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Stats Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition">
            <Counter value={30} label="+" />
            <p className="text-slate-400 mt-2 font-medium">Years Experience</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition">
            <Counter value={500} label="+" />
            <p className="text-slate-400 mt-2 font-medium">Products</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition">
            <Counter value={90} label="+" />
            <p className="text-slate-400 mt-2 font-medium">Happy Clients</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition">
            <Counter value={100} label="%" />
            <p className="text-slate-400 mt-2 font-medium">Quality Assured</p>
          </div>
        </div>
      </section>

      <CategorySection />
      <ProductShowcase />
      <BrandScroller />
    </main>
  );
}
