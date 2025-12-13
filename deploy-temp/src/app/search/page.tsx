'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
}

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query) {
      fetchProducts()
    } else {
      setLoading(false)
    }
  }, [query])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=100`)
      const data = await res.json()
      
      const formattedProducts = data.products.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice || undefined,
        image: p.images && p.images.length > 0 ? p.images[0] : '',
        rating: p.rating,
        reviews: p.reviewCount,
        category: p.category?.name || '',
      }))
      
      setProducts(formattedProducts)
    } catch (error) {
      console.error('Error searching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">
          {query ? `Search Results for "${query}"` : 'Search Products'}
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Searching...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No products found.</p>
            <Link href="/products" className="text-primary-600 hover:underline">
              Browse all products
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Found {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-gray-500">Loading search...</div>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}

