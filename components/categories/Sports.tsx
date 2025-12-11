"use client";

import ProductCard from "@/components/ProductCard";

const sportsProducts = [
  {
    id: "sport-1",
    slug: "yoga-mat",
    name: "Yoga Mat",
    price: 39.99,
    category: "Sports",
    description: "Premium non-slip yoga mat",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83d4875a?w=400&h=400&fit=crop",
  },
  {
    id: "sport-2",
    slug: "dumbbell-set",
    name: "Dumbbell Set",
    price: 129.99,
    category: "Sports",
    description: "Adjustable dumbbell set for home workouts",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
  },
  {
    id: "sport-3",
    slug: "running-shoes",
    name: "Running Shoes",
    price: 99.99,
    category: "Sports",
    description: "Lightweight running shoes with cushioning",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  },
  {
    id: "sport-4",
    slug: "water-bottle",
    name: "Water Bottle",
    price: 19.99,
    category: "Sports",
    description: "Insulated stainless steel water bottle",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
  },
  {
    id: "sport-5",
    slug: "resistance-bands",
    name: "Resistance Bands",
    price: 24.99,
    category: "Sports",
    description: "Set of 5 resistance bands for strength training",
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=400&fit=crop",
  },
  {
    id: "sport-6",
    slug: "basketball",
    name: "Basketball",
    price: 29.99,
    category: "Sports",
    description: "Official size basketball with grip texture",
    image: "https://images.unsplash.com/photo-1519869325934-21c5bf488f93?w=400&h=400&fit=crop",
  },
];

export default function Sports() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Sports</h1>
        <p className="text-muted-foreground text-lg">
          Fitness & outdoor gear
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sportsProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

