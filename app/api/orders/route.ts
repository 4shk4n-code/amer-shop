import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET all orders (admin) or user's orders
export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = (session.user as any).role === "admin";
    const where = isAdmin ? {} : { userId: (session.user as any).id };

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
    if (!prisma) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

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

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    );
    const tax = cartItems.reduce(
      (sum: number, item: any) => sum + (item.product.tax || 0) * item.quantity,
      0
    );
    const shipping = 0; // You can add shipping calculation logic
    const total = subtotal + tax + shipping;

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

