import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// GET /api/products/[id]/reviews - Get reviews for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pool = getPool()
    const productId = parseInt(params.id)

    const [reviews] = await pool.execute(
      `SELECT 
        r.*,
        u.first_name,
        u.last_name,
        u.email
      FROM product_reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ? AND r.is_approved = 1
      ORDER BY r.created_at DESC`,
      [productId]
    ) as any[]

    const formattedReviews = reviews.map((review: any) => ({
      id: review.id,
      productId: review.product_id,
      userId: review.user_id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      isVerifiedPurchase: review.is_verified_purchase === 1,
      helpfulCount: review.helpful_count,
      author: {
        name: `${review.first_name || ''} ${review.last_name || ''}`.trim() || 'Anonymous',
        email: review.email,
      },
      createdAt: review.created_at,
    }))

    return NextResponse.json({ reviews: formattedReviews })
  } catch (error: any) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews', message: error.message },
      { status: 500 }
    )
  }
}

// POST /api/products/[id]/reviews - Create a review
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pool = getPool()
    const productId = parseInt(params.id)

    // Check authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload || payload.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { rating, title, comment } = body

    // Validate
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if user already reviewed this product
    const [existing] = await pool.execute(
      'SELECT id FROM product_reviews WHERE user_id = ? AND product_id = ?',
      [payload.id, productId]
    ) as any[]

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 409 }
      )
    }

    // Check if user purchased this product (for verified purchase)
    const [purchases] = await pool.execute(
      `SELECT COUNT(*) as count
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'delivered'`,
      [payload.id, productId]
    ) as any[]

    const isVerifiedPurchase = purchases[0]?.count > 0

    // Insert review
    const [result] = await pool.execute(
      `INSERT INTO product_reviews (product_id, user_id, rating, title, comment, is_verified_purchase)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [productId, payload.id, rating, title || null, comment || null, isVerifiedPurchase ? 1 : 0]
    ) as any

    // Update product rating and review count
    const [ratingStats] = await pool.execute(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
       FROM product_reviews
       WHERE product_id = ? AND is_approved = 1`,
      [productId]
    ) as any[]

    if (ratingStats && ratingStats.length > 0) {
      await pool.execute(
        'UPDATE products SET rating = ?, review_count = ? WHERE id = ?',
        [
          parseFloat(ratingStats[0].avg_rating || 0),
          ratingStats[0].review_count || 0,
          productId
        ]
      )
    }

    return NextResponse.json({
      success: true,
      reviewId: result.insertId,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review', message: error.message },
      { status: 500 }
    )
  }
}

