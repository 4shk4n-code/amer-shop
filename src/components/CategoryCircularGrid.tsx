import Link from 'next/link'
import { Shirt, ShoppingBag, Watch, Laptop, Camera, Home as HomeIcon, Utensils } from 'lucide-react'

interface CategoryCircularGridProps {
  title: string
  categories: Array<{
    name: string
    offer: string
    icon: any
    href: string
  }>
}

export default function CategoryCircularGrid({ title, categories }: CategoryCircularGridProps) {
  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-red-600">{title}</h2>
          <Link
            href="/deals"
            className="bg-black text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors whitespace-nowrap"
          >
            Shop deals
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category, index) => {
            const Icon = category.icon
            if (!Icon) return null
            return (
              <Link
                key={index}
                href={category.href}
                className="flex-shrink-0 w-32 text-center group"
              >
                <div className="bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-colors">
                  <Icon className="w-16 h-16 text-gray-600" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">{category.offer}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

