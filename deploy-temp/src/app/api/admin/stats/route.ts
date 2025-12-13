import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { requireAuth } from '@/lib/middleware-auth'

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pool = getPool()

    // Get stats
    const [productStats] = await pool.execute(
      'SELECT COUNT(*) as total, SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active, SUM(CASE WHEN is_in_stock = 0 THEN 1 ELSE 0 END) as out_of_stock FROM products'
    ) as any[]

    const [orderStats] = await pool.execute(
      `SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered,
        SUM(total_amount) as total_revenue
      FROM orders`
    ) as any[]

    const [recentOrders] = await pool.execute(
      `SELECT o.*, COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT 5`
    ) as any[]

    const [topProducts] = await pool.execute(
      `SELECT p.id, p.name, SUM(oi.quantity) as total_sold, SUM(oi.subtotal) as revenue
       FROM products p
       LEFT JOIN order_items oi ON p.id = oi.product_id
       GROUP BY p.id
       ORDER BY total_sold DESC
       LIMIT 5`
    ) as any[]

    return NextResponse.json({
      products: {
        total: productStats[0]?.total || 0,
        active: productStats[0]?.active || 0,
        outOfStock: productStats[0]?.out_of_stock || 0,
      },
      orders: {
        total: orderStats[0]?.total_orders || 0,
        pending: orderStats[0]?.pending || 0,
        processing: orderStats[0]?.processing || 0,
        delivered: orderStats[0]?.delivered || 0,
        revenue: parseFloat(orderStats[0]?.total_revenue || 0),
      },
      recentOrders: recentOrders.map((order: any) => ({
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        totalAmount: parseFloat(order.total_amount),
        status: order.status,
        itemCount: order.item_count,
        createdAt: order.created_at,
      })),
      topProducts: topProducts.map((product: any) => ({
        id: product.id,
        name: product.name,
        totalSold: product.total_sold || 0,
        revenue: parseFloat(product.revenue || 0),
      })),
    })
  } catch (error: any) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats', message: error.message },
      { status: 500 }
    )
  }
}

