import type { Metadata } from "next";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amertrading.shop';

export const metadata: Metadata = {
  title: "Sale - Special Deals & Discounts",
  description: "Find amazing deals and discounts at AMERSHOP! Sale section. Limited time offers on Electronics, Fashion, Home & Garden, Sports, Automotive, and Toys. Shop now and save!",
  keywords: ["sale", "discounts", "deals", "special offers", "online shopping", "AMERSHOP!"],
  openGraph: {
    title: "Sale - Special Deals & Discounts | AMERSHOP!",
    description: "Find amazing deals and discounts at AMERSHOP! Sale section.",
    url: `${baseUrl}/sale`,
    type: "website",
  },
  alternates: {
    canonical: `${baseUrl}/sale`,
  },
};

// Force dynamic rendering to avoid build-time database connection issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SalePage() {
  // Get products with originalPrice (on sale)
  let saleProducts = [];
  
  if (!prisma) {
    console.warn('Prisma client not available on sale page');
  } else {
    try {
      saleProducts = await prisma.product.findMany({
        where: {
          isActive: true,
          originalPrice: {
            not: null,
          },
        },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
      });
    } catch (error) {
      console.error('Error fetching sale products:', error);
      // Continue with empty array if database query fails
      saleProducts = [];
    }
  }

  // Structured Data for Sale Products
  const saleListSchema = saleProducts.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Sale Products",
    "description": "Special deals and discounts at AMERSHOP!",
    "itemListElement": saleProducts.map((product: typeof saleProducts[0], index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "url": `${baseUrl}/product/${product.slug}`,
        "image": product.image ? `${baseUrl}${product.image}` : undefined,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "AED",
          "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          ...(product.originalPrice && product.originalPrice > product.price && {
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "referenceQuantity": {
                "@type": "QuantitativeValue",
                "value": product.originalPrice,
              },
            },
          }),
        },
      },
    })),
  } : null;

  return (
    <>
      {/* Structured Data */}
      {saleListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(saleListSchema) }}
        />
      )}
      
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Sale</h1>
            <p className="text-muted-foreground">
              Find amazing deals on our sale items
            </p>
          </header>

          {saleProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No sale items available at the moment.
              </p>
            </div>
          ) : (
            <section aria-label="Sale products" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {saleProducts.map((product: typeof saleProducts[0]) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice || undefined}
                image={product.image || undefined}
                description={product.description || undefined}
                category={product.category.name}
                unit={product.unit || undefined}
                slug={product.slug}
              />
            ))}
            </section>
          )}
        </div>
        <footer className="border-t mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-muted-foreground">
              <p>&copy; 2024 AMERSHOP!. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

