import Link from 'next/link'
import ProductCard from './ProductCard'
import { Heart } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  badge?: string
}

interface ProductSectionProps {
  title: string
  products: Product[]
  showShopDeals?: boolean
}

export default function ProductSection({ title, products, showShopDeals = true }: ProductSectionProps) {
  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-red-600">{title}</h2>
          {showShopDeals && (
            <Link
              href="/deals"
              className="bg-black text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors whitespace-nowrap"
            >
              Shop deals
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

