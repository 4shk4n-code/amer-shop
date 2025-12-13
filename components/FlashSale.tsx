"use client";

import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const flashSaleProducts = [
  {
    id: "tv-fhd-32",
    slug: "tv-fhd-32",
    name: "FHD 32\" TV",
    price: 270,
    originalPrice: 350,
    category: "Electronics",
    description: "Full HD 32 inch TV - Limited stock",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (15).jpeg",
  },
  {
    id: "flash-2",
    slug: "grass-eco-22-mm",
    name: "GRASS ECO 22 MM",
    price: 9.23,
    originalPrice: 12.5,
    category: "Home & Garden",
    description: "Eco-friendly artificial grass, 22mm thickness",
    unit: "PER SQM",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop",
  },
  {
    id: "flash-3",
    slug: "brake-pad-segal-sp-bp-se-8500",
    name: "Brake Pad Segal SP-BP-SE-8500",
    price: 29,
    originalPrice: 39,
    category: "Automotive",
    description: "(Rear) Pars & Samand LX & Renault Megane & Duster",
    image: "/images/car-parts/WhatsApp Image 2025-12-09 at 4.41.56 PM.jpeg",
  },
  {
    id: "tv-fhd-43",
    slug: "tv-fhd-43",
    name: "FHD 43\" TV",
    price: 408,
    originalPrice: 550,
    category: "Electronics",
    description: "Full HD 43 inch TV",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (14).jpeg",
  },
];

export default function FlashSale() {
  return (
    <section className="py-16 bg-destructive/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Badge variant="destructive" className="text-lg px-4 py-2">
            <Clock className="h-4 w-4 mr-2 inline" />
            Flash Sale
          </Badge>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Limited Time Deals</h2>
            <p className="text-muted-foreground">Hurry up! These deals won&apos;t last long</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashSaleProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              description={product.description}
              category={product.category}
              unit={product.unit}
              slug={product.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
