import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Route to update product images
export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json(
        { 
          error: "Database not available. Please check DATABASE_URL environment variable.",
        },
        { status: 500 }
      );
    }

    const results = [];

    // Update Yoga Mat
    let sportsCategory = await prisma.category.findUnique({
      where: { slug: 'sports' },
    });

    if (!sportsCategory) {
      sportsCategory = await prisma.category.create({
        data: {
          name: 'Sports',
          slug: 'sports',
          description: 'Sports & fitness equipment',
        },
      });
    }

    // Use working image URLs - using picsum.photos for reliable placeholder images
    // You can replace these with your own image URLs later
    const yogaMatImage = 'https://picsum.photos/800/800?random=2';
    const yogaMat = await prisma.product.upsert({
      where: { slug: 'yoga-mat' },
      update: {
        image: yogaMatImage,
        isActive: true,
      },
      create: {
        id: 'sport-1',
        name: 'Yoga Mat',
        slug: 'yoga-mat',
        price: 39.99,
        categoryId: sportsCategory.id,
        description: 'Premium non-slip yoga mat',
        image: yogaMatImage,
        stock: 150,
        isActive: true,
      },
    });
    results.push({ name: yogaMat.name, slug: yogaMat.slug, image: yogaMat.image });

    // Update Board Game
    let toysCategory = await prisma.category.findUnique({
      where: { slug: 'toys' },
    });

    if (!toysCategory) {
      toysCategory = await prisma.category.create({
        data: {
          name: 'Toys',
          slug: 'toys',
          description: 'Toys & games',
        },
      });
    }

    // Use a working board game image URL
    // Using picsum.photos with a specific seed for consistency
    const boardGameImage = 'https://picsum.photos/seed/boardgame/800/800';
    const boardGame = await prisma.product.upsert({
      where: { slug: 'board-game' },
      update: {
        image: boardGameImage,
        isActive: true,
      },
      create: {
        id: 'toy-1',
        name: 'Board Game',
        slug: 'board-game',
        price: 29.99,
        categoryId: toysCategory.id,
        description: 'Family-friendly board game for all ages',
        image: boardGameImage,
        stock: 50,
        isActive: true,
      },
    });
    results.push({ name: boardGame.name, slug: boardGame.slug, image: boardGame.image });

    return NextResponse.json({ 
      success: true, 
      message: 'Products updated successfully',
      products: results
    });
  } catch (error) {
    console.error('Error updating products:', error);
    return NextResponse.json(
      { 
        error: "Failed to update products",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

