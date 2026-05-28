import { PrismaClient } from '@prisma/client'
import { env } from '../config/env'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

// Singleton — reuse in dev to avoid exhausting connections on hot reload
export const prisma: PrismaClient =
  globalThis.__prisma ??
  new PrismaClient({
    log: env.isDev() ? ['query', 'error', 'warn'] : ['error'],
  })

if (env.isDev()) {
  globalThis.__prisma = prisma
}
