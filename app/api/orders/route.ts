import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET all orders (admin) or user's orders
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    const isAdmin = (session.user as any).role === "admin";
    const where: any = isAdmin ? {} : { userId: (session.user as any).id };

    // If searching by order ID (admin only)
    if (orderId && isAdmin) {
      where.id = { startsWith: orderId };
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST create order
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
    } = body;

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: (session.user as any).id,
      },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate totals efficiently in a single pass
    let subtotal = 0;
    let tax = 0;
    
    for (const item of cartItems) {
      const itemSubtotal = item.product.price * item.quantity;
      const itemTax = (item.product.tax || 0) * item.quantity;
      subtotal += itemSubtotal;
      tax += itemTax;
    }
    
    // Round to 2 decimal places
    subtotal = Math.round(subtotal * 100) / 100;
    tax = Math.round(tax * 100) / 100;
    const shipping = 0; // You can add shipping calculation logic
    const total = Math.round((subtotal + tax + shipping) * 100) / 100;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: (session.user as any).id,
        total,
        subtotal,
        tax,
        shipping,
        paymentMethod,
        shippingAddress,
        billingAddress,
        notes,
        items: {
          create: cartItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: {
        userId: (session.user as any).id,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

