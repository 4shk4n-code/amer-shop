"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, ShoppingCart, CreditCard } from "lucide-react";
import Link from "next/link";

export default function CheckoutDeclinedPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Declined Icon */}
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Declined</h1>
            <p className="text-muted-foreground text-lg">
              Your payment could not be processed
            </p>
          </div>

          {/* Message */}
          <div className="bg-card border rounded-lg p-6 mb-8">
            <p className="text-muted-foreground mb-4">
              Unfortunately, your payment was declined. This could be due to:
            </p>
            <ul className="text-left space-y-2 text-sm text-muted-foreground mb-4">
              <li>• Insufficient funds in your account</li>
              <li>• Incorrect card details</li>
              <li>• Card expired or blocked</li>
              <li>• Bank security restrictions</li>
            </ul>
            {orderId && (
              <p className="text-sm text-muted-foreground mt-4">
                Order ID: <span className="font-mono">{orderId}</span>
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-4">
              Please try again with a different payment method or contact your bank.
            </p>
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
              <Link href="/checkout">
                <CreditCard className="h-4 w-4" />
                Try Again
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

