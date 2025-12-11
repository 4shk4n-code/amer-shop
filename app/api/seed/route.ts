import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Shared seed function
async function seedDatabase() {
  // Use the existing prisma instance (already properly configured)
  
  // Create categories
  const categories = [
    { name: "Electronics", slug: "electronics", description: "Latest gadgets and tech" },
    { name: "Fashion", slug: "fashion", description: "Trendy clothing & accessories" },
    { name: "Home & Garden", slug: "home-garden", description: "Everything for your home" },
    { name: "Sports", slug: "sports", description: "Fitness & outdoor gear" },
    { name: "Automotive", slug: "automotive", description: "Parts & accessories for your vehicle" },
    { name: "Toys", slug: "toys", description: "Fun for all ages" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  // Get category IDs
  const electronicsCategory = await prisma.category.findUnique({
    where: { slug: "electronics" },
  });
  const homeGardenCategory = await prisma.category.findUnique({
    where: { slug: "home-garden" },
  });
  const automotiveCategory = await prisma.category.findUnique({
    where: { slug: "automotive" },
  });

    if (!electronicsCategory || !homeGardenCategory || !automotiveCategory) {
      throw new Error("Categories not found");
    }

    // Products matching frontend component IDs
    const products = [
      // Featured
      {
        id: "tv-uhd-75",
        name: "UHD 75\" TV",
        slug: "tv-uhd-75",
        price: 1615,
        categoryId: electronicsCategory.id,
        description: "Ultra HD 75 inch TV - Premium quality",
        image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (4).jpeg",
        stock: 10,
      },
      {
        id: "featured-2",
        name: "GRASS THINKPAR GMC 50 MM",
        slug: "grass-thinkpar-gmc-50-mm",
        price: 23.08,
        categoryId: homeGardenCategory.id,
        description: "Premium artificial grass, 50mm thickness",
        unit: "PER SQM",
        stock: 100,
      },
      {
        id: "featured-3",
        name: "Brake Pad Segal SP-BP-SE-8860/8865",
        slug: "brake-pad-segal-sp-bp-se-8860-8865",
        price: 49,
        categoryId: automotiveCategory.id,
        description: "(Front) Tucson & Sportage & Sonata",
        image: "/images/car-parts/WhatsApp Image 2025-12-09 at 4.41.54 PM (1).jpeg",
        stock: 25,
      },
      {
        id: "tv-uhd-55",
        name: "UHD 55\" TV",
        slug: "tv-uhd-55",
        price: 780,
        categoryId: electronicsCategory.id,
        description: "Ultra HD 55 inch TV",
        image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (9).jpeg",
        stock: 15,
      },
      // Flash Sale
      {
        id: "tv-fhd-32",
        name: "FHD 32\" TV",
        slug: "tv-fhd-32",
        price: 270,
        originalPrice: 350,
        categoryId: electronicsCategory.id,
        description: "Full HD 32 inch TV - Limited stock",
        image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (15).jpeg",
        stock: 5,
      },
      {
        id: "flash-2",
        name: "GRASS ECO 22 MM",
        slug: "grass-eco-22-mm",
        price: 9.23,
        originalPrice: 12.5,
        categoryId: homeGardenCategory.id,
        description: "Eco-friendly artificial grass, 22mm thickness",
        unit: "PER SQM",
        stock: 200,
      },
      {
        id: "flash-3",
        name: "Brake Pad Segal SP-BP-SE-8500",
        slug: "brake-pad-segal-sp-bp-se-8500",
        price: 29,
        originalPrice: 39,
        categoryId: automotiveCategory.id,
        description: "(Rear) Pars & Samand LX & Renault Megane & Duster",
        image: "/images/car-parts/WhatsApp Image 2025-12-09 at 4.41.56 PM.jpeg",
        stock: 20,
      },
      {
        id: "tv-fhd-43",
        name: "FHD 43\" TV",
        slug: "tv-fhd-43",
        price: 408,
        originalPrice: 550,
        categoryId: electronicsCategory.id,
        description: "Full HD 43 inch TV",
        image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (14).jpeg",
        stock: 8,
      },
      // New Arrivals
      {
        id: "tv-uhd-70",
        name: "UHD 70\" TV",
        slug: "tv-uhd-70",
        price: 1425,
        categoryId: electronicsCategory.id,
        description: "Ultra HD 70 inch TV - Latest model",
        image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (6).jpeg",
        stock: 12,
      },
      {
        id: "new-2",
        name: "GRASS ALEX MC-3 50 MM",
        slug: "grass-alex-mc-3-50-mm",
        price: 22.43,
        categoryId: homeGardenCategory.id,
        description: "Alex MC-3 artificial grass, 50mm thickness",
        unit: "PER SQM",
        stock: 150,
      },
      {
        id: "new-3",
        name: "Brake Pad Segal SP-BP-SE-6800",
        slug: "brake-pad-segal-sp-bp-se-6800",
        price: 38,
        categoryId: automotiveCategory.id,
        description: "(Rear) 206, 207",
        image: "/images/car-parts/WhatsApp Image 2025-12-09 at 4.41.54 PM (1).jpeg",
        stock: 30,
      },
      {
        id: "tv-fhd-50",
        name: "FHD 50\" TV",
        slug: "tv-fhd-50",
        price: 628,
        categoryId: electronicsCategory.id,
        description: "Full HD 50 inch TV",
        image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (11).jpeg",
        stock: 10,
      },
    ];

  for (const product of products) {
    await prisma.product.upsert({
        where: { id: product.id },
        update: {
          name: product.name,
          slug: product.slug,
          price: product.price,
          originalPrice: (product as any).originalPrice || null,
          description: product.description,
          image: product.image || null,
          categoryId: product.categoryId,
          stock: product.stock,
          unit: product.unit || null,
        },
        create: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          originalPrice: (product as any).originalPrice || null,
          description: product.description,
          image: product.image || null,
          categoryId: product.categoryId,
          stock: product.stock,
          unit: product.unit || null,
        },
      });
    }

  // Create/update admin user
  const adminEmail = "admin@amershop.com";
  const adminPassword = "admin123";
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin User",
        role: "admin",
        password: hashedPassword,
      },
    });
  } else if (!existingAdmin.password) {
    // Update existing admin with password if they don't have one
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.update({
      where: { email: adminEmail },
      data: { password: hashedPassword },
    });
  }

  // Don't disconnect - we're using the shared prisma instance
  // await prisma.$disconnect(); // Don't disconnect shared instance

  return {
    success: true,
    message: `Seeded ${products.length} products and ${categories.length} categories. Admin: ${adminEmail} / ${adminPassword}`,
  };
}

// GET handler - works from browser
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    
    // In production, require a secret (but make it optional for now)
    if (process.env.NODE_ENV === "production" && secret !== process.env.SEED_SECRET && !process.env.SEED_SECRET) {
      // If no SEED_SECRET is set, allow it (for initial setup)
    } else if (process.env.NODE_ENV === "production" && secret !== process.env.SEED_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized. Add ?secret=YOUR_SECRET to the URL." },
        { status: 401 }
      );
    }

    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}

// POST handler - works from API calls
export async function POST(request: Request) {
  try {
    // Check for secret key (optional security)
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    
    // In production, require a secret (but make it optional for now)
    if (process.env.NODE_ENV === "production" && secret !== process.env.SEED_SECRET && !process.env.SEED_SECRET) {
      // If no SEED_SECRET is set, allow it (for initial setup)
    } else if (process.env.NODE_ENV === "production" && secret !== process.env.SEED_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized. Secret key required." },
        { status: 401 }
      );
    }

    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}

