'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const promotionalBanners = [
  {
    id: 1,
    title: 'CRAZIEST DEALS OF THE YEAR',
    subtitle: 'Free gifts worth up to AED 1,500',
    badge: 'YELLOW FRIDAY SALE',
    bgGradient: 'from-purple-600 to-purple-800',
    textColor: 'text-white',
    link: '/categories/tech',
    category: 'Tech',
  },
  {
    id: 2,
    title: '40-80% OFF FASHION',
    subtitle: 'Lowest prices of the year',
    badge: 'YELLOW FRIDAY',
    bgGradient: 'from-yellow-400 to-yellow-500',
    textColor: 'text-gray-900',
    link: '/categories/clothes',
    category: 'Fashion',
  },
]

export default function PromotionalBanners() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % promotionalBanners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + promotionalBanners.length) % promotionalBanners.length)
  }

  return (
    <div className="relative bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-4 relative">
          {promotionalBanners.map((banner, index) => (
            <Link
              key={banner.id}
              href={banner.link}
              className={`relative rounded-lg overflow-hidden bg-gradient-to-br ${banner.bgGradient} p-8 h-64 md:h-80 flex flex-col justify-between ${index === currentSlide ? 'opacity-100' : 'opacity-100'}`}
            >
              <div className="absolute top-4 right-4">
                <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                  {banner.badge}
                </span>
              </div>
              
              <div className={`${banner.textColor} z-10`}>
                <h3 className="text-2xl md:text-4xl font-bold mb-2">{banner.title}</h3>
                <p className="text-lg md:text-xl">{banner.subtitle}</p>
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <span className={`${banner.textColor} font-semibold`}>Shop Now →</span>
              </div>
            </Link>
          ))}
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-full hover:bg-gray-100 z-10 hidden md:block"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-full hover:bg-gray-100 z-10 hidden md:block"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  )
}

