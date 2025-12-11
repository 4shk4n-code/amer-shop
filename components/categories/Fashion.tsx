"use client";

import ProductCard from "@/components/ProductCard";

const fashionProducts = [
  {
    id: "fash-1",
    name: "Cotton T-Shirt",
    price: 29.99,
    category: "Fashion",
    description: "Comfortable cotton t-shirt in various colors",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
  },
  {
    id: "fash-2",
    name: "Denim Jacket",
    price: 79.99,
    category: "Fashion",
    description: "Classic denim jacket with modern fit",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
  },
  {
    id: "fash-3",
    name: "Sneakers",
    price: 89.99,
    category: "Fashion",
    description: "Comfortable sneakers for everyday wear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  },
  {
    id: "fash-4",
    name: "Leather Belt",
    price: 39.99,
    category: "Fashion",
    description: "Genuine leather belt with classic buckle",
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=400&h=400&fit=crop",
  },
  {
    id: "fash-5",
    name: "Sunglasses",
    price: 59.99,
    category: "Fashion",
    description: "UV protection sunglasses with stylish frame",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
  },
  {
    id: "fash-6",
    name: "Backpack",
    price: 69.99,
    category: "Fashion",
    description: "Stylish backpack with multiple compartments",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
  },
];

export default function Fashion() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Fashion</h1>
        <p className="text-muted-foreground text-lg">
          Trendy clothing & accessories
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fashionProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

