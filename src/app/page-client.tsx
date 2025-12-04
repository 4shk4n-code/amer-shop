'use client'

import { useState, useEffect, useRef } from 'react'
import DailyDealsBanner from '@/components/DailyDealsBanner'
import PromotionalBanners from '@/components/PromotionalBanners'
import CategoryDealsGrid from '@/components/CategoryDealsGrid'
import MoreReasonsToShop from '@/components/MoreReasonsToShop'
import YellowFridayDeals from '@/components/YellowFridayDeals'
import InFocus from '@/components/InFocus'
import ProductSection from '@/components/ProductSection'
import CategoryCircularGrid from '@/components/CategoryCircularGrid'
import { Shirt, ShoppingBag, Watch, Laptop, Camera, Home as HomeIcon, Utensils, Baby, Dumbbell, Heart } from 'lucide-react'

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
  }
}

const womenFashionCategories = [
  { name: 'Clearance Sale', offer: '60% Off Or More', icon: Shirt, href: '/categories/clothes' },
  { name: 'Tops', offer: 'Starting AED 19', icon: Shirt, href: '/categories/clothes' },
  { name: 'Footwear', offer: 'Under AED 199', icon: ShoppingBag, href: '/categories/clothes' },
  { name: 'Hoodies & Jackets', offer: '50-90% Off', icon: Shirt, href: '/categories/clothes' },
  { name: 'Handbags', offer: 'Under AED 99', icon: ShoppingBag, href: '/categories/clothes' },
  { name: 'Traditional Wear', offer: '50% Off Or More', icon: Shirt, href: '/categories/clothes' },
  { name: 'Sportswear', offer: '50% Off Or More', icon: Shirt, href: '/categories/clothes' },
]

const menFashionCategories = [
  { name: 'Clearance Sale', offer: '60% Off Or More', icon: Shirt, href: '/categories/clothes' },
  { name: 'Sportswear', offer: '50% Off Or More', icon: Shirt, href: '/categories/clothes' },
  { name: 'Sneakers', offer: '50% Off Or More', icon: ShoppingBag, href: '/categories/clothes' },
  { name: 'T-Shirts', offer: 'Under AED 49', icon: Shirt, href: '/categories/clothes' },
  { name: 'Hoodies & Jackets', offer: '50-90% Off', icon: Shirt, href: '/categories/clothes' },
  { name: 'Luggage', offer: '50-80% Off', icon: ShoppingBag, href: '/categories/clothes' },
  { name: 'Sports Shoes', offer: '50% Off Or More', icon: ShoppingBag, href: '/categories/clothes' },
]

const beautyCategories = [
  { name: 'Makeup', offer: 'Under AED 49', icon: Heart, href: '/categories/beauty' },
  { name: 'Hair Care', offer: '30-70% Off', icon: Heart, href: '/categories/beauty' },
  { name: 'Skincare', offer: '50% Off Or More', icon: Heart, href: '/categories/beauty' },
  { name: 'Bath & Body', offer: 'Up To 70% Off', icon: Heart, href: '/categories/beauty' },
  { name: 'Styling Tools', offer: 'Under AED 129', icon: Heart, href: '/categories/beauty' },
  { name: "Men's Care", offer: 'Min. 40% Off', icon: Heart, href: '/categories/beauty' },
  { name: "Women's Personal Care", offer: 'Min. 25% Off', icon: Heart, href: '/categories/beauty' },
]

const homeKitchenCategories = [
  { name: 'Cookware', offer: 'Up To 70% Off', icon: Utensils, href: '/categories/home' },
  { name: 'Furniture', offer: '30-70%', icon: HomeIcon, href: '/categories/home' },
  { name: 'Floor Lamps', offer: 'Min 30% Off', icon: HomeIcon, href: '/categories/home' },
  { name: 'Home Office', offer: 'Up To 60% Off', icon: HomeIcon, href: '/categories/home' },
  { name: 'Coffee & Tea', offer: 'From AED 29', icon: Utensils, href: '/categories/home' },
  { name: 'Artificial Plants', offer: 'Up To 70% Off', icon: HomeIcon, href: '/categories/home' },
  { name: 'Towels & Bath', offer: 'From AED 9', icon: HomeIcon, href: '/categories/home' },
]

export default function HomeClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    mountedRef.current = true
    
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=20')
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`)
        }
        const data = await res.json()
        if (mountedRef.current) {
          setProducts(Array.isArray(data.products) ? data.products : [])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        if (mountedRef.current) {
          setProducts([])
          setLoading(false)
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      mountedRef.current = false
    }
  }, [])

  const formatProductForCard = (product: Product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice ?? undefined,
    image: product.images && product.images.length > 0 ? product.images[0] : '/images/products/placeholder.jpg',
    rating: product.rating,
    reviews: product.reviewCount,
    category: product.category.name,
  })

  const displayProducts = products.length > 0 ? products.slice(0, 10).map(formatProductForCard) : []

  return (
    <div className="bg-white">
      <DailyDealsBanner />
      <PromotionalBanners />
      <CategoryDealsGrid />
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <MoreReasonsToShop />
            </div>
            <div className="lg:col-span-1">
              <YellowFridayDeals />
            </div>
            <div className="lg:col-span-1">
              <InFocus />
            </div>
          </div>
        </div>
      </div>
      {!loading && displayProducts.length > 0 && (
        <>
          <ProductSection title="LOWEST PRICES OF THE YEAR" products={displayProducts} />
          <ProductSection title="ROCK BOTTOM PRICES ON HOME" products={displayProducts} />
          <ProductSection title="UP TO $200 OFF ON FASHION | USE CODE: FASH30" products={displayProducts} />
          <ProductSection title="RECOMMENDED FOR YOU" products={displayProducts} />
        </>
      )}
      <CategoryCircularGrid title="UP TO 90% OFF WOMEN'S FASHION" categories={womenFashionCategories} />
      <CategoryCircularGrid title="UP TO 90% OFF MEN'S FASHION" categories={menFashionCategories} />
      <CategoryCircularGrid title="30-70% OFF BEAUTY" categories={beautyCategories} />
      <CategoryCircularGrid title="UP TO 70% OFF HOME & KITCHEN" categories={homeKitchenCategories} />
      {!loading && displayProducts.length > 0 && (
        <>
          <ProductSection title="LOWEST PRICES ON APPLIANCES" products={displayProducts} />
          <ProductSection title="MIN. 50% OFF GROCERY" products={displayProducts} />
        </>
      )}
    </div>
  )
}

