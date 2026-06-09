import { prisma } from '../db/prisma'
import { httpError } from '../middleware/errorMiddleware'
export const walletService = {
  async getBalance(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    })
    if (!user) throw httpError('User not found', 404)
    const transactions = await prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    return { balance: user.walletBalance, transactions }
  },
    async debit(userId: string, amount: number, reference: string) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { walletBalance: true },
      })
      if (!user) throw httpError('User not found', 404)
      if (user.walletBalance < amount) {
        throw httpError('Insufficient token balance', 402)
      }
      const newBalance = user.walletBalance - amount
      await tx.user.update({
        where: { id: userId },
        data: { walletBalance: newBalance },
      })
      const walletTx = await tx.walletTransaction.create({
        data: {
          userId,
          type: 'DEBIT',
          amount: -amount,
          balanceAfter: newBalance,
          reference,
        },
      })
      return { newBalance, walletTx }
    })
  },
    async credit(userId: string, amount: number, reference: string) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { increment: amount } },
        select: { walletBalance: true },
      })
      const walletTx = await tx.walletTransaction.create({
        data: {
          userId,
          type: 'CREDIT',
          amount,
          balanceAfter: user.walletBalance,
          reference,
        },
      })
      return { newBalance: user.walletBalance, walletTx }
    })
  },
}
