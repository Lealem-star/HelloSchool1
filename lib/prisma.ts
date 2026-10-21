import { PrismaClient } from '@prisma/client'

// Prisma client singleton for Hello Technology Training Center
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

function getClient(): PrismaClient {
  if (
    !globalForPrisma.prisma ||
    !(globalForPrisma.prisma as any).digitalPurchase ||
    !(globalForPrisma.prisma as any).batch
  ) {
    try {
      globalForPrisma.prisma?.$disconnect()
    } catch {}
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}

export const prisma: PrismaClient = new Proxy({} as any, {
  get(_target, prop) {
    const client = getClient()
    const val = (client as any)[prop]
    if (typeof val === 'function') {
      return val.bind(client)
    }
    return val
  },
})

export default prisma
