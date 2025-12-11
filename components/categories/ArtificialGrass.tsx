"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";

// Artificial Grass products with real data
const artificialGrassProducts = [
  {
    id: "grass-gfg-50",
    name: "GRASS GFG 50 MM",
    price: 13.65,
    category: "Artificial Grass",
    description: "Artificial grass, 50mm thickness",
    unit: "PER SQM",
  },
  {
    id: "grass-gfg-46",
    name: "GRASS GFG 46 MM",
    price: 12.68,
    category: "Artificial Grass",
    description: "Artificial grass, 46mm thickness",
    unit: "PER SQM",
  },
  {
    id: "grass-gfg-36",
    name: "GRASS GFG 36 MM",
    price: 10.4,
    category: "Artificial Grass",
    description: "Artificial grass, 36mm thickness",
    unit: "PER SQM",
  },
  {
    id: "grass-gfg-30",
    name: "GRASS GFG 30 MM",
    price: 10.21,
    category: "Artificial Grass",
    description: "Artificial grass, 30mm thickness",
    unit: "PER SQM",
  },
  {
    id: "grass-eco-33",
    name: "GRASS ECO 33 MM",
    price: 9.75,
    category: "Artificial Grass",
    description: "Eco-friendly artificial grass, 33mm thickness",
    unit: "PER SQM",
  },
  {
    id: "grass-eco-22",
    name: "GRASS ECO 22 MM",
    price: 9.23,
    category: "Artificial Grass",
    description: "Eco-friendly artificial grass, 22mm thickness",
    unit: "PER SQM",
  },
  {
    id: "grass-standard-26",
    name: "GRASS STANDARD 26 MM",
    price: 9.1,
    category: "Artificial Grass",
    description: "Standard artificial grass, 26mm thickness",
    unit: "PER SQM",
  },
  {
    id: "grass-rml-n3-46",
    name: "GRASS RML N3 46 MM",
    price: 11.31,
    category: "Artificial Grass",
    description: "RML N3 artificial grass, 46mm thickness",
    unit: "PER SQM",
  },
  {
    id: "grass-rml-n3-35",
    name: "GRASS RML N3 35 MM",
    price: 10.4,
    category: "Artificial Grass",
    description: "RML N3 artificial grass, 35mm thickness",
    unit: "PER SQM",
  },
  {
    id: "grass-rml-n3-30",
    name: "GRASS RML N3 30 MM",
    price: 9.82,
    category: "Artificial Grass",
    description: "RML N3 artificial grass, 30mm thickness",
    unit: "PER SQM",
  },
  {
    id: "grass-astroturfing-52",
    name: "GRASS ASTROTURFING 52 MM",
    price: 22.1,
    category: "Artificial Grass",
    description: "Astroturfing artificial grass, 52mm thickness",
    unit: "PER SQM",
  },
  {
    id: "grass-suitable-52",
    name: "GRASS SUITABLE 52 MM",
    price: 22.43,
    category: "Artificial Grass",
    description: "Suitable artificial grass, 52mm thickness",
    unit: "PER SQM",
  },
  {
    id: "grass-thinkpar-gmc-50",
    name: "GRASS THINKPAR GMC 50 MM",
    price: 23.08,
    category: "Artificial Grass",
    description: "Thinkpar GMC artificial grass, 50mm thickness",
    unit: "PER SQM",
  },
  {
    id: "grass-alex-mc3-50",
    name: "GRASS ALEX MC-3 50 MM",
    price: 22.43,
    category: "Artificial Grass",
    description: "Alex MC-3 artificial grass, 50mm thickness",
    unit: "PER SQM",
  },
  {
    id: "grass-coffee-ae001br-50",
    name: "GRASS COFFEE AE001BR 50 MM",
    price: 16.25,
    category: "Artificial Grass",
    description: "Coffee AE001BR artificial grass, 50mm thickness",
    unit: "PER SQM",
  },
];

export default function ArtificialGrass() {
  const pathname = usePathname();
  const isGrassPage = pathname === "/category/home-garden/artificial-grass";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Artificial Grass</h1>
        <p className="text-muted-foreground text-lg mb-6">
          High-quality synthetic turf and artificial grass products
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
        {artificialGrassProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

