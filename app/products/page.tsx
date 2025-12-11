import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

// Force dynamic rendering since products can be added/updated
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching for real-time product updates

export default async function ProductsPage() {
  // Get all active products
  const products = await prisma.product.findMany({
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

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">
            Browse our complete collection of products
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No products available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          </div>
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
  );
}

