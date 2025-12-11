"use client";

import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { formatPrice } from "@/lib/currency";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  RefreshCw,
  ArrowLeft,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
                <p className="text-muted-foreground">
                  {cart.itemCount === 0
                    ? "Your cart is empty"
                    : `${cart.itemCount} ${cart.itemCount === 1 ? "item" : "items"} in your cart`}
                </p>
              </div>
              {cart.items.length > 0 && (
                <Button variant="outline" onClick={clearCart}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              )}
            </div>
          </div>

          {cart.items.length === 0 ? (
            /* Empty Cart State */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingCart className="h-24 w-24 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Looks like you haven&apos;t added anything to your cart yet. Start shopping to fill it up!
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/refurbished">View Refurbished</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                        <PlaceholderImage
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          placeholderText={item.name}
                          placeholderWidth={128}
                          placeholderHeight={128}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                            {item.category && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {item.category}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-5 w-5 text-destructive" />
                          </Button>
                        </div>

                        {/* Refurbished Badges */}
                        {item.isRefurbished && (
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="bg-purple-600/10 text-purple-600 border-purple-600">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Refurbished
                            </Badge>
                            {item.condition && (
                              <Badge variant="outline">{item.condition}</Badge>
                            )}
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(item.originalPrice)}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Price */}
                        <div className="mb-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-primary">
                              {formatPrice(item.price)}
                            </span>
                            {item.unit && (
                              <span className="text-sm text-muted-foreground">/{item.unit}</span>
                            )}
                          </div>
                          {item.isRefurbished && item.originalPrice && (
                            <p className="text-xs text-green-600 mt-1">
                              You saved {formatPrice(item.originalPrice - item.price)} on this item
                            </p>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const qty = parseInt(e.target.value) || 1;
                                updateQuantity(item.id, qty);
                              }}
                              className="w-20 h-9 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="ml-auto">
                            <span className="text-sm text-muted-foreground">Subtotal:</span>
                            <span className="text-lg font-bold ml-2">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card border rounded-lg p-6 sticky top-4">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  {/* Summary Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items ({cart.itemCount}):</span>
                      <span className="font-medium">{formatPrice(cart.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping:</span>
                      <span className="font-medium">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax:</span>
                      <span className="font-medium">Calculated at checkout</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(cart.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="space-y-3 mb-6 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <RefreshCw className="h-4 w-4 text-blue-600" />
                      <span>Easy returns</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ShoppingCart className="h-4 w-4 text-purple-600" />
                      <span>Free shipping on orders over $100</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full mb-4"
                    size="lg"
                    onClick={() => {
                      // TODO: Navigate to checkout page
                      alert("Checkout functionality coming soon!");
                    }}
                  >
                    Proceed to Checkout
                  </Button>

                  {/* Continue Shopping */}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

