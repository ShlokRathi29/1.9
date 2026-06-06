import crypto from 'crypto'
import { prisma } from '../db/prisma'
import { walletService } from './walletService'
import { httpError } from '../middleware/errorMiddleware'
import { env } from '../config/env'

// ─── Plans ────────────────────────────────────────────────────────────────────

export const PLANS = {
  lite: {
    id: 'lite',
    name: 'Lite',
    priceINR: 499,
    pricePaise: 49900,
    tokens: 15,
    description: 'Best for sellers',
  },
  plus: {
    id: 'plus',
    name: 'Plus',
    priceINR: 2499,
    pricePaise: 249900,
    tokens: 150,
    description: 'Recommended for brokers and buyers',
    recommended: true,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    priceINR: 9999,
    pricePaise: 999900,
    tokens: 1000,
    description: 'Best for research',
  },
} as const

export type PlanId = keyof typeof PLANS

// ─── Razorpay lazy loader ─────────────────────────────────────────────────────

let _razorpay: any = null

function getRazorpay() {
  if (!_razorpay) {
    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      throw httpError('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.', 503)
    }
    // Dynamic import to avoid crashing when keys are absent
    const Razorpay = require('razorpay')
    _razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    })
  }
  return _razorpay
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const paymentService = {
  getPlans() {
    return Object.values(PLANS)
  },

  async createOrder(userId: string, planId: PlanId) {
    const plan = PLANS[planId]
    if (!plan) throw httpError('Invalid plan', 400)

    const razorpay = getRazorpay()

    const order = await razorpay.orders.create({
      amount: plan.pricePaise,
      currency: 'INR',
      receipt: `zk_${userId.slice(-8)}_${Date.now()}`,  // max 40 chars
      notes: { userId, planId, tokensAdded: plan.tokens },
    })

    // Persist pending record
    await prisma.paymentTransaction.create({
      data: {
        userId,
        razorpayOrderId: order.id,
        amountINR: plan.pricePaise,
        tokensAdded: plan.tokens,
        status: 'PENDING',
      },
    })

    return {
      orderId: order.id,
      amount: plan.pricePaise,
      currency: 'INR',
      planName: plan.name,
      tokensAdded: plan.tokens,
      keyId: env.RAZORPAY_KEY_ID,
    }
  },

  async verifyPayment(
    userId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    // ── HMAC verification (CRITICAL — never skip this) ──────────────────────
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex')

    if (expectedSignature !== razorpaySignature) {
      throw httpError('Payment signature verification failed', 400)
    }

    // Find the pending record
    const payment = await prisma.paymentTransaction.findUnique({
      where: { razorpayOrderId },
    })
    if (!payment) throw httpError('Payment record not found', 404)
    if (payment.userId !== userId) throw httpError('Forbidden', 403)
    if (payment.status === 'SUCCESS') {
      // Idempotent — already processed
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { walletBalance: true } })
      return { alreadyProcessed: true, tokensAdded: payment.tokensAdded, newBalance: user?.walletBalance ?? 0 }
    }

    // ── Update payment record ──────────────────────────────────────────────
    await prisma.paymentTransaction.update({
      where: { razorpayOrderId },
      data: {
        razorpayPaymentId,
        razorpaySignature,
        status: 'SUCCESS',
      },
    })

    // ── Credit wallet ──────────────────────────────────────────────────────
    const { newBalance } = await walletService.credit(
      userId,
      payment.tokensAdded,
      `PURCHASE:${razorpayOrderId}`
    )

    return {
      success: true,
      tokensAdded: payment.tokensAdded,
      newBalance,
    }
  },

  async failPayment(razorpayOrderId: string) {
    await prisma.paymentTransaction.updateMany({
      where: { razorpayOrderId, status: 'PENDING' },
      data: { status: 'FAILED' },
    })
  },
}
