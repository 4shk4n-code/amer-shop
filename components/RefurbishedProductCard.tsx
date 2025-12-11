"use client";

import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Shield, TrendingDown } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { RefurbishedProduct } from "@/lib/types/refurbished";
import { calculateSavings, calculateSavingsPercentage } from "@/lib/refurbished";
import { useCart } from "@/contexts/CartContext";

interface RefurbishedProductCardProps {
  product: RefurbishedProduct;
}

const conditionLabels: Record<RefurbishedProduct["condition"], string> = {
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  satisfactory: "Satisfactory",
};

const conditionColors: Record<RefurbishedProduct["condition"], string> = {
  excellent: "bg-green-500/10 text-green-600 border-green-500",
  good: "bg-blue-500/10 text-blue-600 border-blue-500",
  fair: "bg-yellow-500/10 text-yellow-600 border-yellow-500",
  satisfactory: "bg-orange-500/10 text-orange-600 border-orange-500",
};

export default function RefurbishedProductCard({ product }: RefurbishedProductCardProps) {
  const { addToCart } = useCart();
  const savings = calculateSavings(product.originalPrice, product.refurbishedPrice);
  const savingsPercentage = calculateSavingsPercentage(product.originalPrice, product.refurbishedPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.refurbishedPrice,
      image: product.image,
      category: product.category,
      unit: product.unit,
      isRefurbished: true,
      originalPrice: product.originalPrice,
      condition: conditionLabels[product.condition],
    });
  };

  return (
    <div className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Refurbished Badge */}
      <div className="absolute top-2 left-2 z-10">
        <Badge className="bg-purple-600 text-white border-0">
          <TrendingDown className="h-3 w-3 mr-1" />
          Refurbished
        </Badge>
      </div>

      {/* Condition Badge */}
      <div className="absolute top-2 right-2 z-10">
        <Badge
          variant="outline"
          className={conditionColors[product.condition]}
        >
          {conditionLabels[product.condition]}
        </Badge>
      </div>

      <Link href={`/refurbished/${product.id}`}>
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

          {/* Price Section */}
          <div className="mb-3 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500">
                Save {savingsPercentage}%
              </Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.refurbishedPrice)}
              </span>
              {product.unit && (
                <span className="text-sm text-muted-foreground">/{product.unit}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              You save {formatPrice(savings)}
            </p>
          </div>

          {/* Warranty Info */}
          {product.warranty && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
              <Shield className="h-3 w-3" />
              <span>{product.warranty} warranty</span>
            </div>
          )}

          {/* Stock Info */}
          {product.stock !== undefined && (
            <div className="text-xs text-muted-foreground mb-3">
              {product.stock > 0 ? (
                <span className="text-green-600">In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          )}

          <Button
            size="sm"
            className="w-full gap-2"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </Link>
    </div>
  );
}

