import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create PrismaClient with proper configuration for Prisma 7
// Prisma 7 requires either adapter or accelerateUrl when using engine type "client"
function createPrismaClient() {
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
  } else if (process.env.DATABASE_URL) {
    // For SQLite or PostgreSQL, use adapter with DATABASE_URL
    // Prisma 7 reads DATABASE_URL from environment automatically
    // No explicit adapter needed for standard connections
  } else {
    // During build, DATABASE_URL might not be available
    // Create a minimal client that will work for type checking
    // It will fail at runtime if actually used without DATABASE_URL
  }

  return new PrismaClient(options)
}

// Create prisma client with error handling
let prismaInstance: PrismaClient | null = null;

try {
  prismaInstance = globalForPrisma.prisma ?? createPrismaClient();
} catch (error) {
  console.error('Failed to create PrismaClient:', error);
  // Set to null so we can check if it's available
  prismaInstance = null;
}

// Export prisma, but it might be null if initialization failed
export const prisma = prismaInstance as PrismaClient

// Export type for use in other files
export type { PrismaClient }

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

