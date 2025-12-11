"use client";

import { useCart } from "@/contexts/CartContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { formatPrice } from "@/lib/currency";
import {
  X,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, isOpen, setIsOpen } = useCart();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-card border-l shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            {cart.itemCount > 0 && (
              <Badge variant="secondary">{cart.itemCount}</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">
                Add some products to get started
              </p>
              <Button onClick={() => setIsOpen(false)} asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 border rounded-lg bg-background"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    <PlaceholderImage
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      placeholderText={item.name}
                      placeholderWidth={80}
                      placeholderHeight={80}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium text-sm line-clamp-2 flex-1">
                        {item.name}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>

                    {/* Refurbished Badge */}
                    {item.isRefurbished && (
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Refurbished
                        </Badge>
                        {item.condition && (
                          <Badge variant="outline" className="text-xs">
                            {item.condition}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Price */}
                    <div className="mb-2">
                      {item.isRefurbished && item.originalPrice && (
                        <div className="text-xs text-muted-foreground line-through">
                          {formatPrice(item.originalPrice)}
                        </div>
                      )}
                      <div className="font-semibold text-sm">
                        {formatPrice(item.price)}
                        {item.unit && (
                          <span className="text-xs text-muted-foreground ml-1">
                            /{item.unit}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const qty = parseInt(e.target.value) || 1;
                          updateQuantity(item.id, qty);
                        }}
                        className="w-16 h-7 text-center text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Item Total */}
                    <div className="text-xs text-muted-foreground mt-1">
                      Subtotal: {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t p-4 space-y-4 bg-background">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items:</span>
                <span className="font-medium">{cart.itemCount}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">{formatPrice(cart.total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  // TODO: Navigate to checkout page
                  alert("Checkout functionality coming soon!");
                }}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

