import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

// Ensure environment variables are loaded
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config();
  } catch (e) {
    // dotenv might not be available, that's okay
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create PrismaClient with proper configuration for Prisma 7
// Prisma 7 requires an adapter for SQLite, but not for PostgreSQL
function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    throw new Error('DATABASE_URL is required');
  }

  const options: any = {
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }

  // Check if DATABASE_URL is for SQLite (starts with "file:")
  const isSQLite = dbUrl.startsWith('file:');
  
  if (isSQLite) {
    // Extract file path from DATABASE_URL (format: "file:./prisma/dev.db")
    const dbPath = dbUrl.replace(/^file:/, '');
    const absoluteDbPath = dbPath.startsWith('./') 
      ? require('path').join(process.cwd(), dbPath.slice(2))
      : dbPath;

    // Create SQLite adapter for Prisma 7 (only needed for SQLite)
    try {
      const Database = require('better-sqlite3');
      const sqlite = new Database(absoluteDbPath);
      const adapter = new PrismaBetterSqlite3(sqlite);
      options.adapter = adapter;
    } catch (error) {
      console.warn('Failed to create SQLite adapter, trying without adapter:', error);
      // If adapter fails, try without it (might work in some cases)
    }
  } else {
    // For PostgreSQL or other databases, don't use SQLite adapter
    // Prisma will use the standard connection
    // No adapter needed for PostgreSQL
  }

  // Check for Prisma Accelerate URL (multiple possible env var names)
  const accelerateUrl = 
    process.env.PRISMA_ACCELERATE_URL || 
    (process.env.PRISMA_DATABASE_URL?.startsWith('prisma+') ? process.env.PRISMA_DATABASE_URL : null) ||
    (process.env.DATABASE_URL?.includes('accelerate.prisma-data.net') ? process.env.DATABASE_URL : null)

  if (accelerateUrl) {
    // Use Prisma Accelerate instead of adapter
    options.accelerateUrl = accelerateUrl
    // Don't use adapter if using Accelerate
    delete options.adapter
  }

  try {
    return new PrismaClient(options)
  } catch (error) {
    console.error('Error creating PrismaClient:', error);
    throw error;
  }
}

// Create prisma client with error handling
let prismaInstance: PrismaClient | null = null;

// Initialize Prisma client
try {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  DATABASE_URL not found. Prisma client will not be available.');
      console.warn('   Make sure .env file exists with: DATABASE_URL="file:./prisma/dev.db"');
    }
  } else {
    // Try to create PrismaClient
    prismaInstance = globalForPrisma.prisma ?? createPrismaClient();
  }
} catch (error) {
  console.error('❌ Failed to create PrismaClient:', error);
  if (error instanceof Error) {
    console.error('Error message:', error.message);
  }
  prismaInstance = null;
}

// Export prisma - may be null if initialization failed or DATABASE_URL is missing
export const prisma = prismaInstance

// Export type for use in other files
export type { PrismaClient }

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

