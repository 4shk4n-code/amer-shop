// Quick seed using SQLite directly
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');

console.log('📦 Connecting to database at:', dbPath);

const db = new Database(dbPath);

try {
  console.log('🗑️  Clearing existing data...');
  // Disable foreign keys temporarily
  db.exec('PRAGMA foreign_keys = OFF');
  
  // Delete in correct order (child tables first)
  db.exec(`
    DELETE FROM cart_items;
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM products;
    DELETE FROM categories;
  `);
  
  // Re-enable foreign keys
  db.exec('PRAGMA foreign_keys = ON');

  console.log('🌱 Seeding categories...');
  
  const insertCategory = db.prepare(`
    INSERT INTO categories (id, name, slug, description, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  const categories = [
    { id: 'cat-electronics', name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and tech' },
    { id: 'cat-fashion', name: 'Fashion', slug: 'fashion', description: 'Trendy clothing & accessories' },
    { id: 'cat-home-garden', name: 'Home & Garden', slug: 'home-garden', description: 'Everything for your home' },
    { id: 'cat-sports', name: 'Sports', slug: 'sports', description: 'Fitness & outdoor gear' },
    { id: 'cat-automotive', name: 'Automotive', slug: 'automotive', description: 'Parts & accessories for your vehicle' },
    { id: 'cat-toys', name: 'Toys', slug: 'toys', description: 'Fun for all ages' },
  ];

  const insertMany = db.transaction((cats) => {
    for (const cat of cats) {
      insertCategory.run(cat.id, cat.name, cat.slug, cat.description);
    }
  });

  insertMany(categories);
  
  console.log(`✅ Successfully seeded ${categories.length} categories!`);
  console.log('   Categories:', categories.map(c => c.name).join(', '));

} catch (error) {
  console.error('❌ Error seeding database:', error.message);
  process.exit(1);
} finally {
  db.close();
}

console.log('✨ Done!');
