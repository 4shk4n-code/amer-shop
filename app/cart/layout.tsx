import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amertrading.shop';

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your shopping cart items at AMERSHOP!",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

