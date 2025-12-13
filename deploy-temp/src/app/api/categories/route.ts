import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const pool = getPool()
    
    const [categories] = await pool.execute(
      `SELECT id, name, slug, description, image, parent_id, sort_order, is_active
       FROM categories
       WHERE is_active = 1
       ORDER BY sort_order ASC, name ASC`
    ) as any[]

    const formattedCategories = categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      parentId: cat.parent_id,
      sortOrder: cat.sort_order,
      isActive: cat.is_active === 1,
    }))

    return NextResponse.json({ categories: formattedCategories })
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories', message: error.message },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const pool = getPool()
    const body = await request.json()

    const { name, slug, description, image, parentId, sortOrder } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const [result] = await pool.execute(
      `INSERT INTO categories (name, slug, description, image, parent_id, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, categorySlug, description || null, image || null, parentId || null, sortOrder || 0]
    ) as any

    return NextResponse.json({ success: true, categoryId: result.insertId }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category', message: error.message },
      { status: 500 }
    )
  }
}

