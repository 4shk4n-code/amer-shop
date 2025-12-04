'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Package, LogOut, Save, X, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  originalPrice: number | null
  sku: string | null
  category: {
    id: number
    name: string
    slug: string
  }
  stockQuantity: number
  inStock: boolean
  images: string[]
  specifications: Record<string, string>
}

interface Category {
  id: number
  name: string
  slug: string
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    sku: '',
    categoryId: '',
    stockQuantity: '',
    isInStock: true,
    images: '',
    specifications: '',
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      setIsAuthenticated(true)
      fetchProducts()
      fetchCategories()
    } else {
      router.push('/admin')
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=100')
      const data = await res.json()
      setProducts(data.products || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      name: formData.name,
      slug: formData.slug || undefined,
      description: formData.description || undefined,
      shortDescription: formData.shortDescription || undefined,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      sku: formData.sku || undefined,
      categoryId: parseInt(formData.categoryId),
      stockQuantity: parseInt(formData.stockQuantity) || 0,
      isInStock: formData.isInStock,
      images: formData.images ? formData.images.split('\n').filter(Boolean) : [],
      specifications: formData.specifications
        ? Object.fromEntries(
            formData.specifications
              .split('\n')
              .filter(Boolean)
              .map((line) => line.split(':').map((s) => s.trim()))
          )
        : {},
    }

    try {
      const token = localStorage.getItem('admin_token')
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      const data = await res.json()
      if (res.ok) {
        setShowProductForm(false)
        setEditingProduct(null)
        resetForm()
        fetchProducts()
        alert(editingProduct ? 'Product updated!' : 'Product created!')
      } else {
        alert('Error: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      alert('Error: ' + error)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      sku: product.sku || '',
      categoryId: product.category.id.toString(),
      stockQuantity: product.stockQuantity.toString(),
      isInStock: product.inStock,
      images: product.images.join('\n'),
      specifications: Object.entries(product.specifications || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n'),
    })
    setShowProductForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        fetchProducts()
        alert('Product deleted!')
      } else {
        alert('Error deleting product')
      }
    } catch (error) {
      alert('Error: ' + error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      price: '',
      originalPrice: '',
      sku: '',
      categoryId: '',
      stockQuantity: '',
      isInStock: true,
      images: '',
      specifications: '',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-primary-600" />
            <h1 className="text-2xl font-bold">Product Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/admin/orders" className="text-gray-600 hover:text-gray-900">
              Orders
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('admin_token')
                router.push('/admin')
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Add Product Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              resetForm()
              setEditingProduct(null)
              setShowProductForm(true)
            }}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>

        {/* Product Form Modal */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowProductForm(false)
                      setEditingProduct(null)
                      resetForm()
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Slug</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="auto-generated"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Short Description</label>
                    <textarea
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Original Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">SKU</label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Category *</label>
                      <select
                        required
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div className="flex items-center pt-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isInStock}
                          onChange={(e) => setFormData({ ...formData, isInStock: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">In Stock</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Images (one URL per line)
                    </label>
                    <textarea
                      value={formData.images}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Specifications (key: value, one per line)
                    </label>
                    <textarea
                      value={formData.specifications}
                      onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Weight: 500g&#10;Origin: Ethiopia&#10;Type: Whole Bean"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                    >
                      <Save className="w-4 h-4" />
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductForm(false)
                        setEditingProduct(null)
                        resetForm()
                      }}
                      className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Products ({products.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{product.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.category.name}</td>
                    <td className="px-6 py-4 text-sm">
                      AED {product.price.toFixed(2)}
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through ml-2">
                          AED {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

