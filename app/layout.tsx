import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/components/ui/toast";
import { CartToastConnector } from "@/components/CartToastConnector";
import SuppressWarnings from "./suppress-warnings";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amertrading.shop';

export const metadata: Metadata = {
  title: {
    default: "AMERSHOP! - Modern Multi-Category Online Store | Electronics, Fashion, Home & Garden",
    template: "%s | AMERSHOP!",
  },
  description: "Shop the latest products at AMERSHOP! - Your trusted online store for Electronics, Fashion, Home & Garden, Sports, Automotive, and Toys. Best prices, fast shipping, and quality guaranteed.",
  keywords: ["online store", "ecommerce", "electronics", "fashion", "home & garden", "sports", "automotive", "toys", "shopping", "amertrading"],
  authors: [{ name: "AMERSHOP!" }],
  creator: "AMERSHOP!",
  publisher: "AMERSHOP!",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "AMERSHOP!",
    title: "AMERSHOP! - Modern Multi-Category Online Store",
    description: "Shop the latest products at AMERSHOP! - Your trusted online store for Electronics, Fashion, Home & Garden, Sports, Automotive, and Toys.",
    images: [
      {
        url: `${baseUrl}/images/logo/amerlogo.png`,
        width: 1200,
        height: 630,
        alt: "AMERSHOP! Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AMERSHOP! - Modern Multi-Category Online Store",
    description: "Shop the latest products at AMERSHOP! - Your trusted online store.",
    images: [`${baseUrl}/images/logo/amerlogo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/images/logo/amerlogo.png",
    shortcut: "/images/logo/amerlogo.png",
    apple: "/images/logo/amerlogo.png",
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SuppressWarnings />
        <SessionProvider>
          <ToastProvider>
            <CartProvider>
              <CartToastConnector />
              <div className="flex flex-col min-h-screen">
                {children}
                <Footer />
              </div>
            </CartProvider>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
