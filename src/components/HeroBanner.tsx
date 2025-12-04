'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const banners = [
  {
    id: 1,
    title: 'Welcome to AMER SHOP',
    subtitle: 'From Anywhere. To Everywhere.',
    image: '/images/banner1.jpg',
    link: '/categories/all',
  },
  {
    id: 2,
    title: 'Great Deals on Everything',
    subtitle: 'Shop now and save up to 50%',
    image: '/images/banner2.jpg',
    link: '/deals',
  },
  {
    id: 3,
    title: 'New Arrivals',
    subtitle: 'Discover the latest products',
    image: '/images/banner3.jpg',
    link: '/new-arrivals',
  },
]

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + banners.length) % banners.length)
  }

  return (
    <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden bg-gradient-to-r from-primary-500 to-accent-500">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="container mx-auto px-4 h-full flex items-center justify-center text-center text-white">
            <div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
                {banner.title}
              </h1>
              <p className="text-lg md:text-2xl mb-6">{banner.subtitle}</p>
              <a
                href={banner.link}
                className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

