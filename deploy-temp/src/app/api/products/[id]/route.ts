import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { requireAuth } from '@/lib/middleware-auth'

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pool = getPool()
    const productId = parseInt(params.id)

    // Get product
    const [products] = await pool.execute(
      `SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? AND p.is_active = 1`,
      [productId]
    ) as any[]

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const product = products[0]

    // Get images
    const [images] = await pool.execute(
      `SELECT image_url, alt_text, is_primary, sort_order
       FROM product_images
       WHERE product_id = ?
       ORDER BY is_primary DESC, sort_order ASC`,
      [productId]
    ) as any[]

    // Get specifications
    const [specs] = await pool.execute(
      `SELECT spec_key, spec_value
       FROM product_specifications
       WHERE product_id = ?
       ORDER BY sort_order ASC`,
      [productId]
    ) as any[]

    const specifications: Record<string, string> = {}
    specs.forEach((spec: any) => {
      specifications[spec.spec_key] = spec.spec_value
    })

    const formattedProduct = {
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
      images: images.map((img: any) => img.image_url),
      specifications,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    }

    return NextResponse.json(formattedProduct)
  } catch (error: any) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product', message: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const productId = parseInt(params.id)
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

    // Update product
    await pool.execute(
      `UPDATE products SET
        name = ?,
        slug = ?,
        description = ?,
        short_description = ?,
        price = ?,
        original_price = ?,
        sku = ?,
        category_id = ?,
        stock_quantity = ?,
        is_in_stock = ?
      WHERE id = ?`,
      [
        name,
        slug,
        description || null,
        shortDescription || null,
        price,
        originalPrice || null,
        sku || null,
        categoryId,
        stockQuantity || 0,
        isInStock !== false ? 1 : 0,
        productId,
      ]
    )

    // Update images (delete old, insert new)
    if (images) {
      await pool.execute('DELETE FROM product_images WHERE product_id = ?', [productId])
      
      if (images.length > 0) {
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
    }

    // Update specifications (delete old, insert new)
    if (specifications) {
      await pool.execute('DELETE FROM product_specifications WHERE product_id = ?', [productId])
      
      if (Object.keys(specifications).length > 0) {
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
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product', message: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const productId = parseInt(params.id)

    await pool.execute('UPDATE products SET is_active = 0 WHERE id = ?', [productId])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product', message: error.message },
      { status: 500 }
    )
  }
}

