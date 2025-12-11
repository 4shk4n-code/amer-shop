// Use webpack alias configured in next.config.js to resolve @prisma/client
// @ts-ignore - Webpack alias resolves to custom Prisma location
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Export type for use in other files
export type { PrismaClient }

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

