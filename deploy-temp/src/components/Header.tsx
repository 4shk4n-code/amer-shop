'use client'

import Link from 'next/link'
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useFavorites } from '@/lib/favorites'
import { getCartItemCount } from '@/lib/cart'
import { isCustomerAuthenticated, getCustomer, removeCustomerToken, removeCustomer } from '@/lib/auth-customer'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('Dubai')
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const { favorites, isLoaded } = useFavorites()
  const [cartCount, setCartCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [customer, setCustomer] = useState<any>(null)

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartItemCount())
    }
    updateCartCount()
    window.addEventListener('cartUpdated', updateCartCount)
    
    // Check authentication
    setIsLoggedIn(isCustomerAuthenticated())
    setCustomer(getCustomer())
    
    return () => window.removeEventListener('cartUpdated', updateCartCount)
  }, [])

  const handleLogout = () => {
    removeCustomerToken()
    removeCustomer()
    setIsLoggedIn(false)
    setCustomer(null)
    router.push('/')
  }

  const categories = [
    { name: 'Food', href: '/categories/food' },
    { name: 'Coffee', href: '/categories/coffee' },
    { name: 'Parts & Spare Parts', href: '/categories/parts' },
    { name: 'Clothes', href: '/categories/clothes' },
    { name: 'Services', href: '/categories/services' },
    { name: 'Tech', href: '/categories/tech' },
  ]

  const locations = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah']
  const languages = ['English', 'العربية']

  return (
    <header className="sticky top-0 z-50">
      {/* Top Banner */}
      <div className="bg-blue-50 border-b border-gray-200 py-1">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span>Free Delivery on Orders Over 100 AED</span>
            <div className="flex gap-4">
              <Link href="/help" className="hover:text-gray-900">Help</Link>
              <Link href="/contact" className="hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Yellow Background */}
      <div className="bg-yellow-400 border-b border-yellow-500">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="text-2xl font-bold text-gray-900">
                AMER <span className="text-primary-600">SHOP</span>
              </div>
            </Link>

            {/* Location Selector */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-yellow-300 rounded transition-colors"
              >
                <span className="text-xs text-gray-700">Deliver to</span>
                {/* UAE Flag */}
                <div className="flex h-4 w-6 border border-gray-300">
                  <div className="w-1 bg-red-600"></div>
                  <div className="flex-1 flex flex-col">
                    <div className="h-1 bg-green-600"></div>
                    <div className="h-1 bg-white"></div>
                    <div className="h-1 bg-black"></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">{selectedLocation}</span>
                <ChevronDown className="w-4 h-4 text-gray-700" />
              </button>
              {showLocationDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[200px] z-50">
                  {locations.map((location) => (
                    <button
                      key={location}
                      onClick={() => {
                        setSelectedLocation(location)
                        setShowLocationDropdown(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <form 
                action="/search"
                method="get"
                className="relative"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (searchQuery.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
                  }
                }}
              >
                <input
                  type="text"
                  name="q"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pr-12 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Right: Language, Login, Favorites, Cart */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center gap-1 px-2 py-1 hover:bg-yellow-300 rounded transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">{selectedLanguage === 'English' ? 'EN' : 'AR'}</span>
                  <ChevronDown className="w-3 h-3 text-gray-700" />
                </button>
                {showLanguageDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[120px] z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSelectedLanguage(lang)
                          setShowLanguageDropdown(false)
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg text-sm"
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Login/Account */}
              {isLoggedIn ? (
                <div className="relative group">
                  <Link
                    href="/account"
                    className="flex items-center gap-1 px-2 py-1 hover:bg-yellow-300 rounded transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-900" />
                    <span className="text-sm font-medium text-gray-900 hidden sm:inline">
                      {customer?.firstName || 'Account'}
                    </span>
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1 px-2 py-1 hover:bg-yellow-300 rounded transition-colors"
                >
                  <User className="w-5 h-5 text-gray-900" />
                  <span className="text-sm font-medium text-gray-900 hidden sm:inline">Log in</span>
                </Link>
              )}

              {/* Favorites */}
              <Link
                href="/wishlist"
                className="relative p-1 hover:bg-yellow-300 rounded transition-colors"
              >
                <Heart className="w-6 h-6 text-gray-900" />
                {isLoaded && favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-1 hover:bg-yellow-300 rounded transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-gray-900" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-1 hover:bg-yellow-300 rounded transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Navigation Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="hidden lg:flex items-center py-3 overflow-x-auto">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap flex-shrink-0"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="text-sm font-medium text-gray-700 hover:text-primary-600 py-2 px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}      
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showLocationDropdown || showLanguageDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowLocationDropdown(false)
            setShowLanguageDropdown(false)
          }}
        />
      )}
    </header>
  )
}

