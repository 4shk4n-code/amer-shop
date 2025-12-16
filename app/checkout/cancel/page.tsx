"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";

function CheckoutCancelContent() {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Read from URL directly to avoid hydration issues
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setOrderId(params.get("order_id"));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Cancel Icon */}
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-12 w-12 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
            <p className="text-muted-foreground text-lg">
              Your payment was cancelled
            </p>
          </div>

          {/* Message */}
          <div className="bg-card border rounded-lg p-6 mb-8">
            <p className="text-muted-foreground mb-4">
              You cancelled the payment process. No charges were made to your account.
            </p>
            {orderId && (
              <p className="text-sm text-muted-foreground">
                Order ID: <span className="font-mono">{orderId}</span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/cart">
                <ShoppingCart className="h-4 w-4" />
                Return to Cart
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/products">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return <CheckoutCancelContent />;
}

