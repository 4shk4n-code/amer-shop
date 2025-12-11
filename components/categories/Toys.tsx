"use client";

import ProductCard from "@/components/ProductCard";

const toysProducts = [
  {
    id: "toy-1",
    slug: "building-blocks",
    name: "Building Blocks",
    price: 49.99,
    category: "Toys",
    description: "Educational building blocks for kids",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
  },
  {
    id: "toy-2",
    slug: "puzzle-set",
    name: "Puzzle Set",
    price: 19.99,
    category: "Toys",
    description: "1000-piece jigsaw puzzle",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop",
  },
  {
    id: "toy-3",
    slug: "action-figure",
    name: "Action Figure",
    price: 24.99,
    category: "Toys",
    description: "Collectible action figure with accessories",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop",
  },
  {
    id: "toy-4",
    slug: "board-game",
    name: "Board Game",
    price: 34.99,
    category: "Toys",
    description: "Family-friendly board game for all ages",
    image: "https://images.unsplash.com/photo-1606166186956-10f3e5e5e5e5?w=400&h=400&fit=crop",
  },
  {
    id: "toy-5",
    slug: "remote-control-car",
    name: "Remote Control Car",
    price: 59.99,
    category: "Toys",
    description: "High-speed remote control car",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
  },
  {
    id: "toy-6",
    slug: "art-supplies-set",
    name: "Art Supplies Set",
    price: 29.99,
    category: "Toys",
    description: "Complete art supplies set for creative kids",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop",
  },
];

export default function Toys() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Toys</h1>
        <p className="text-muted-foreground text-lg">
          Fun for all ages
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {toysProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

