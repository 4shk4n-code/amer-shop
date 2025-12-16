import type { Metadata } from "next";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amertrading.shop';

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our complete collection of products at AMERSHOP! - Find Electronics, Fashion, Home & Garden, Sports, Automotive, and Toys all in one place. Quality products at competitive prices.",
  keywords: ["products", "online shopping", "electronics", "fashion", "home & garden", "sports", "automotive", "toys"],
  openGraph: {
    title: "All Products - AMERSHOP!",
    description: "Browse our complete collection of products at AMERSHOP!",
    url: `${baseUrl}/products`,
    type: "website",
  },
  alternates: {
    canonical: `${baseUrl}/products`,
  },
};

// Force dynamic rendering since products can be added/updated
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching for real-time product updates

export default async function ProductsPage() {
  // Check if prisma is available
  if (!prisma) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Database connection unavailable. Please check your configuration.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Get all active products
  let products = [];
  try {
    products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error('[Products Page] Error fetching products:', error);
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Database Error</h1>
            <p className="text-muted-foreground text-lg">
              Unable to load products. Please check your database connection.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Structured Data for Product Collection
  const productListSchema = products.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.map((product: typeof products[0], index: number) => ({
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
          "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
      },
    })),
  } : null;

  return (
    <>
      {/* Structured Data */}
      {productListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema) }}
        />
      )}
      
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">All Products</h1>
            <p className="text-muted-foreground">
              Browse our complete collection of products
            </p>
          </header>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No products available at the moment.
              </p>
            </div>
          ) : (
            <section aria-label="Product listings" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: typeof products[0]) => (
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

