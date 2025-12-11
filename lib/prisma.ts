import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create PrismaClient with proper configuration for Prisma 7
// Prisma 7 requires either adapter or accelerateUrl when using engine type "client"
// We'll use the DATABASE_URL directly (standard connection)
function createPrismaClient() {
  // During build, we might not have DATABASE_URL, so create a minimal client
  // It will only fail when actually trying to connect
  const options: any = {
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }

  // If we have a Prisma Accelerate URL, use it
  if (process.env.PRISMA_ACCELERATE_URL) {
    options.accelerateUrl = process.env.PRISMA_ACCELERATE_URL
  } else if (process.env.DATABASE_URL) {
    // Standard database connection - Prisma 7 should handle this automatically
    // But we might need to explicitly set it
    options.datasources = {
      db: {
        url: process.env.DATABASE_URL,
      },
    }
  }

  return new PrismaClient(options)
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Export type for use in other files
export type { PrismaClient }

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

