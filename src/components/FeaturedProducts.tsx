import ProductCard from './ProductCard'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Coffee Beans',
    price: 45.99,
    originalPrice: 59.99,
    image: '/images/products/coffee.jpg',
    rating: 4.5,
    reviews: 128,
    category: 'Coffee',
  },
  {
    id: 2,
    name: 'Organic Food Pack',
    price: 89.99,
    originalPrice: 120.00,
    image: '/images/products/food.jpg',
    rating: 4.8,
    reviews: 256,
    category: 'Food',
  },
  {
    id: 3,
    name: 'Designer T-Shirt',
    price: 29.99,
    originalPrice: 49.99,
    image: '/images/products/shirt.jpg',
    rating: 4.3,
    reviews: 89,
    category: 'Clothes',
  },
  {
    id: 4,
    name: 'Car Spare Parts Kit',
    price: 199.99,
    originalPrice: 249.99,
    image: '/images/products/parts.jpg',
    rating: 4.6,
    reviews: 45,
    category: 'Parts',
  },
  {
    id: 5,
    name: 'Web Design Service',
    price: 999.99,
    image: '/images/products/design.jpg',
    rating: 5.0,
    reviews: 12,
    category: 'Services',
  },
  {
    id: 6,
    name: 'Mobile App Development',
    price: 1999.99,
    image: '/images/products/app.jpg',
    rating: 4.9,
    reviews: 8,
    category: 'Services',
  },
]

interface FeaturedProductsProps {
  title: string
}

export default function FeaturedProducts({ title }: FeaturedProductsProps) {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <a href="/products" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

