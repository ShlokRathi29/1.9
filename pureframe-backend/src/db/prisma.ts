import { PrismaClient } from '@prisma/client'
import { env } from '../config/env'
declare global {
  var __prisma: PrismaClient | undefined
}
export const prisma: PrismaClient =
  globalThis.__prisma ??
  new PrismaClient({
    log: env.isDev() ? ['query', 'error', 'warn'] : ['error'],
  })
if (env.isDev()) {
  globalThis.__prisma = prisma
}
