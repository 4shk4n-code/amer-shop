const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');

const db = new Database(dbPath);

try {
  const categories = db.prepare('SELECT name, slug FROM categories').all();
  console.log('✅ Database is working!');
  console.log(`📁 Found ${categories.length} categories:`);
  categories.forEach(cat => {
    console.log(`   - ${cat.name} (${cat.slug})`);
  });
  
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
  console.log(`\n📦 Products in database: ${productCount.count}`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  db.close();
}
