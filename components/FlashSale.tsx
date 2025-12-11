"use client";

import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Clock } from "lucide-react";
import { formatPrice } from "@/lib/currency";

const flashSaleProducts = [
  {
    id: "tv-fhd-32",
    name: "FHD 32\" TV",
    price: 270,
    originalPrice: 350,
    category: "Electronics",
    description: "Full HD 32 inch TV - Limited stock",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (15).jpeg",
  },
  {
    id: "flash-2",
    name: "GRASS ECO 22 MM",
    price: 9.23,
    originalPrice: 12.5,
    category: "Home & Garden",
    description: "Eco-friendly artificial grass, 22mm thickness",
    unit: "PER SQM",
  },
  {
    id: "flash-3",
    name: "Brake Pad Segal SP-BP-SE-8500",
    price: 29,
    originalPrice: 39,
    category: "Automotive",
    description: "(Rear) Pars & Samand LX & Renault Megane & Duster",
    image: "/images/car-parts/WhatsApp Image 2025-12-09 at 4.41.56 PM.jpeg",
  },
  {
    id: "tv-fhd-43",
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
          {flashSaleProducts.map((product) => {
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;
            return (
              <div key={product.id} className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                <Link href={`/product/${product.id}`}>
                  {discount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute top-2 right-2 z-10 text-sm font-bold"
                    >
                      -{discount}%
                    </Badge>
                  )}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <PlaceholderImage
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      placeholderText={product.name}
                      placeholderWidth={400}
                      placeholderHeight={400}
                    />
                  </div>
                  <div className="p-4">
                    {product.category && (
                      <p className="text-xs text-muted-foreground uppercase mb-1">{product.category}</p>
                    )}
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                        {product.unit && (
                          <span className="text-sm text-muted-foreground ml-1">/{product.unit}</span>
                        )}
                      </div>
                    </div>
                    <Button size="sm" className="w-full gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
