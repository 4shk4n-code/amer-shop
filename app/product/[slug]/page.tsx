import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { formatPrice } from "@/lib/utils";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  const images = product.images ? JSON.parse(product.images) : [];
  const allImages = product.image ? [product.image, ...images] : images;

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <PlaceholderImage
                src={product.image || allImages[0]}
                alt={product.name}
                fill
                className="object-cover"
                placeholderText={product.name}
                placeholderWidth={800}
                placeholderHeight={800}
              />
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.slice(1, 5).map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-square bg-muted rounded overflow-hidden"
                  >
                    <PlaceholderImage
                      src={img}
                      alt={`${product.name} ${idx + 2}`}
                      fill
                      className="object-cover"
                      placeholderText={product.name}
                      placeholderWidth={200}
                      placeholderHeight={200}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {product.category && (
              <p className="text-sm text-muted-foreground uppercase">
                {product.category.name}
              </p>
            )}
            <h1 className="text-4xl font-bold">{product.name}</h1>
            {product.description && (
              <p className="text-lg text-muted-foreground">
                {product.description}
              </p>
            )}

            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-2xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.unit && (
                <span className="text-lg text-muted-foreground">/{product.unit}</span>
              )}
            </div>

            {product.isRefurbished && product.condition && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Condition:</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {product.condition}
                </span>
              </div>
            )}

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Stock: {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
              </span>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1 gap-2" disabled={product.stock === 0}>
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            {product.tax && product.tax > 0 && (
              <p className="text-sm text-muted-foreground">
                * Tax included: {formatPrice(product.tax)}
              </p>
            )}
          </div>
        </div>
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

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
    take: 100, // Limit for static generation
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

