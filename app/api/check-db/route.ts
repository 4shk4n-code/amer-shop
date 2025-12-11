import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simple endpoint to check if database is seeded
export async function GET() {
  try {
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    
    // Get a sample product
    const sampleProduct = await prisma.product.findFirst({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return NextResponse.json({
      success: true,
      products: productCount,
      categories: categoryCount,
      sampleProduct: sampleProduct || null,
      message: productCount > 0 
        ? `Database is seeded! Found ${productCount} products and ${categoryCount} categories.`
        : "Database is empty. Please run the seed endpoint: /api/seed",
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Database connection failed",
        details: error.toString()
      },
      { status: 500 }
    );
  }
}

