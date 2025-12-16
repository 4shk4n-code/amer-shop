import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Truck, Shield, CheckCircle, Star, Calendar, Tag } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { formatPrice } from "@/lib/currency";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amertrading.shop';

// Force dynamic rendering since products can be added/updated
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for product pages
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  if (!prisma) {
    return {
      title: "Product Not Found",
    };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: { category: true },
    });

    if (!product) {
      return {
        title: "Product Not Found",
      };
    }

    const productUrl = `${baseUrl}/product/${product.slug}`;
    const productImage = product.image ? `${baseUrl}${product.image}` : `${baseUrl}/images/logo/amerlogo.png`;
    const price = product.price;
    const originalPrice = product.originalPrice || product.price;
    const inStock = product.stock > 0;
    const availability = inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";

    return {
      title: `${product.name} - AMERSHOP!`,
      description: product.description || `Buy ${product.name} at AMERSHOP!. ${product.category?.name || 'Quality products'} at competitive prices. ${inStock ? 'In stock now!' : 'Check availability.'}`,
      keywords: [product.name, product.category?.name || '', "buy online", "ecommerce", "AMERSHOP!"].filter(Boolean),
      openGraph: {
        title: product.name,
        description: product.description || `Buy ${product.name} at AMERSHOP!`,
        url: productUrl,
        type: "website",
        images: [
          {
            url: productImage,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
        siteName: "AMERSHOP!",
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description || `Buy ${product.name} at AMERSHOP!`,
        images: [productImage],
      },
      alternates: {
        canonical: productUrl,
      },
      other: {
        "product:price:amount": price.toString(),
        "product:price:currency": "AED",
        "product:availability": availability,
        "product:condition": product.isRefurbished ? "refurbished" : "new",
      },
    };
  } catch (error) {
    return {
      title: "Product",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Check if prisma is available
  if (!prisma) {
    console.error('Prisma client is not available. Please check DATABASE_URL environment variable.');
    notFound();
  }

  // Try to find by slug first, then by id as fallback
  let product;
  try {
    product = await prisma.product.findUnique({
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
  } catch (error) {
    console.error('Database error:', error);
    notFound();
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
  let relatedProducts = [];
  try {
    relatedProducts = await prisma.product.findMany({
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
  } catch (error) {
    console.error('Error fetching related products:', error);
    // Continue without related products if there's an error
  }

  // Structured Data for Product
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || product.name,
    "image": product.image ? `${baseUrl}${product.image}` : `${baseUrl}/images/logo/amerlogo.png`,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "AMERSHOP!",
    },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/product/${product.slug}`,
      "priceCurrency": "AED",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "itemCondition": product.isRefurbished ? "https://schema.org/RefurbishedCondition" : "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "AMERSHOP!",
      },
    },
    "category": product.category?.name || "",
    ...(product.originalPrice && product.originalPrice > product.price && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "reviewCount": "10",
      },
    }),
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl,
      },
      ...(product.category ? [{
        "@type": "ListItem",
        "position": 2,
        "name": product.category.name,
        "item": `${baseUrl}/category/${product.category.slug}`,
      }] : []),
      {
        "@type": "ListItem",
        "position": product.category ? 3 : 2,
        "name": product.name,
        "item": `${baseUrl}/product/${product.slug}`,
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <main className="min-h-screen" itemScope itemType="https://schema.org/Product">
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
              {product.image || allImages[0] ? (
                <PlaceholderImage
                  src={product.image || allImages[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  placeholderText={product.name}
                  placeholderWidth={800}
                  placeholderHeight={800}
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No Image Available</span>
                </div>
              )}
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
              <h1 className="text-4xl font-bold mb-2" itemProp="name">{product.name}</h1>
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
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line" itemProp="description">
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
      </main>
    </>
  );
}

// Removed generateStaticParams - using dynamic rendering instead
// This allows products to be added/updated without rebuilding

