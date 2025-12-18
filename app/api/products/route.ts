import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));

    const where: any = {
      isActive: true,
    };

    if (category) {
      const categoryRecord = await prisma.category.findUnique({
        where: { slug: category },
      });
      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST create product (admin only)
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      originalPrice,
      image,
      images,
      categoryId,
      stock,
      unit,
      isRefurbished,
      condition,
      tax,
    } = body;

    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return NextResponse.json(
        { error: "Valid price is required" },
        { status: 400 }
      );
    }

    if (!categoryId || typeof categoryId !== 'string') {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Verify category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      );
    }

    // Generate slug from name (handle duplicates)
    let baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    if (!baseSlug) {
      baseSlug = `product-${Date.now()}`;
    }
    
    // Check if slug already exists, if so add a number suffix
    // Limit to 1000 attempts to prevent infinite loops
    let slug = baseSlug;
    let counter = 1;
    const maxAttempts = 1000;
    
    while (counter < maxAttempts) {
      const existing = await prisma.product.findUnique({ 
        where: { slug },
        select: { id: true } // Only select id for performance
      });
      
      if (!existing) {
        break;
      }
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    if (counter >= maxAttempts) {
      // Fallback: use timestamp if we can't find a unique slug
      slug = `${baseSlug}-${Date.now()}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        image,
        images: images ? JSON.stringify(images) : null,
        categoryId,
        stock: parseInt(stock) || 0,
        unit,
        isRefurbished: isRefurbished || false,
        condition,
        tax: tax ? parseFloat(tax) : 0,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

