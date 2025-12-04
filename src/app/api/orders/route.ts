import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const pool = getPool()
    const body = await request.json()

    // Check if customer is authenticated
    let userId = null
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const { verifyToken } = await import('@/lib/auth')
      const token = authHeader.substring(7)
      const payload = verifyToken(token)
      if (payload && payload.role === 'customer') {
        userId = payload.id
      }
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      totalAmount,
      paymentMethod,
      notes,
    } = body

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Start transaction
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
      // Insert order
      const [orderResult] = await connection.execute(
        `INSERT INTO orders (
          order_number, user_id, customer_name, customer_email, customer_phone,
          shipping_address, total_amount, payment_method, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderNumber,
          userId,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          totalAmount,
          paymentMethod || 'cash_on_delivery',
          notes || null,
        ]
      ) as any

      const orderId = orderResult.insertId

      // Insert order items
      const itemValues = items.map((item: any) => [
        orderId,
        item.productId,
        item.productName,
        item.price,
        item.quantity,
        item.price * item.quantity,
      ])

      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, subtotal)
         VALUES ?`,
        [itemValues]
      )

      // Update product stock
      for (const item of items) {
        await connection.execute(
          'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
          [item.quantity, item.productId]
        )
      }

      await connection.commit()
      connection.release()

      return NextResponse.json(
        {
          success: true,
          orderId,
          orderNumber,
        },
        { status: 201 }
      )
    } catch (error) {
      await connection.rollback()
      connection.release()
      throw error
    }
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order', message: error.message },
      { status: 500 }
    )
  }
}

// GET /api/orders - Get all orders (admin only)
export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    const { verifyToken } = await import('@/lib/auth')
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pool = getPool()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const [orders] = await pool.execute(
      `SELECT 
        o.*,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?`,
      [limit, offset]
    ) as any[]

    // Get total count
    const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM orders') as any[]
    const total = countResult[0]?.total || 0

    const formattedOrders = orders.map((order: any) => ({
      id: order.id,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      shippingAddress: order.shipping_address,
      totalAmount: parseFloat(order.total_amount),
      status: order.status,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      itemCount: order.item_count,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    }))

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders', message: error.message },
      { status: 500 }
    )
  }
}

