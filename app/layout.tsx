import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { CartProvider } from "@/contexts/CartContext";
import "./suppress-warnings";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AMERSHOP! - Modern Multi-Category Store",
  description: "Your one-stop shop for all your needs",
  icons: {
    icon: "/images/logo/amerlogo.png",
    shortcut: "/images/logo/amerlogo.png",
    apple: "/images/logo/amerlogo.png",
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
        <SessionProvider>
          <CartProvider>{children}</CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
