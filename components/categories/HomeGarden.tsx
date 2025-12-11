"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";

const homeGardenProducts = [
  {
    id: "home-1",
    slug: "garden-tools-set",
    name: "Garden Tools Set",
    price: 79.99,
    category: "Home & Garden",
    description: "Complete set of essential garden tools",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
  },
  {
    id: "home-2",
    slug: "indoor-plant-pot",
    name: "Indoor Plant Pot",
    price: 24.99,
    category: "Home & Garden",
    description: "Decorative ceramic plant pot for indoor plants",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
  },
  {
    id: "home-3",
    slug: "led-desk-lamp",
    name: "LED Desk Lamp",
    price: 34.99,
    category: "Home & Garden",
    description: "Adjustable LED desk lamp with touch control",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
  },
  {
    id: "home-4",
    slug: "throw-pillow-set",
    name: "Throw Pillow Set",
    price: 49.99,
    category: "Home & Garden",
    description: "Set of 4 decorative throw pillows",
    image: "https://images.unsplash.com/photo-1584100936596-ca65cf6b889b?w=400&h=400&fit=crop",
  },
  {
    id: "home-5",
    slug: "wall-clock",
    name: "Wall Clock",
    price: 39.99,
    category: "Home & Garden",
    description: "Modern minimalist wall clock",
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=400&fit=crop",
  },
  {
    id: "home-6",
    slug: "storage-basket",
    name: "Storage Basket",
    price: 19.99,
    category: "Home & Garden",
    description: "Woven storage basket for organization",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
  },
];

export default function HomeGarden() {
  const pathname = usePathname();
  const isGrassPage = pathname === "/category/home-garden/artificial-grass";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Home & Garden</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Everything for your home
        </p>
        
        {/* Submenu */}
        <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
          <Link
            href="/category/home-garden"
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors",
              !isGrassPage && "bg-accent"
            )}
          >
            All Home & Garden
          </Link>
          <Link
            href="/category/home-garden/artificial-grass"
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors",
              isGrassPage && "bg-accent"
            )}
          >
            Artificial Grass
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeGardenProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

