"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";

// TV products with real data from provided CSV
const tvProducts = [
  {
    id: "tv-fhd-32",
    name: "FHD 32\" TV",
    price: 270,
    category: "TV",
    description: "Full HD 32 inch TV",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (15).jpeg",
    tax: 5,
  },
  {
    id: "tv-fhd-43",
    name: "FHD 43\" TV",
    price: 408,
    category: "TV",
    description: "Full HD 43 inch TV",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (14).jpeg",
    tax: 5,
  },
  {
    id: "tv-fhd-50",
    name: "FHD 50\" TV",
    price: 628,
    category: "TV",
    description: "Full HD 50 inch TV",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (11).jpeg",
    tax: 5,
  },
  {
    id: "tv-uhd-55",
    name: "UHD 55\" TV",
    price: 780,
    category: "TV",
    description: "Ultra HD 55 inch TV",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (9).jpeg",
    tax: 5,
  },
  {
    id: "tv-uhd-70",
    name: "UHD 70\" TV",
    price: 1425,
    category: "TV",
    description: "Ultra HD 70 inch TV",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (6).jpeg",
    tax: 5,
  },
  {
    id: "tv-uhd-75",
    name: "UHD 75\" TV",
    price: 1615,
    category: "TV",
    description: "Ultra HD 75 inch TV",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (4).jpeg",
    tax: 5,
  },
];

export default function TV() {
  const pathname = usePathname();
  const isTVPage = pathname === "/category/electronics/tv";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">TV</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Latest TVs and Smart Displays
        </p>
        
        {/* Submenu */}
        <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
          <Link
            href="/category/electronics"
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors",
              !isTVPage && "bg-accent"
            )}
          >
            All Electronics
          </Link>
          <Link
            href="/category/electronics/tv"
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors",
              isTVPage && "bg-accent"
            )}
          >
            TV
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tvProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
