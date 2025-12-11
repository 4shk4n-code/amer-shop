import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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
  const fashionCategory = await prisma.category.findUnique({
    where: { slug: "fashion" },
  });
  const sportsCategory = await prisma.category.findUnique({
    where: { slug: "sports" },
  });
  const toysCategory = await prisma.category.findUnique({
    where: { slug: "toys" },
  });

  // Create featured products (from FeaturedProducts component)
  // Using IDs that match frontend components
  const featuredProducts = [
    {
      id: "tv-uhd-75",
      name: "UHD 75\" TV",
      slug: "tv-uhd-75",
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
      id: "tv-uhd-55",
      name: "UHD 55\" TV",
      slug: "tv-uhd-55",
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
      id: "tv-fhd-32",
      name: "FHD 32\" TV",
      slug: "tv-fhd-32",
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
      id: "tv-fhd-43",
      name: "FHD 43\" TV",
      slug: "tv-fhd-43",
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
      id: "tv-uhd-70",
      name: "UHD 70\" TV",
      slug: "tv-uhd-70",
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
      id: "tv-fhd-50",
      name: "FHD 50\" TV",
      slug: "tv-fhd-50",
      price: 628,
      categoryId: electronicsCategory?.id || "",
      description: "Full HD 50 inch TV",
      image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (11).jpeg",
      stock: 10,
    },
  ];

  // Create category products (from category components)
  const categoryProducts = [
    // Electronics products
    {
      id: "elec-1",
      name: "Wireless Headphones",
      slug: "wireless-headphones",
      price: 99.99,
      categoryId: electronicsCategory?.id || "",
      description: "High-quality wireless headphones with noise cancellation",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      stock: 50,
    },
    {
      id: "elec-2",
      name: "Smart Watch",
      slug: "smart-watch",
      price: 249.99,
      categoryId: electronicsCategory?.id || "",
      description: "Feature-rich smartwatch with health tracking",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      stock: 30,
    },
    {
      id: "elec-3",
      name: "Laptop Stand",
      slug: "laptop-stand",
      price: 49.99,
      categoryId: electronicsCategory?.id || "",
      description: "Ergonomic aluminum laptop stand",
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
      stock: 75,
    },
    {
      id: "elec-4",
      name: "USB-C Hub",
      slug: "usb-c-hub",
      price: 39.99,
      categoryId: electronicsCategory?.id || "",
      description: "Multi-port USB-C hub with HDMI and USB 3.0",
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop",
      stock: 60,
    },
    {
      id: "elec-5",
      name: "Wireless Mouse",
      slug: "wireless-mouse",
      price: 29.99,
      categoryId: electronicsCategory?.id || "",
      description: "Ergonomic wireless mouse with long battery life",
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
      stock: 100,
    },
    {
      id: "elec-6",
      name: "Mechanical Keyboard",
      slug: "mechanical-keyboard",
      price: 129.99,
      categoryId: electronicsCategory?.id || "",
      description: "RGB mechanical keyboard with customizable keys",
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
      stock: 40,
    },
    // Fashion products
    {
      id: "fash-1",
      name: "Cotton T-Shirt",
      slug: "cotton-t-shirt",
      price: 29.99,
      categoryId: fashionCategory?.id || "",
      description: "Comfortable cotton t-shirt in various colors",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      stock: 200,
    },
    {
      id: "fash-2",
      name: "Denim Jacket",
      slug: "denim-jacket",
      price: 79.99,
      categoryId: fashionCategory?.id || "",
      description: "Classic denim jacket with modern fit",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
      stock: 50,
    },
    {
      id: "fash-3",
      name: "Sneakers",
      slug: "sneakers",
      price: 89.99,
      categoryId: fashionCategory?.id || "",
      description: "Comfortable sneakers for everyday wear",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      stock: 80,
    },
    {
      id: "fash-4",
      name: "Leather Belt",
      slug: "leather-belt",
      price: 39.99,
      categoryId: fashionCategory?.id || "",
      description: "Genuine leather belt with classic buckle",
      image: "https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=400&h=400&fit=crop",
      stock: 120,
    },
    {
      id: "fash-5",
      name: "Sunglasses",
      slug: "sunglasses",
      price: 59.99,
      categoryId: fashionCategory?.id || "",
      description: "UV protection sunglasses with stylish frame",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
      stock: 90,
    },
    {
      id: "fash-6",
      name: "Backpack",
      slug: "backpack",
      price: 69.99,
      categoryId: fashionCategory?.id || "",
      description: "Stylish backpack with multiple compartments",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      stock: 70,
    },
    // Sports products
    {
      id: "sport-1",
      name: "Yoga Mat",
      slug: "yoga-mat",
      price: 39.99,
      categoryId: sportsCategory?.id || "",
      description: "Premium non-slip yoga mat",
      image: "https://images.unsplash.com/photo-1601925260368-ae2f83d4875a?w=400&h=400&fit=crop",
      stock: 150,
    },
    {
      id: "sport-2",
      name: "Dumbbell Set",
      slug: "dumbbell-set",
      price: 129.99,
      categoryId: sportsCategory?.id || "",
      description: "Adjustable dumbbell set for home workouts",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      stock: 40,
    },
    {
      id: "sport-3",
      name: "Running Shoes",
      slug: "running-shoes",
      price: 99.99,
      categoryId: sportsCategory?.id || "",
      description: "Lightweight running shoes with cushioning",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      stock: 100,
    },
    {
      id: "sport-4",
      name: "Water Bottle",
      slug: "water-bottle",
      price: 19.99,
      categoryId: sportsCategory?.id || "",
      description: "Insulated stainless steel water bottle",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
      stock: 200,
    },
    {
      id: "sport-5",
      name: "Resistance Bands",
      slug: "resistance-bands",
      price: 24.99,
      categoryId: sportsCategory?.id || "",
      description: "Set of 5 resistance bands for strength training",
      image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=400&fit=crop",
      stock: 180,
    },
    {
      id: "sport-6",
      name: "Basketball",
      slug: "basketball",
      price: 29.99,
      categoryId: sportsCategory?.id || "",
      description: "Official size basketball with grip texture",
      image: "https://images.unsplash.com/photo-1519869325934-21c5bf488f93?w=400&h=400&fit=crop",
      stock: 120,
    },
    // Toys products
    {
      id: "toy-1",
      name: "Building Blocks",
      slug: "building-blocks",
      price: 49.99,
      categoryId: toysCategory?.id || "",
      description: "Educational building blocks for kids",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      stock: 100,
    },
    {
      id: "toy-2",
      name: "Puzzle Set",
      slug: "puzzle-set",
      price: 19.99,
      categoryId: toysCategory?.id || "",
      description: "1000-piece jigsaw puzzle",
      image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop",
      stock: 150,
    },
    {
      id: "toy-3",
      name: "Action Figure",
      slug: "action-figure",
      price: 24.99,
      categoryId: toysCategory?.id || "",
      description: "Collectible action figure with accessories",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop",
      stock: 80,
    },
    {
      id: "toy-4",
      name: "Board Game",
      slug: "board-game",
      price: 34.99,
      categoryId: toysCategory?.id || "",
      description: "Family-friendly board game for all ages",
      image: "https://images.unsplash.com/photo-1606166186956-10f3e5e5e5e5?w=400&h=400&fit=crop",
      stock: 90,
    },
    {
      id: "toy-5",
      name: "Remote Control Car",
      slug: "remote-control-car",
      price: 59.99,
      categoryId: toysCategory?.id || "",
      description: "High-speed remote control car",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      stock: 60,
    },
    {
      id: "toy-6",
      name: "Art Supplies Set",
      slug: "art-supplies-set",
      price: 29.99,
      categoryId: toysCategory?.id || "",
      description: "Complete art supplies set for creative kids",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop",
      stock: 110,
    },
    // Home & Garden products
    {
      id: "home-1",
      name: "Garden Tools Set",
      slug: "garden-tools-set",
      price: 79.99,
      categoryId: homeGardenCategory?.id || "",
      description: "Complete set of essential garden tools",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
      stock: 50,
    },
    {
      id: "home-2",
      name: "Indoor Plant Pot",
      slug: "indoor-plant-pot",
      price: 24.99,
      categoryId: homeGardenCategory?.id || "",
      description: "Decorative ceramic plant pot for indoor plants",
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
      stock: 120,
    },
    {
      id: "home-3",
      name: "LED Desk Lamp",
      slug: "led-desk-lamp",
      price: 34.99,
      categoryId: homeGardenCategory?.id || "",
      description: "Adjustable LED desk lamp with touch control",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
      stock: 80,
    },
    {
      id: "home-4",
      name: "Throw Pillow Set",
      slug: "throw-pillow-set",
      price: 49.99,
      categoryId: homeGardenCategory?.id || "",
      description: "Set of 4 decorative throw pillows",
      image: "https://images.unsplash.com/photo-1584100936596-ca65cf6b889b?w=400&h=400&fit=crop",
      stock: 100,
    },
    {
      id: "home-5",
      name: "Wall Clock",
      slug: "wall-clock",
      price: 39.99,
      categoryId: homeGardenCategory?.id || "",
      description: "Modern minimalist wall clock",
      image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=400&fit=crop",
      stock: 70,
    },
    {
      id: "home-6",
      name: "Storage Basket",
      slug: "storage-basket",
      price: 19.99,
      categoryId: homeGardenCategory?.id || "",
      description: "Woven storage basket for organization",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      stock: 150,
    },
  ];

  // Upsert all products
  const allProducts = [...featuredProducts, ...flashSaleProducts, ...newArrivals, ...categoryProducts];
  
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
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin User",
        role: "admin",
        password: hashedPassword,
      },
    });
    console.log("✅ Admin user created:", adminEmail);
    console.log("🔑 Password:", adminPassword);
  } else {
    // Update existing admin with password if they don't have one
    if (!existingAdmin.password) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.user.update({
        where: { email: adminEmail },
        data: { password: hashedPassword },
      });
      console.log("✅ Admin password set:", adminEmail);
      console.log("🔑 Password:", adminPassword);
    } else {
      console.log("ℹ️  Admin user already exists with password");
    }
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

