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

  return new PrismaClient(options)
}

// Initialize Prisma client - use singleton pattern to prevent multiple instances
const prismaInstance = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaInstance
}

// Export prisma client
export const prisma = prismaInstance

// Export type for use in other files
export type { PrismaClient }

