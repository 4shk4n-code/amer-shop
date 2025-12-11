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

  // Check for Prisma Accelerate URL first (if using Prisma Accelerate)
  if (process.env.PRISMA_ACCELERATE_URL) {
    options.accelerateUrl = process.env.PRISMA_ACCELERATE_URL
  } else if (process.env.DATABASE_URL?.includes('accelerate.prisma-data.net')) {
    // If DATABASE_URL is a Prisma Accelerate URL, use it as accelerateUrl
    options.accelerateUrl = process.env.DATABASE_URL
  } else if (process.env.DATABASE_URL) {
    // Standard PostgreSQL connection - Prisma 7 should handle this via DATABASE_URL
    // But we might need to explicitly provide it to avoid the client engine requirement
    // For standard connections, we don't need adapter or accelerateUrl
    // The DATABASE_URL environment variable should be enough
  }

  // During build, if we don't have DATABASE_URL, create a client that will work
  // It will only fail when actually trying to connect
  try {
    return new PrismaClient(options)
  } catch (error: any) {
    // If PrismaClient construction fails during build, return a proxy
    // This allows the build to continue
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('PrismaClient construction skipped during build')
      return {} as PrismaClient
    }
    throw error
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Export type for use in other files
export type { PrismaClient }

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

