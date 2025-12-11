// Use dynamic require to load Prisma Client from custom location
// @ts-ignore
const { PrismaClient } = require('../node_modules/.prisma/client')

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Export type for use in other files
export type { PrismaClient }

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

