// Re-export PrismaClient from custom output location using require
const { PrismaClient } = require('../node_modules/.prisma/client');
export { PrismaClient };
export type { PrismaClient as PrismaClientType } from '../node_modules/.prisma/client';

