'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, Heart, ShoppingCart, Plus, Minus, MessageSquare, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { addToCart } from '@/lib/cart'
import { useFavorites } from '@/lib/favorites'
import { getCustomerToken, isCustomerAuthenticated } from '@/lib/auth-customer'

interface Product {
  id: number
  name: string
  price: number
  originalPrice: number | null
  images: string[]
  rating: number
  reviewCount: number
  category: {
    name: string
    slug: string
  }
  description: string
  inStock: boolean
  stockQuantity: number
  specifications: Record<string, string>
}

export default function ProductDetailPage() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)
  const { toggleFavorite, isFavorite } = useFavorites()
  const [reviews, setReviews] = useState<any[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
      fetchReviews()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/products/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data)
      } else {
        console.error('Product not found')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}/reviews`)
      if (res.ok) {
        const data = await res.json()
        setReviews(data.reviews || [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isCustomerAuthenticated()) {
      alert('Please login to submit a review')
      return
    }

    setSubmittingReview(true)
    try {
      const token = getCustomerToken()
      const res = await fetch(`/api/products/${params.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewForm),
      })

      const data = await res.json()
      if (res.ok) {
        setShowReviewForm(false)
        setReviewForm({ rating: 5, title: '', comment: '' })
        fetchReviews()
        if (product) {
          fetchProduct() // Refresh product to update rating
        }
        alert('Review submitted successfully!')
      } else {
        alert('Error: ' + (data.error || 'Failed to submit review'))
      }
    } catch (error) {
      alert('Error submitting review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-gray-500">Loading product...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-gray-500">Product not found</div>
            <Link href="/products" className="text-primary-600 hover:underline mt-4 inline-block">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          {' / '}
          <Link href={`/categories/${product.category.slug}`} className="hover:text-primary-600">
            {product.category.name}
          </Link>
          {' / '}
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 bg-gray-100 rounded border-2 cursor-pointer hover:border-primary-500 overflow-hidden ${
                        selectedImage === i ? 'border-primary-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    AED {product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-2xl text-gray-500 line-through">
                        AED {product.originalPrice.toFixed(2)}
                      </span>
                      <span className="bg-accent-500 text-white px-3 py-1 rounded font-semibold">
                        -{discount}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {product.inStock ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
                </p>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6">{product.description}</p>

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Specifications</h3>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                    disabled={!product.inStock}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="p-2 hover:bg-gray-100"
                    disabled={!product.inStock || quantity >= product.stockQuantity}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    if (product && product.inStock) {
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice || undefined,
                        quantity: quantity,
                        image: product.images && product.images.length > 0 ? product.images[0] : '',
                      })
                      setAddedToCart(true)
                      setTimeout(() => setAddedToCart(false), 2000)
                    }
                  }}
                  disabled={!product.inStock}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                    product.inStock
                      ? addedToCart
                        ? 'bg-green-600 text-white'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addedToCart ? 'Added to Cart!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  onClick={() => {
                    if (product) {
                      toggleFavorite({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice || undefined,
                        image: product.images && product.images.length > 0 ? product.images[0] : '',
                        rating: product.rating,
                        reviews: product.reviewCount,
                        category: product.category.name,
                      })
                    }
                  }}
                  className={`p-3 border-2 rounded-lg transition-colors ${
                    product && isFavorite(product.id)
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-primary-500'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      product && isFavorite(product.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>

              {/* Additional Info */}
              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-2 text-sm text-gray-600">
                  <p>✓ Free delivery on orders over AED 100</p>
                  <p>✓ 7-day return policy</p>
                  <p>✓ Secure payment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Reviews ({reviews.length})
              </h2>
              {isCustomerAuthenticated() && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Write a Review
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-4">Write a Review</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating *</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= reviewForm.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Summary of your review"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Comment</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Share your experience..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewForm(false)
                        setReviewForm({ rating: 5, title: '', comment: '' })
                      }}
                      className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.author.name}</p>
                        {review.isVerifiedPurchase && (
                          <span className="text-xs text-green-600 font-medium">Verified Purchase</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.title && (
                      <h4 className="font-medium mb-2">{review.title}</h4>
                    )}
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      <button className="flex items-center gap-1 hover:text-primary-600">
                        <ThumbsUp className="w-4 h-4" />
                        Helpful ({review.helpfulCount})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

