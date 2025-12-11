"use client";

import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const newArrivals = [
  {
    id: "new-1",
    name: "UHD 70\" TV",
    price: 1425,
    category: "Electronics",
    description: "Ultra HD 70 inch TV - Latest model",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (6).jpeg",
  },
  {
    id: "new-2",
    name: "GRASS ALEX MC-3 50 MM",
    price: 22.43,
    category: "Home & Garden",
    description: "Alex MC-3 artificial grass, 50mm thickness",
    unit: "PER SQM",
  },
  {
    id: "new-3",
    name: "Brake Pad Segal SP-BP-SE-6800",
    price: 38,
    category: "Automotive",
    description: "(Rear) 206, 207",
    image: "/images/car-parts/WhatsApp Image 2025-12-09 at 4.41.54 PM (1).jpeg",
  },
  {
    id: "new-4",
    name: "FHD 50\" TV",
    price: 628,
    category: "Electronics",
    description: "Full HD 50 inch TV",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (11).jpeg",
  },
];

export default function NewArrivals() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">New Arrivals</h2>
              <p className="text-muted-foreground text-lg">Fresh products just added</p>
            </div>
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
          {newArrivals.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}

