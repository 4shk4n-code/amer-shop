const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

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

    console.log('✅ Categories seeded');

    // Get category IDs
    const electronicsCategory = await prisma.category.findUnique({ where: { slug: "electronics" } });
    const homeGardenCategory = await prisma.category.findUnique({ where: { slug: "home-garden" } });
    const automotiveCategory = await prisma.category.findUnique({ where: { slug: "automotive" } });
    const fashionCategory = await prisma.category.findUnique({ where: { slug: "fashion" } });
    const sportsCategory = await prisma.category.findUnique({ where: { slug: "sports" } });
    const toysCategory = await prisma.category.findUnique({ where: { slug: "toys" } });

    if (!electronicsCategory || !homeGardenCategory || !automotiveCategory || !fashionCategory || !sportsCategory || !toysCategory) {
      throw new Error("Categories not found after creation");
    }

    console.log('✅ Database seeded successfully!');
    console.log(`   - Categories: ${categories.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .then(() => {
    console.log('✨ Seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seed failed:', error);
    process.exit(1);
  });
