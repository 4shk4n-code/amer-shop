'use client'

import { use } from 'react'
import ProductCard from '@/components/ProductCard'

const categoryProducts = {
  food: [
    {
      id: 2,
      name: 'Organic Food Pack - Premium Selection',
      price: 89.99,
      originalPrice: 120.00,
      image: '/images/products/food.jpg',
      rating: 4.8,
      reviews: 256,
      category: 'Food',
    },
  ],
  coffee: [
    {
      id: 1,
      name: 'Premium Coffee Beans - Arabica',
      price: 45.99,
      originalPrice: 59.99,
      image: '/images/products/coffee.jpg',
      rating: 4.5,
      reviews: 128,
      category: 'Coffee',
    },
  ],
  clothes: [
    {
      id: 3,
      name: 'Designer T-Shirt - Cotton',
      price: 29.99,
      originalPrice: 49.99,
      image: '/images/products/shirt.jpg',
      rating: 4.3,
      reviews: 89,
      category: 'Clothes',
    },
  ],
  parts: [
    {
      id: 4,
      name: 'Car Spare Parts Kit - Complete',
      price: 199.99,
      originalPrice: 249.99,
      image: '/images/products/parts.jpg',
      rating: 4.6,
      reviews: 45,
      category: 'Parts',
    },
  ],
  services: [
    {
      id: 5,
      name: 'Professional Web Design Service',
      price: 999.99,
      image: '/images/products/design.jpg',
      rating: 5.0,
      reviews: 12,
      category: 'Services',
    },
    {
      id: 6,
      name: 'Mobile App Development - Full Stack',
      price: 1999.99,
      image: '/images/products/app.jpg',
      rating: 4.9,
      reviews: 8,
      category: 'Services',
    },
  ],
  tech: [
    {
      id: 7,
      name: 'Laptop - High Performance',
      price: 2499.99,
      originalPrice: 2999.99,
      image: '/images/products/laptop.jpg',
      rating: 4.7,
      reviews: 156,
      category: 'Tech',
    },
    {
      id: 8,
      name: 'Smartphone - Latest Model',
      price: 899.99,
      originalPrice: 1099.99,
      image: '/images/products/phone.jpg',
      rating: 4.8,
      reviews: 203,
      category: 'Tech',
    },
  ],
}

const categoryNames: Record<string, string> = {
  food: 'Food',
  coffee: 'Coffee',
  clothes: 'Clothes',
  parts: 'Parts & Spare Parts',
  services: 'Services',
  tech: 'Tech',
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const products = categoryProducts[slug as keyof typeof categoryProducts] || []
  const categoryName = categoryNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1)

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">{categoryName}</h1>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No products found in this category.</p>
            <p className="text-gray-500 mt-2">Check back soon for new products!</p>
          </div>
        )}
      </div>
    </div>
  )
}

