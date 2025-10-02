// Database connection utility using Prisma
import { PrismaClient } from '@/generated/prisma'

// Global variable to prevent multiple instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create or reuse Prisma client instance
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // Enable query logging in development
  })

// In development, save the instance to prevent hot reload issues
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma