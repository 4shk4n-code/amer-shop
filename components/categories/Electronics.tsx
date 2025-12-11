"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";

const electronicsProducts = [
  {
    id: "elec-1",
    name: "Wireless Headphones",
    price: 99.99,
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  },
  {
    id: "elec-2",
    name: "Smart Watch",
    price: 249.99,
    category: "Electronics",
    description: "Feature-rich smartwatch with health tracking",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
  {
    id: "elec-3",
    name: "Laptop Stand",
    price: 49.99,
    category: "Electronics",
    description: "Ergonomic aluminum laptop stand",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
  },
  {
    id: "elec-4",
    name: "USB-C Hub",
    price: 39.99,
    category: "Electronics",
    description: "Multi-port USB-C hub with HDMI and USB 3.0",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop",
  },
  {
    id: "elec-5",
    name: "Wireless Mouse",
    price: 29.99,
    category: "Electronics",
    description: "Ergonomic wireless mouse with long battery life",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
  },
  {
    id: "elec-6",
    name: "Mechanical Keyboard",
    price: 129.99,
    category: "Electronics",
    description: "RGB mechanical keyboard with customizable keys",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
  },
];

export default function Electronics() {
  const pathname = usePathname();
  const isTVPage = pathname === "/category/electronics/tv";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Electronics</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Latest gadgets and tech products
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
        {electronicsProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

