// Check if DATABASE_URL is valid before running migrations
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.log('⚠️  DATABASE_URL not set. Skipping migrations.');
  process.exit(0);
}

// Check if DATABASE_URL is for PostgreSQL
const isPostgreSQL = dbUrl.startsWith('postgres://') || 
                     dbUrl.startsWith('postgresql://') ||
                     dbUrl.includes('@') ||
                     dbUrl.includes('postgres');

if (isPostgreSQL) {
  console.log('✅ DATABASE_URL is PostgreSQL. Running migrations...');
} else if (dbUrl.startsWith('file:')) {
  console.log('✅ DATABASE_URL is SQLite. Running migrations...');
} else {
  console.log('⚠️  DATABASE_URL format not recognized. Skipping migrations.');
  process.exit(0);
}

// Run migrations
const { execSync } = require('child_process');
try {
  execSync('prisma migrate deploy', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}

