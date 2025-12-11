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

