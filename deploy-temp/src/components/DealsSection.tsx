import Link from 'next/link'
import { Clock } from 'lucide-react'

export default function DealsSection() {
  return (
    <section className="py-8 bg-white border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Flash Deals</h2>
            <div className="flex items-center gap-2 text-accent-600">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Ends in: 23:45:12</span>
            </div>
          </div>
          <Link href="/deals" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="bg-gradient-to-r from-accent-50 to-primary-50 rounded-lg p-6">
          <p className="text-center text-gray-700">
            🎉 Special deals available! Check out our flash sales and limited-time offers.
          </p>
        </div>
      </div>
    </section>
  )
}

