import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category: typeof categories[0]) => (
          <div
            key={category.id}
            className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
            {category.description && (
              <p className="text-sm text-muted-foreground mb-3">
                {category.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {category._count.products} products
              </span>
              <Link href={`/category/${category.slug}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No categories found.</p>
        </div>
      )}
    </div>
  );
}

