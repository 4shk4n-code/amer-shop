"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string | null;
    category?: { name: string } | null;
    unit?: string | null;
    stock: number;
  };
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function AddToCartButton({ product, size = "lg", className }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || undefined,
      category: product.category?.name,
      unit: product.unit || undefined,
      isRefurbished: false,
    });
  };

  return (
    <Button
      size={size}
      className={className}
      disabled={product.stock === 0}
      onClick={handleAddToCart}
    >
      <ShoppingCart className="h-5 w-5" />
      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
    </Button>
  );
}

