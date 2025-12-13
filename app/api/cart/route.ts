import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET user's cart
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

    const total = cartItems.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    );

    return NextResponse.json({
      items: cartItems,
      total,
      itemCount: cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0),
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
    const { productId, quantity = 1 } = body;

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: (session.user as any).id,
          productId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        userId: (session.user as any).id,
        productId,
        quantity,
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

