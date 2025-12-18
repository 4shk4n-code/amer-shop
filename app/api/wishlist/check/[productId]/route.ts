import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET check if product is in user's wishlist
export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ inWishlist: false });
    }

    const { productId } = params;

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json({ inWishlist: false });
    }

    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: (session.user as any).id,
          productId,
        },
      },
    });

    return NextResponse.json({ inWishlist: !!wishlistItem });
  } catch (error: any) {
    console.error("Error checking wishlist:", error);
    return NextResponse.json({ inWishlist: false });
  }
}

