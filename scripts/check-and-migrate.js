// Check if DATABASE_URL is valid for SQLite before running migrations
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.log('⚠️  DATABASE_URL not set. Skipping migrations.');
  process.exit(0);
}

if (!dbUrl.startsWith('file:')) {
  console.log('⚠️  DATABASE_URL does not start with "file:" (not SQLite). Skipping migrations.');
  console.log('   This is expected if using PostgreSQL in production.');
  process.exit(0);
}

// DATABASE_URL is valid for SQLite, run migrations
console.log('✅ DATABASE_URL is valid for SQLite. Running migrations...');
const { execSync } = require('child_process');
try {
  execSync('prisma migrate deploy', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}

