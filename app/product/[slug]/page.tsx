import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Truck, Shield, CheckCircle, Star, Calendar, Tag } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { formatPrice } from "@/lib/currency";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

// Force dynamic rendering since products can be added/updated
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Try to find by slug first, then by id as fallback
  let product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
    },
  });

  // If not found by slug, try by id (for hardcoded product IDs like "featured-1")
  if (!product) {
    product = await prisma.product.findUnique({
      where: { id: params.slug },
      include: {
        category: true,
      },
    });
  }

  if (!product) {
    notFound();
  }

  const images = product.images ? JSON.parse(product.images) : [];
  const allImages = product.image ? [product.image, ...images] : images;
  
  // Calculate discount percentage
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Get related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    take: 4,
    include: {
      category: true,
    },
  });

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/category/${product.category.slug}`} className="hover:text-foreground">
                {product.category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border border-border">
              {discount > 0 && (
                <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  -{discount}% OFF
                </div>
              )}
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
                    className="relative aspect-square bg-muted rounded overflow-hidden border border-border cursor-pointer hover:border-primary transition-colors"
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
              <Link href={`/category/${product.category.slug}`}>
                <p className="text-sm text-primary hover:underline uppercase font-medium">
                  {product.category.name}
                </p>
              </Link>
            )}
            
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span>Product ID:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs">{product.id}</code>
              </p>
            </div>

            {/* Price Section */}
            <div className="border-b pb-4">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-2xl text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>
              {product.unit && (
                <p className="text-sm text-muted-foreground">Price per {product.unit}</p>
              )}
              {product.tax && product.tax > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  * Tax included: {formatPrice(product.tax)}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className={`p-4 rounded-lg border ${product.stock > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      In Stock ({product.stock} available)
                    </span>
                  </>
                ) : (
                  <>
                    <Package className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-800">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Condition Badge (if refurbished) */}
            {product.isRefurbished && product.condition && (
              <div className="flex items-center gap-2 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
                <div>
                  <span className="text-sm font-medium text-purple-800">Refurbished Product</span>
                  <p className="text-xs text-purple-600">Condition: <span className="capitalize font-semibold">{product.condition}</span></p>
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="flex gap-4 pt-4">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  category: product.category,
                  unit: product.unit,
                  stock: product.stock,
                }}
                size="lg"
                className="flex-1 gap-2"
              />
            </div>

            {/* Features/Info Icons */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Easy Returns</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="mt-12 border-t pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Information */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Product Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Product ID</span>
                  <span className="font-medium">{product.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Category</span>
                  <Link href={`/category/${product.category?.slug}`} className="font-medium text-primary hover:underline">
                    {product.category?.name}
                  </Link>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Stock Status</span>
                  <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                {product.unit && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Unit</span>
                    <span className="font-medium">{product.unit}</span>
                  </div>
                )}
                {product.isRefurbished && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Product Type</span>
                    <span className="font-medium">Refurbished</span>
                  </div>
                )}
                {product.condition && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Condition</span>
                    <span className="font-medium capitalize">{product.condition}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Added</span>
                  <span className="font-medium">
                    {new Date(product.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping & Returns */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Shipping & Returns</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Shipping Information
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Free shipping on orders over 100 AED</li>
                    <li>• Standard delivery: 3-5 business days</li>
                    <li>• Express delivery available</li>
                    <li>• Track your order online</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Returns & Exchanges
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• 30-day return policy</li>
                    <li>• Items must be in original condition</li>
                    <li>• Free returns for defective items</li>
                    <li>• Refund processed within 5-7 days</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: typeof relatedProducts[0]) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.slug}`}
                  className="group"
                >
                  <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors">
                    <div className="relative aspect-square bg-muted">
                      <PlaceholderImage
                        src={relatedProduct.image || undefined}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        placeholderText={relatedProduct.name}
                        placeholderWidth={400}
                        placeholderHeight={400}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(relatedProduct.price)}
                        {relatedProduct.unit && (
                          <span className="text-sm text-muted-foreground">/{relatedProduct.unit}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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

// Removed generateStaticParams - using dynamic rendering instead
// This allows products to be added/updated without rebuilding

