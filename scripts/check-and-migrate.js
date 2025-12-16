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

// First, try to resolve any failed migrations before deploying
function resolveFailedMigrations() {
  const migrationsToResolve = ['20251213085201_init'];
  
  for (const migrationName of migrationsToResolve) {
    try {
      // Try marking as applied first (since tables might already exist)
      execSync(`prisma migrate resolve --applied ${migrationName}`, { 
        stdio: 'pipe',
        env: { ...process.env, PRISMA_MIGRATE_SKIP_GENERATE: '1' }
      });
      console.log(`✅ Resolved failed migration: ${migrationName} (marked as applied)`);
      return true;
    } catch (error1) {
      try {
        // If applied fails, try marking as rolled back
        execSync(`prisma migrate resolve --rolled-back ${migrationName}`, { 
          stdio: 'pipe',
          env: { ...process.env, PRISMA_MIGRATE_SKIP_GENERATE: '1' }
        });
        console.log(`✅ Resolved failed migration: ${migrationName} (marked as rolled back)`);
        return true;
      } catch (error2) {
        // Migration might not be in failed state, continue
        continue;
      }
    }
  }
  return false;
}

try {
  // Try to resolve failed migrations first
  resolveFailedMigrations();
  
  // Now deploy migrations
  execSync('prisma migrate deploy', { stdio: 'inherit' });
} catch (error) {
  const errorMessage = error.message || error.toString();
  console.error('❌ Migration failed:', errorMessage);
  
  // Check if the error is about failed migrations or existing tables
  if (errorMessage.includes('failed migrations') || errorMessage.includes('P3009') || 
      errorMessage.includes('P3018') || errorMessage.includes('already exists')) {
    console.log('⚠️  Migration issue detected. Attempting to resolve...');
    
    // If tables already exist, mark migration as applied
    if (errorMessage.includes('already exists')) {
      console.log('ℹ️  Tables already exist. Marking migration as applied...');
      try {
        execSync('prisma migrate resolve --applied 20251213085201_init', { 
          stdio: 'pipe',
          env: { ...process.env, PRISMA_MIGRATE_SKIP_GENERATE: '1' }
        });
        console.log('✅ Marked migration as applied');
        // Retry migration to apply any remaining migrations
        try {
          console.log('🔄 Retrying migrations...');
          execSync('prisma migrate deploy', { stdio: 'inherit' });
        } catch (retryError) {
          console.log('⚠️  Continuing build - remaining migrations may need manual resolution.');
          process.exit(0);
        }
      } catch (resolveError) {
        console.log('⚠️  Could not mark migration as applied. Build will continue.');
        process.exit(0);
      }
    } else {
      // Try to resolve failed migrations
      const resolved = resolveFailedMigrations();
      
      if (resolved) {
        // Retry migration after resolving
        try {
          console.log('🔄 Retrying migrations after resolution...');
          execSync('prisma migrate deploy', { stdio: 'inherit' });
        } catch (retryError) {
          console.error('❌ Migration still failed after resolution attempt.');
          console.log('⚠️  Continuing build - database may already be in correct state.');
          process.exit(0);
        }
      } else {
        console.log('⚠️  Could not automatically resolve migrations. Build will continue.');
        console.log('⚠️  You may need to manually resolve migrations in the database.');
        process.exit(0);
      }
    }
  } else {
    // For other migration errors, continue build
    console.log('⚠️  Continuing build despite migration error...');
    process.exit(0);
  }
}

