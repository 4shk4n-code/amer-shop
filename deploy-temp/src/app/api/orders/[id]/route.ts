import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { requireAuth } from '@/lib/middleware-auth'

// GET /api/orders/[id] - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pool = getPool()
    const orderId = parseInt(params.id)

    // Check authentication (admin or customer)
    const authHeader = request.headers.get('authorization')
    let userId: number | null = null
    let isAdmin = false

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const { verifyToken } = await import('@/lib/auth')
      const token = authHeader.substring(7)
      const payload = verifyToken(token)
      if (payload) {
        userId = payload.id
        isAdmin = payload.role === 'admin'
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    ) as any[]

    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orders[0]

    // If customer, verify they own this order
    if (!isAdmin && order.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const [items] = await pool.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    ) as any[]

    return NextResponse.json({
      order: {
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
        notes: order.notes,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      },
      items: items.map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        productPrice: parseFloat(item.product_price),
        quantity: item.quantity,
        subtotal: parseFloat(item.subtotal),
      })),
    })
  } catch (error: any) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order', message: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pool = getPool()
    const orderId = parseInt(params.id)
    const body = await request.json()

    const { status, paymentStatus } = body

    if (status) {
      await pool.execute(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, orderId]
      )
    }

    if (paymentStatus) {
      await pool.execute(
        'UPDATE orders SET payment_status = ? WHERE id = ?',
        [paymentStatus, orderId]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order', message: error.message },
      { status: 500 }
    )
  }
}

