import { PrismaClient } from '@prisma/client'

// Prisma client singleton for Hello TVET
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// In development, ensure the cached singleton has newly added models like batch
if (
  process.env.NODE_ENV !== 'production' &&
  globalForPrisma.prisma &&
  !(globalForPrisma.prisma as any).batch
) {
  try {
    globalForPrisma.prisma.$disconnect()
  } catch {}
  globalForPrisma.prisma = undefined
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
