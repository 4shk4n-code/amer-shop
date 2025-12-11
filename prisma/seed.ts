import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
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

  console.log("✅ Categories seeded");

  // Get category IDs for product creation
  const electronicsCategory = await prisma.category.findUnique({
    where: { slug: "electronics" },
  });
  const homeGardenCategory = await prisma.category.findUnique({
    where: { slug: "home-garden" },
  });
  const automotiveCategory = await prisma.category.findUnique({
    where: { slug: "automotive" },
  });

  // Create featured products (from FeaturedProducts component)
  const featuredProducts = [
    {
      id: "featured-1",
      name: "UHD 75\" TV",
      slug: "uhd-75-tv",
      price: 1615,
      categoryId: electronicsCategory?.id || "",
      description: "Ultra HD 75 inch TV - Premium quality",
      image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (4).jpeg",
      stock: 10,
    },
    {
      id: "featured-2",
      name: "GRASS THINKPAR GMC 50 MM",
      slug: "grass-thinkpar-gmc-50-mm",
      price: 23.08,
      categoryId: homeGardenCategory?.id || "",
      description: "Premium artificial grass, 50mm thickness",
      unit: "PER SQM",
      stock: 100,
    },
    {
      id: "featured-3",
      name: "Brake Pad Segal SP-BP-SE-8860/8865",
      slug: "brake-pad-segal-sp-bp-se-8860-8865",
      price: 49,
      categoryId: automotiveCategory?.id || "",
      description: "(Front) Tucson & Sportage & Sonata",
      image: "/images/car-parts/WhatsApp Image 2025-12-09 at 4.41.54 PM (1).jpeg",
      stock: 25,
    },
    {
      id: "featured-4",
      name: "UHD 55\" TV",
      slug: "uhd-55-tv",
      price: 780,
      categoryId: electronicsCategory?.id || "",
      description: "Ultra HD 55 inch TV",
      image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (9).jpeg",
      stock: 15,
    },
  ];

  // Create flash sale products (from FlashSale component)
  const flashSaleProducts = [
    {
      id: "flash-1",
      name: "FHD 32\" TV",
      slug: "fhd-32-tv",
      price: 270,
      originalPrice: 350,
      categoryId: electronicsCategory?.id || "",
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
      categoryId: homeGardenCategory?.id || "",
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
      categoryId: automotiveCategory?.id || "",
      description: "(Rear) Pars & Samand LX & Renault Megane & Duster",
      image: "/images/car-parts/WhatsApp Image 2025-12-09 at 4.41.56 PM.jpeg",
      stock: 20,
    },
    {
      id: "flash-4",
      name: "FHD 43\" TV",
      slug: "fhd-43-tv",
      price: 408,
      originalPrice: 550,
      categoryId: electronicsCategory?.id || "",
      description: "Full HD 43 inch TV",
      image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (14).jpeg",
      stock: 8,
    },
  ];

  // Create new arrivals (from NewArrivals component)
  const newArrivals = [
    {
      id: "new-1",
      name: "UHD 70\" TV",
      slug: "uhd-70-tv",
      price: 1425,
      categoryId: electronicsCategory?.id || "",
      description: "Ultra HD 70 inch TV - Latest model",
      image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (6).jpeg",
      stock: 12,
    },
    {
      id: "new-2",
      name: "GRASS ALEX MC-3 50 MM",
      slug: "grass-alex-mc-3-50-mm",
      price: 22.43,
      categoryId: homeGardenCategory?.id || "",
      description: "Alex MC-3 artificial grass, 50mm thickness",
      unit: "PER SQM",
      stock: 150,
    },
    {
      id: "new-3",
      name: "Brake Pad Segal SP-BP-SE-6800",
      slug: "brake-pad-segal-sp-bp-se-6800",
      price: 38,
      categoryId: automotiveCategory?.id || "",
      description: "(Rear) 206, 207",
      image: "/images/car-parts/WhatsApp Image 2025-12-09 at 4.41.54 PM (1).jpeg",
      stock: 30,
    },
    {
      id: "new-4",
      name: "FHD 50\" TV",
      slug: "fhd-50-tv",
      price: 628,
      categoryId: electronicsCategory?.id || "",
      description: "Full HD 50 inch TV",
      image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (11).jpeg",
      stock: 10,
    },
  ];

  // Upsert all products
  const allProducts = [...featuredProducts, ...flashSaleProducts, ...newArrivals];
  
  for (const product of allProducts) {
    if (product.categoryId) {
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
  }

  console.log(`✅ ${allProducts.length} products seeded`);

  // Create admin user (you can change the email/password)
  const adminEmail = "admin@amershop.com";
  const adminPassword = "admin123"; // Change this in production!

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // Note: In production, use proper password hashing
    // For now, we'll create the user without password (use Google OAuth or implement proper auth)
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin User",
        role: "admin",
      },
    });
    console.log("✅ Admin user created:", adminEmail);
    console.log("⚠️  Note: Set up Google OAuth or implement password authentication");
  } else {
    console.log("ℹ️  Admin user already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

