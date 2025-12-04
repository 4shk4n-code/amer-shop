'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Package, Heart, Settings, LogOut, MapPin, Phone, Mail, Edit } from 'lucide-react'
import { getCustomer, removeCustomerToken, removeCustomer, isCustomerAuthenticated } from '@/lib/auth-customer'
import { useFavorites } from '@/lib/favorites'

export default function AccountPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'settings'>('overview')
  const [userInfo, setUserInfo] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { favorites } = useFavorites()

  useEffect(() => {
    if (!isCustomerAuthenticated()) {
      router.push('/login')
      return
    }

    const user = getCustomer()
    if (user) {
      setUserInfo(user)
      fetchOrders()
    }
    setLoading(false)
  }, [router])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('customer_token')
      const res = await fetch('/api/orders/customer', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const handleLogout = () => {
    removeCustomerToken()
    removeCustomer()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    )
  }

  if (!userInfo) {
    return null
  }

  const displayName = `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || userInfo.email

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold">{displayName}</p>
                  <p className="text-sm text-gray-600">{userInfo.email}</p>
                </div>
              </div>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'wishlist'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Account Overview</h2>
                    <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{displayName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{userInfo.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{userInfo.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">Address not set</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <Package className="w-8 h-8 text-primary-600 mb-3" />
                    <p className="text-2xl font-bold">{orders.length}</p>
                    <p className="text-gray-600">Total Orders</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <Heart className="w-8 h-8 text-red-500 mb-3" />
                    <p className="text-2xl font-bold">{favorites.length}</p>
                    <p className="text-gray-600">Wishlist Items</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-green-600 font-bold">AED</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                    </p>
                    <p className="text-gray-600">Total Spent</p>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">My Orders</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No orders yet</p>
                    <Link
                      href="/products"
                      className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Start Shopping →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold">Order #{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">AED {order.totalAmount.toFixed(2)}</p>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 text-green-700'
                                  : order.status === 'processing' || order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-700'
                                  : order.status === 'cancelled'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">{order.itemCount} item(s)</p>
                          <Link
                            href={`/orders/${order.id}`}
                            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Your wishlist is empty</p>
                    <Link
                      href="/products"
                      className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Browse Products →
                    </Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {favorites.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg p-4 flex gap-4 hover:shadow-md transition-shadow"
                      >
                        <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-xs text-gray-500">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{item.name}</h3>
                          <p className="text-lg font-bold text-primary-600 mb-3">
                            AED {item.price.toFixed(2)}
                          </p>
                          <div className="flex gap-2">
                            <Link
                              href={`/products/${item.id}`}
                              className="flex-1 bg-primary-600 text-white text-center py-2 rounded-lg hover:bg-primary-700 text-sm font-medium"
                            >
                              View Product
                            </Link>
                            <Link
                              href="/wishlist"
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                            >
                              Manage
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={displayName}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={userInfo.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue={userInfo.phone || ''}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      defaultValue={userInfo.address}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Change Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 mb-2"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

