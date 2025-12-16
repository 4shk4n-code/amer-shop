"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Home, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderIdParam = searchParams.get("order_id");
    if (orderIdParam) {
      setOrderId(orderIdParam);
      // Clear cart on successful payment
      clearCart();
    }
    setLoading(false);
  }, [searchParams, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground text-lg">
              Thank you for your order
            </p>
          </div>

          {/* Order Details */}
          {orderId && (
            <div className="bg-card border rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Package className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Order Confirmed</h2>
              </div>
              <p className="text-muted-foreground mb-2">
                Your order ID: <span className="font-mono font-semibold">{orderId}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a confirmation email with your order details.
                You will receive another email when your order ships.
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-muted/50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold mb-4">What&apos;s Next?</h3>
            <ul className="text-left space-y-2 text-sm text-muted-foreground">
              <li>• You will receive an order confirmation email shortly</li>
              <li>• We&apos;ll notify you when your order is being prepared</li>
              <li>• You can track your order status in your account</li>
              <li>• Estimated delivery: 3-5 business days</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/products">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

