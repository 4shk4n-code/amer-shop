// Use dynamic require to load Prisma Client
// @ts-ignore - Prisma Client location
const { PrismaClient } = require('../.prisma/client')

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Export type for use in other files
export type { PrismaClient }

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

