"use client";

import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
  unit?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  description,
  category,
  unit,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      name,
      price,
      image,
      category,
      unit,
      isRefurbished: false,
    });
  };

  return (
    <div className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/product/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <PlaceholderImage
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            placeholderText={name}
            placeholderWidth={400}
            placeholderHeight={400}
          />
        </div>
        <div className="p-4">
          {category && (
            <p className="text-xs text-muted-foreground uppercase mb-1">{category}</p>
          )}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{name}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">{formatPrice(price)}</span>
              {unit && (
                <span className="text-sm text-muted-foreground ml-1">/{unit}</span>
              )}
            </div>
            <Button size="sm" className="gap-2" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}

