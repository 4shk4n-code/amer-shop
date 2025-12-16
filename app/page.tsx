import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Header from "@/components/Header";
import CategoryGrid from "@/components/CategoryGrid";
import SpecialOffers from "@/components/SpecialOffers";
import FeaturedProducts from "@/components/FeaturedProducts";
import FlashSale from "@/components/FlashSale";
import NewArrivals from "@/components/NewArrivals";
import PromoBanner from "@/components/PromoBanner";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amertrading.shop';

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to AMERSHOP! - Your one-stop destination for Electronics, Fashion, Home & Garden, Sports, Automotive, and Toys. Shop the latest products with best prices and fast shipping.",
  openGraph: {
    title: "AMERSHOP! - Modern Multi-Category Online Store",
    description: "Shop the latest products at AMERSHOP! - Your trusted online store for Electronics, Fashion, Home & Garden, Sports, Automotive, and Toys.",
    url: baseUrl,
    type: "website",
  },
  alternates: {
    canonical: baseUrl,
  },
};

// Dynamically import BannerSlider to avoid webpack issues
const BannerSlider = dynamic(() => import("@/components/BannerSlider"), {
  ssr: true,
});

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AMERSHOP!",
    "url": baseUrl,
    "logo": `${baseUrl}/images/logo/amerlogo.png`,
    "description": "Modern multi-category online store offering Electronics, Fashion, Home & Garden, Sports, Automotive, and Toys",
    "sameAs": [
      // Add social media links when available
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "info@amertrading.ae",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AMERSHOP!",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="sr-only">AMERSHOP! - Modern Multi-Category Online Store</h1>
          <BannerSlider />
        </div>
        <PromoBanner />
        <SpecialOffers />
        <FlashSale />
        <FeaturedProducts />
        <NewArrivals />
        <CategoryGrid />
      </main>
    </>
  );
}

