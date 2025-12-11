// Type declaration for Prisma Client with custom output path
declare module '@prisma/client' {
  export { PrismaClient } from '../.prisma/client';
  export type * from '../.prisma/client';
}

