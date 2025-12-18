import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET user's cart
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: (session.user as any).id,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    // Calculate totals efficiently in a single pass
    let total = 0;
    let itemCount = 0;
    
    for (const item of cartItems) {
      const itemTotal = item.product.price * item.quantity;
      total += itemTotal;
      itemCount += item.quantity;
    }

    return NextResponse.json({
      items: cartItems,
      total: Math.round(total * 100) / 100, // Round to 2 decimal places
      itemCount,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST add item to cart
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    // Input validation
    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const quantityNum = Math.max(1, Math.min(999, parseInt(String(quantity)) || 1));

    // Verify product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Product not found or unavailable" },
        { status: 404 }
      );
    }

    // Check stock availability
    if (product.stock < quantityNum) {
      return NextResponse.json(
        { error: `Only ${product.stock} items available in stock` },
        { status: 400 }
      );
    }

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: (session.user as any).id,
          productId,
        },
      },
      update: {
        quantity: {
          increment: quantityNum,
        },
      },
      create: {
        userId: (session.user as any).id,
        productId,
        quantity: quantityNum,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

// DELETE remove item from cart
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId: (session.user as any).id,
          productId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}

