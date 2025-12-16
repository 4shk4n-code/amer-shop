import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amertrading.shop';

export const metadata: Metadata = {
  title: "Refurbished Products - Quality Pre-Owned Items",
  description: "Shop quality refurbished products at AMERSHOP! - Professionally tested, cleaned, and warrantied. Save money on Electronics, Fashion, Home & Garden, Sports, Automotive, and Toys. All items come with warranty.",
  keywords: ["refurbished", "pre-owned", "used products", "refurbished electronics", "warranty", "AMERSHOP!", "save money"],
  openGraph: {
    title: "Refurbished Products - Quality Pre-Owned Items | AMERSHOP!",
    description: "Shop quality refurbished products at AMERSHOP! - Professionally tested, cleaned, and warrantied. Save money on quality products.",
    url: `${baseUrl}/refurbished`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refurbished Products - Quality Pre-Owned Items | AMERSHOP!",
    description: "Shop quality refurbished products at AMERSHOP! - Save money on quality products with warranty.",
  },
  alternates: {
    canonical: `${baseUrl}/refurbished`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RefurbishedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

