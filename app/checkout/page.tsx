"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/currency";
import {
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    firstName: session?.user?.name?.split(" ")[0] || "",
    lastName: session?.user?.name?.split(" ").slice(1).join(" ") || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "UAE",
  });

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "UAE",
  });

  // Calculate totals
  const subtotal = cart.total;
  const shipping = subtotal > 100 ? 0 : 20; // Free shipping over 100 AED
  const tax = subtotal * 0.05; // 5% VAT in UAE
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (cart.itemCount === 0) {
      router.push("/cart");
    }
  }, [cart.itemCount, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: "shipping" | "billing"
  ) => {
    const { name, value } = e.target;
    if (section === "shipping") {
      setShippingInfo((prev) => ({ ...prev, [name]: value }));
    } else {
      setBillingInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate required fields
      if (
        !shippingInfo.firstName ||
        !shippingInfo.lastName ||
        !shippingInfo.email ||
        !shippingInfo.phone ||
        !shippingInfo.address ||
        !shippingInfo.city
      ) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Create order and get payment link
      const response = await fetch("/api/checkout/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.items,
          shippingInfo,
          billingInfo: billingSameAsShipping ? shippingInfo : billingInfo,
          subtotal,
          shipping,
          tax,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment");
      }

      // Redirect to Telr payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (cart.itemCount === 0) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Link>
            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
            <p className="text-muted-foreground">
              Complete your order securely with Telr
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <section className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Shipping Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      required
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      required
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        required
                        className="pl-10"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        required
                        className="pl-10"
                        placeholder="+971 50 123 4567"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="address"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      required
                      placeholder="Street address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="city"
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      required
                      placeholder="Dubai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Emirate/State
                    </label>
                    <Input
                      name="state"
                      value={shippingInfo.state}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      placeholder="Dubai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      ZIP Code
                    </label>
                    <Input
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      placeholder="00000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Country
                    </label>
                    <Input
                      name="country"
                      value={shippingInfo.country}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      disabled
                    />
                  </div>
                </div>
              </section>

              {/* Billing Information */}
              <section className="bg-card border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold">Billing Information</h2>
                  </div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={billingSameAsShipping}
                      onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                      className="rounded"
                    />
                    Same as shipping
                  </label>
                </div>
                {!billingSameAsShipping && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="firstName"
                        value={billingInfo.firstName}
                        onChange={(e) => handleInputChange(e, "billing")}
                        required={!billingSameAsShipping}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="lastName"
                        value={billingInfo.lastName}
                        onChange={(e) => handleInputChange(e, "billing")}
                        required={!billingSameAsShipping}
                        placeholder="Doe"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={billingInfo.email}
                        onChange={(e) => handleInputChange(e, "billing")}
                        required={!billingSameAsShipping}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="address"
                        value={billingInfo.address}
                        onChange={(e) => handleInputChange(e, "billing")}
                        required={!billingSameAsShipping}
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <Input
                        name="city"
                        value={billingInfo.city}
                        onChange={(e) => handleInputChange(e, "billing")}
                        placeholder="Dubai"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Country</label>
                      <Input
                        name="country"
                        value={billingInfo.country}
                        onChange={(e) => handleInputChange(e, "billing")}
                        disabled
                      />
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border rounded-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground text-xs">
                          Qty: {item.quantity}
                          {item.unit && ` • ${item.unit}`}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t pt-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span className="font-medium">
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (VAT 5%):</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 p-3 bg-muted/50 rounded">
                  <Lock className="h-4 w-4" />
                  <span>Secure payment powered by Telr</span>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full mb-4"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Payment
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  You will be redirected to Telr&apos;s secure payment page
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

