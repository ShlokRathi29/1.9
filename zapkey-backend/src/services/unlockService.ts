import { prisma } from '../db/prisma'
import { walletService } from './walletService'
import { httpError } from '../middleware/errorMiddleware'

const UNLOCK_DURATION_DAYS = 15
const TOKENS_PER_UNLOCK = 1

export const unlockService = {
  async getStatus(userId: string, projectId: string) {
    const record = await prisma.unlockedProject.findUnique({
      where: { userId_projectId: { userId, projectId } },
    })

    if (!record) {
      return { isUnlocked: false }
    }

    const now = new Date()
    if (record.expiresAt < now) {
      // Expired — delete the stale record
      await prisma.unlockedProject.delete({
        where: { userId_projectId: { userId, projectId } },
      })
      return { isUnlocked: false }
    }

    const msRemaining = record.expiresAt.getTime() - now.getTime()
    const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24))

    return {
      isUnlocked: true,
      unlockedAt: record.unlockedAt.toISOString(),
      expiresAt: record.expiresAt.toISOString(),
      daysRemaining,
    }
  },

  async unlock(userId: string, projectId: string) {
    // Check if already unlocked and valid
    const existing = await this.getStatus(userId, projectId)
    if (existing.isUnlocked) {
      return {
        alreadyUnlocked: true,
        expiresAt: existing.expiresAt,
        daysRemaining: existing.daysRemaining,
      }
    }

    // Debit tokens
    const { newBalance } = await walletService.debit(
      userId,
      TOKENS_PER_UNLOCK,
      `UNLOCK:${projectId}`
    )

    // Record unlock with 15-day expiry
    const now = new Date()
    const expiresAt = new Date(now.getTime() + UNLOCK_DURATION_DAYS * 24 * 60 * 60 * 1000)

    await prisma.unlockedProject.upsert({
      where: { userId_projectId: { userId, projectId } },
      create: { userId, projectId, unlockedAt: now, expiresAt },
      update: { unlockedAt: now, expiresAt }, // re-unlock extends the window
    })

    return {
      success: true,
      alreadyUnlocked: false,
      expiresAt: expiresAt.toISOString(),
      daysRemaining: UNLOCK_DURATION_DAYS,
      remainingTokens: newBalance,
    }
  },

  async getUnlockedProjectIds(userId: string): Promise<string[]> {
    const now = new Date()
    const records = await prisma.unlockedProject.findMany({
      where: { userId, expiresAt: { gt: now } },
      select: { projectId: true },
    })
    return records.map((r) => r.projectId)
  },
}
