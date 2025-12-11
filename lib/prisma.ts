import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Export type for use in other files
export type { PrismaClient }

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

