import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Lazy initialization - only create PrismaClient when actually needed
function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  // Only create PrismaClient if DATABASE_URL is available (not during build)
  if (!process.env.DATABASE_URL) {
    // Return a proxy that will fail gracefully during build
    return {} as PrismaClient
  }

  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }

  return prisma
}

export const prisma = getPrismaClient()

// Export type for use in other files
export type { PrismaClient }

