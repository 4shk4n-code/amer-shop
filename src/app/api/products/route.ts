import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { requireAuth } from '@/lib/middleware-auth'

// GET /api/products - Get all products with filters
export async function GET(request: NextRequest) {
  try {
    const pool = getPool()
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Build base query with subquery for images to avoid GROUP_CONCAT issues
    let baseQuery = `
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `
    const params: any[] = []

    if (category) {
      baseQuery += ' AND c.slug = ?'
      params.push(category)
    }

    if (search) {
      baseQuery += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.short_description LIKE ?)'
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    // Get products with pagination
    // Note: LIMIT and OFFSET must be integers, not placeholders
    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      ${baseQuery}
      ORDER BY p.created_at DESC
      LIMIT ${parseInt(String(limit))} OFFSET ${parseInt(String(offset))}
    `
    const [products] = await pool.execute(query, params) as any[]

    // Get images for each product separately
    if (products.length > 0) {
      const productIds = products.map((p: any) => p.id)
      if (productIds.length > 0) {
        const [images] = await pool.execute(
          `SELECT product_id, image_url, sort_order, is_primary 
           FROM product_images 
           WHERE product_id IN (${productIds.map(() => '?').join(',')})
           ORDER BY product_id, sort_order, is_primary DESC`,
          productIds
        ) as any[]

        // Group images by product_id
        const imagesByProduct: Record<number, string[]> = {}
        images.forEach((img: any) => {
          if (!imagesByProduct[img.product_id]) {
            imagesByProduct[img.product_id] = []
          }
          imagesByProduct[img.product_id].push(img.image_url)
        })

        // Add images to products
        products.forEach((product: any) => {
          product.images = imagesByProduct[product.id] || []
        })
      } else {
        // No products, set empty images array
        products.forEach((product: any) => {
          product.images = []
        })
      }
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total ${baseQuery}`
    const [countResult] = await pool.execute(countQuery, params) as any[]
    const total = countResult[0]?.total || 0

    // Format products
    const formattedProducts = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.short_description,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : null,
      sku: product.sku,
      category: {
        id: product.category_id,
        name: product.category_name,
        slug: product.category_slug,
      },
      stockQuantity: product.stock_quantity,
      inStock: product.is_in_stock === 1,
      rating: parseFloat(product.rating || 0),
      reviewCount: product.review_count || 0,
      images: product.images || [],
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    }))

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { 
        error: 'Failed to fetch products', 
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const user = requireAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const pool = getPool()
    const body = await request.json()

    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      originalPrice,
      sku,
      categoryId,
      stockQuantity,
      isInStock,
      images,
      specifications,
    } = body

    // Validate required fields
    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, categoryId' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Insert product
    const [result] = await pool.execute(
      `INSERT INTO products (
        name, slug, description, short_description, price, original_price, sku,
        category_id, stock_quantity, is_in_stock
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        productSlug,
        description || null,
        shortDescription || null,
        price,
        originalPrice || null,
        sku || null,
        categoryId,
        stockQuantity || 0,
        isInStock !== false ? 1 : 0,
      ]
    ) as any

    const productId = result.insertId

    // Insert images
    if (images && images.length > 0) {
      const imageValues = images.map((img: string, index: number) => [
        productId,
        img,
        null,
        index,
        index === 0 ? 1 : 0,
      ])
      
      await pool.query(
        `INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
         VALUES ?`,
        [imageValues]
      )
    }

    // Insert specifications
    if (specifications && Object.keys(specifications).length > 0) {
      const specValues = Object.entries(specifications).map(([key, value], index) => [
        productId,
        key,
        String(value),
        index,
      ])
      
      await pool.query(
        `INSERT INTO product_specifications (product_id, spec_key, spec_value, sort_order)
         VALUES ?`,
        [specValues]
      )
    }

    return NextResponse.json({ success: true, productId }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product', message: error.message },
      { status: 500 }
    )
  }
}

