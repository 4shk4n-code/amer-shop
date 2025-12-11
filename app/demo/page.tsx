import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";

// Demo page showing product cards with placeholder images
export default function DemoPage() {
  const products = [
    {
      id: "1",
      name: "Wireless Headphones",
      price: 99.99,
      category: "Electronics",
      description: "High-quality wireless headphones with noise cancellation",
    },
    {
      id: "2",
      name: "Cotton T-Shirt",
      price: 29.99,
      category: "Fashion",
      description: "Comfortable cotton t-shirt in various colors",
    },
    {
      id: "3",
      name: "Garden Tools Set",
      price: 79.99,
      category: "Home & Garden",
      description: "Complete set of essential garden tools",
    },
    {
      id: "4",
      name: "Yoga Mat",
      price: 39.99,
      category: "Sports",
      description: "Premium non-slip yoga mat",
    },
    {
      id: "5",
      name: "Mystery Novel",
      price: 14.99,
      category: "Books",
      description: "Bestselling mystery novel",
    },
    {
      id: "6",
      name: "Building Blocks",
      price: 49.99,
      category: "Toys",
      description: "Educational building blocks for kids",
    },
  ];

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Product Demo - Placeholder Images</h1>
        <p className="text-muted-foreground mb-8">
          These products use placeholder images that will automatically show if the image fails to load.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </main>
  );
}

