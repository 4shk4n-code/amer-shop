"use client";

import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const featuredProducts = [
  {
    id: "tv-uhd-75",
    slug: "tv-uhd-75",
    name: "UHD 75\" TV",
    price: 1615,
    category: "Electronics",
    description: "Ultra HD 75 inch TV - Premium quality",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (4).jpeg",
  },
  {
    id: "featured-2",
    slug: "grass-thinkpar-gmc-50-mm",
    name: "GRASS THINKPAR GMC 50 MM",
    price: 23.08,
    category: "Home & Garden",
    description: "Premium artificial grass, 50mm thickness",
    unit: "PER SQM",
  },
  {
    id: "featured-3",
    slug: "brake-pad-segal-sp-bp-se-8860-8865",
    name: "Brake Pad Segal SP-BP-SE-8860/8865",
    price: 49,
    category: "Automotive",
    description: "(Front) Tucson & Sportage & Sonata",
    image: "/images/car-parts/WhatsApp Image 2025-12-09 at 4.41.54 PM (1).jpeg",
  },
  {
    id: "tv-uhd-55",
    slug: "tv-uhd-55",
    name: "UHD 55\" TV",
    price: 780,
    category: "Electronics",
    description: "Ultra HD 55 inch TV",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (9).jpeg",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground text-lg">Handpicked bestsellers for you</p>
          </div>
          <Link
            href="/category/electronics"
            className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}

