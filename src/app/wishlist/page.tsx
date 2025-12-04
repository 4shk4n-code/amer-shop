'use client'

import { useFavorites } from '@/lib/favorites'
import Link from 'next/link'
import { Heart, ShoppingBag, Trash2, Star } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

export default function WishlistPage() {
  const { favorites, removeFromFavorites, clearFavorites, isLoaded } = useFavorites()

  if (!isLoaded) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your favorites...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {favorites.length === 0
                ? 'No items in your wishlist'
                : `${favorites.length} ${favorites.length === 1 ? 'item' : 'items'} saved`}
            </p>
          </div>
          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Start adding products to your wishlist by clicking the heart icon on any product
            </p>
            <Link
              href="/"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              {favorites.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <button
                    onClick={() => removeFromFavorites(product.id)}
                    className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Items in your wishlist are saved for later
                  </p>
                  <p className="text-xs text-gray-500">
                    Add items to cart directly from your wishlist
                  </p>
                </div>
                <Link
                  href="/products"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors whitespace-nowrap"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

