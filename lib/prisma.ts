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
    // Standard PostgreSQL connection
    // For Prisma 7, we might need to use the standard connection differently
    // Try without explicit options first - Prisma should read DATABASE_URL from env
  } else {
    // During build, DATABASE_URL might not be available
    // Create a minimal client that will work for type checking
    // It will fail at runtime if actually used without DATABASE_URL
  }

  return new PrismaClient(options)
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Export type for use in other files
export type { PrismaClient }

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

