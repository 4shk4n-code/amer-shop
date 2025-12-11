"use client";

import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  description?: string;
  category?: string;
  unit?: string;
  slug?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  description,
  category,
  unit,
  slug,
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

  // Use slug if available, otherwise use id (product page handles both)
  const productLink = slug || id;
  
  // Calculate discount percentage if originalPrice exists
  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <Link href={`/product/${productLink}`} className="flex flex-col flex-1">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {discount > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-2 right-2 z-10 text-sm font-bold"
            >
              -{discount}%
            </Badge>
          )}
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
        <div className="p-4 flex flex-col flex-1">
          {category && (
            <p className="text-xs text-muted-foreground uppercase mb-1">{category}</p>
          )}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">{name}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-shrink-0">{description}</p>
          )}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">{formatPrice(price)}</span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                  {unit && (
                    <span className="text-sm text-muted-foreground">/{unit}</span>
                  )}
                </div>
              </div>
            </div>
            <Button 
              size="sm" 
              className="w-full gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}

