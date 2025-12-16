import { PrismaClient } from '@prisma/client'

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

// Create PrismaClient for PostgreSQL
function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    throw new Error('DATABASE_URL is required');
  }

  const options: any = {
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }

  // Check for Prisma Accelerate URL (multiple possible env var names)
  const accelerateUrl = 
    process.env.PRISMA_ACCELERATE_URL || 
    (process.env.PRISMA_DATABASE_URL?.startsWith('prisma+') ? process.env.PRISMA_DATABASE_URL : null) ||
    (process.env.DATABASE_URL?.includes('accelerate.prisma-data.net') ? process.env.DATABASE_URL : null)

  if (accelerateUrl) {
    // Use Prisma Accelerate
    options.accelerateUrl = accelerateUrl
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
      console.warn('   Make sure .env file exists with: DATABASE_URL="your-postgresql-connection-string"');
    }
  } else {
    // Initialize Prisma client for PostgreSQL
    try {
      prismaInstance = globalForPrisma.prisma ?? createPrismaClient();
    } catch (error) {
      console.error('❌ Failed to create PrismaClient:', error);
      prismaInstance = null;
    }
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

