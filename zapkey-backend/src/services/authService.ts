import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../db/prisma'
import { env } from '../config/env'
import { httpError } from '../middleware/errorMiddleware'
import type { SignupInput, LoginInput, UpdateUserInput } from '../validators/schemas'

function signToken(userId: string, email?: string | null): string {
  return jwt.sign({ userId, email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  })
}

export const authService = {
  async signup(data: SignupInput) {
    // Check uniqueness
    if (data.email) {
      const existing = await prisma.user.findUnique({ where: { email: data.email } })
      if (existing) throw httpError('Email already in use', 409)
    }
    if (data.phone) {
      const existing = await prisma.user.findUnique({ where: { phone: data.phone } })
      if (existing) throw httpError('Phone number already in use', 409)
    }

    const passwordHash = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email ?? null,
        phone: data.phone ?? null,
        passwordHash,
        walletBalance: 5, // 5 free tokens on signup
      },
      select: { id: true, name: true, email: true, phone: true, walletBalance: true, createdAt: true },
    })

    // Log the welcome credit
    await prisma.walletTransaction.create({
      data: {
        userId: user.id,
        type: 'CREDIT',
        amount: 5,
        balanceAfter: 5,
        reference: 'WELCOME_BONUS',
      },
    })

    const token = signToken(user.id, user.email)
    return { token, user }
  },

  async login(data: LoginInput) {
    const isEmail = data.emailOrPhone.includes('@')
    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: data.emailOrPhone }
        : { phone: data.emailOrPhone },
    })

    if (!user || !user.passwordHash) {
      throw httpError('Invalid credentials', 401)
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash)
    if (!valid) throw httpError('Invalid credentials', 401)

    const token = signToken(user.id, user.email)
    const { passwordHash: _, ...safeUser } = user
    return { token, user: safeUser }
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, walletBalance: true, createdAt: true },
    })
    if (!user) throw httpError('User not found', 404)
    return user
  },

  async updateMe(userId: string, data: UpdateUserInput) {
    if (data.email) {
      const conflict = await prisma.user.findFirst({
        where: { email: data.email, NOT: { id: userId } },
      })
      if (conflict) throw httpError('Email already in use', 409)
    }
    if (data.phone) {
      const conflict = await prisma.user.findFirst({
        where: { phone: data.phone, NOT: { id: userId } },
      })
      if (conflict) throw httpError('Phone already in use', 409)
    }

    return prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, phone: true, walletBalance: true },
    })
  },
}
