import { z } from 'zod'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email').optional(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number (10 digits)')
    .optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
}).refine((d) => d.email || d.phone, {
  message: 'At least one of email or phone is required',
})

export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
})

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
})

// ─── Browse ───────────────────────────────────────────────────────────────────

export const searchProjectsSchema = z.object({
  city: z.string().min(1, 'City is required'),
  q: z.string().min(1, 'Search query is required'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
})

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(30),
})

// ─── Transactions ─────────────────────────────────────────────────────────────

export const transactionFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  type: z.enum(['Sale', 'Rent', 'Mortgage']).optional(),
  bhk: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  floor: z.coerce.number().int().optional(),
  amountMin: z.coerce.number().optional(),
  amountMax: z.coerce.number().optional(),
})

// ─── Unlock ───────────────────────────────────────────────────────────────────

export const unlockSchema = z.object({
  projectId: z.string().min(1, 'projectId is required'),
})

// ─── Payments ─────────────────────────────────────────────────────────────────

export const createOrderSchema = z.object({
  planId: z.enum(['lite', 'plus', 'premium']),
})

export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
})

// ─── Types inferred from schemas ──────────────────────────────────────────────

export type SignupInput         = z.infer<typeof signupSchema>
export type LoginInput          = z.infer<typeof loginSchema>
export type UpdateUserInput     = z.infer<typeof updateUserSchema>
export type SearchProjectsInput = z.infer<typeof searchProjectsSchema>
export type TransactionFilter   = z.infer<typeof transactionFilterSchema>
export type UnlockInput         = z.infer<typeof unlockSchema>
export type CreateOrderInput    = z.infer<typeof createOrderSchema>
export type VerifyPaymentInput  = z.infer<typeof verifyPaymentSchema>
