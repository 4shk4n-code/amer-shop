import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export default async function SalePage() {
  // Get products with originalPrice (on sale)
  const saleProducts = await prisma.product.findMany({
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

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Sale</h1>
          <p className="text-muted-foreground">
            Find amazing deals on our sale items
          </p>
        </div>

        {saleProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No sale items available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {saleProducts.map((product) => {
              const discount =
                product.originalPrice && product.originalPrice > product.price
                  ? Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )
                  : 0;

              return (
                <div key={product.id} className="relative">
                  {discount > 0 && (
                    <div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      -{discount}%
                    </div>
                  )}
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image || undefined}
                    description={product.description || undefined}
                    category={product.category.name}
                    unit={product.unit || undefined}
                  />
                </div>
              );
            })}
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

