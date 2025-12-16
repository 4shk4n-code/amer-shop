import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - Secure Payment",
  description: "Complete your order securely with Telr payment gateway",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

