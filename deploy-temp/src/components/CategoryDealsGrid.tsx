'use client'

import Link from 'next/link'
import { ChevronRight, Utensils, Coffee, Wrench, Shirt, Laptop, ShoppingBag, Zap, Home, Heart, Baby, Gamepad2, Dumbbell } from 'lucide-react'

const categoryDeals = [
  {
    name: 'Deals',
    icon: Zap,
    href: '/deals',
    badge: 'YELLOW FRIDAY',
    offer: 'UP TO 80% OFF',
    bannerColor: 'bg-red-600',
  },
  {
    name: 'Grocery',
    icon: Utensils,
    href: '/categories/food',
    offer: 'FROM AED 1',
    bannerColor: 'bg-green-600',
  },
  {
    name: 'Clearance Store',
    icon: ShoppingBag,
    href: '/clearance',
    offer: 'GET AED 250 BACK',
    bannerColor: 'bg-red-600',
  },
  {
    name: 'Sports & Fitness',
    icon: Dumbbell,
    href: '/categories/sports',
    offer: 'UP TO 60% OFF',
    bannerColor: 'bg-red-600',
  },
  {
    name: 'Mobiles',
    icon: Laptop,
    href: '/categories/tech',
    offer: 'UP TO 50% OFF',
    bannerColor: 'bg-red-600',
  },
  {
    name: 'Global Store',
    icon: ShoppingBag,
    href: '/global-store',
    offer: 'UP TO 80% OFF',
    bannerColor: 'bg-red-600',
  },
  {
    name: 'Beauty',
    icon: Heart,
    href: '/categories/beauty',
    offer: '30-70% OFF',
    bannerColor: 'bg-red-600',
  },
  {
    name: 'Health & Nutrition',
    icon: Heart,
    href: '/categories/health',
    offer: 'UP TO 70% OFF',
    bannerColor: 'bg-red-600',
  },
  {
    name: 'Home & Kitchen',
    icon: Home,
    href: '/categories/home',
    offer: 'UP TO 70% OFF',
    bannerColor: 'bg-red-600',
  },
  {
    name: 'Televisions',
    icon: Laptop,
    href: '/categories/tech',
    offer: 'FREE GIFTS',
    bannerColor: 'bg-red-600',
  },
  {
    name: 'Electronics',
    icon: Laptop,
    href: '/categories/tech',
    offer: 'UP TO 60% OFF',
    bannerColor: 'bg-red-600',
  },
  {
    name: 'Baby',
    icon: Baby,
    href: '/categories/baby',
    offer: 'UP TO 80% OFF',
    bannerColor: 'bg-red-600',
  },
]

export default function CategoryDealsGrid() {
  return (
    <div className="bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categoryDeals.map((deal, index) => {
            const Icon = deal.icon
            return (
              <Link
                key={index}
                href={deal.href}
                className="flex-shrink-0 w-32 md:w-40 group"
              >
                <div className="bg-white rounded-lg border-2 border-yellow-400 overflow-hidden hover:shadow-lg transition-all">
                  {/* Icon/Image Area */}
                  <div className="h-24 md:h-32 bg-gray-50 flex items-center justify-center p-4">
                    <Icon className="w-12 h-12 md:w-16 md:h-16 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                  
                  {/* Badge */}
                  {deal.badge && (
                    <div className="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold text-center">
                      {deal.badge}
                    </div>
                  )}
                  
                  {/* Offer Banner */}
                  <div className={`${deal.bannerColor} text-white px-2 py-2 text-center`}>
                    <p className="text-xs md:text-sm font-bold">{deal.offer}</p>
                  </div>
                </div>
              </Link>
            )
          })}
          
          {/* Scroll Indicator */}
          <div className="flex-shrink-0 flex items-center text-gray-400">
            <ChevronRight className="w-6 h-6" />
          </div>
        </div>
        
        {/* Dots Indicator */}
        <div className="flex justify-center gap-1 mt-4">
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              className={`w-2 h-2 rounded-full ${dot === 1 ? 'bg-gray-400' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

