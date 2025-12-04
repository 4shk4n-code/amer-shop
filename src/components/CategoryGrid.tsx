import Link from 'next/link'
import { Utensils, Coffee, Wrench, Shirt, Laptop, ShoppingBag } from 'lucide-react'

const categories = [
  {
    name: 'Food',
    icon: Utensils,
    href: '/categories/food',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    name: 'Coffee',
    icon: Coffee,
    href: '/categories/coffee',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    name: 'Parts & Spare Parts',
    icon: Wrench,
    href: '/categories/parts',
    color: 'bg-gray-100 text-gray-600',
  },
  {
    name: 'Clothes',
    icon: Shirt,
    href: '/categories/clothes',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    name: 'Services',
    icon: ShoppingBag,
    href: '/categories/services',
    color: 'bg-green-100 text-green-600',
  },
  {
    name: 'Tech',
    icon: Laptop,
    href: '/categories/tech',
    color: 'bg-blue-100 text-blue-600',
  },
]

export default function CategoryGrid() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.name}
                href={category.href}
                className="flex flex-col items-center p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all group"
              >
                <div className={`${category.color} p-4 rounded-full mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium text-center text-gray-700 group-hover:text-primary-600">
                  {category.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

