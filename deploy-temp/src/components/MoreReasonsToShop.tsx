import Link from 'next/link'
import { ShoppingBag, Star, Sparkles, Store } from 'lucide-react'

const reasons = [
  {
    title: 'Grocery',
    description: 'Top deals, wide selection',
    icon: ShoppingBag,
    href: '/categories/food',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    title: 'Bestsellers',
    description: 'Shop our top picks',
    icon: Star,
    href: '/bestsellers',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    title: 'New arrivals',
    description: 'The latest, curated for you',
    icon: Sparkles,
    href: '/new-arrivals',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    title: 'Local Brands',
    description: 'Support local businesses',
    icon: Store,
    href: '/local-brands',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
]

export default function MoreReasonsToShop() {
  return (
    <div className="bg-white">
      <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-4">MORE REASONS TO SHOP</h2>
      <div className="grid grid-cols-2 gap-3">
        {reasons.map((reason, index) => {
          const Icon = reason.icon
          return (
            <Link
              key={index}
              href={reason.href}
              className={`${reason.bgColor} rounded-lg p-4 hover:shadow-md transition-all`}
            >
              <div className={`${reason.iconColor} mb-3`}>
                <Icon className="w-10 h-10" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">{reason.title}</h3>
              <p className="text-xs text-gray-600">{reason.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

