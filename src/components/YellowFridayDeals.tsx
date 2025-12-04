'use client'

import Link from 'next/link'
import { Plus, Heart } from 'lucide-react'
import { useFavorites } from '@/lib/favorites'

const deals = [
  {
    id: 1,
    category: 'Mobile Phones deals',
    name: 'Honor X9c Dual SIM Sunrise Orange 12GB RAM 256GB 5G With Free honor choice...',
    originalPrice: 1299,
    price: 958,
    image: '/images/products/phone.jpg',
  },
  {
    id: 2,
    category: 'Medical Supplies & Equipment de...',
    name: 'Beurer GL 50 Black Blood Glucose Monitor 3-in-1 Design Fast & Accurate...',
    originalPrice: 79,
    price: 35,
    image: '/images/products/medical.jpg',
  },
  {
    id: 3,
    category: 'Accessories deals',
    name: 'Ugreen iPhone 16 Pro Max Case Magsafe, Strong Magnet, Upgraded Delay...',
    originalPrice: 59,
    price: 40,
    image: '/images/products/case.jpg',
  },
  {
    id: 4,
    category: 'Home Care & Cleaning deals',
    name: 'Hotpack Disposable Plastic Strong & Bio-Degradable Dust Bin Liner Bag Roll Whit...',
    originalPrice: 11,
    price: 10,
    image: '/images/products/cleaning.jpg',
  },
]

export default function YellowFridayDeals() {
  const { toggleFavorite, isFavorite } = useFavorites()

  const handleFavoriteClick = (e: React.MouseEvent, deal: typeof deals[0]) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite({
      id: deal.id,
      name: deal.name,
      price: deal.price,
      originalPrice: deal.originalPrice,
      image: deal.image,
      rating: 4.5,
      reviews: 0,
      category: deal.category,
    })
  }

  return (
    <div className="bg-yellow-400 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-900">
          CRAZIEST YELLOW FRIDAY DEALS
        </h2>
        <Link
          href="/deals"
          className="bg-black text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-gray-900 transition-colors whitespace-nowrap"
        >
          Shop deals
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {deals.map((deal) => {
          const favorited = isFavorite(deal.id)
          return (
            <Link
              key={deal.id}
              href={`/products/${deal.id}`}
              className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all group"
            >
              <div className="relative aspect-square bg-gray-100">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-xs text-gray-500">Image</span>
                </div>
                <button
                  onClick={(e) => handleFavoriteClick(e, deal)}
                  className={`absolute top-1 right-1 bg-white rounded-full p-1.5 shadow-md transition-all ${
                    favorited ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart
                    className={`w-3 h-3 transition-colors ${
                      favorited ? 'fill-red-500 text-red-500' : 'text-gray-700'
                    }`}
                  />
                </button>
              </div>
              <div className="p-3 bg-yellow-400">
                <p className="text-xs text-gray-600 mb-1 line-clamp-1">{deal.category}</p>
                <h3 className="text-xs font-medium text-gray-900 mb-2 line-clamp-2 min-h-[32px]">
                  {deal.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs line-through">AED {deal.originalPrice}</span>
                  <span className="text-base font-bold text-gray-900">AED {deal.price}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

