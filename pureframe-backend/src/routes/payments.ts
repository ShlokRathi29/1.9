import { Hono } from 'hono'
import { paymentService } from '../services/paymentService'
import { requireAuth } from '../middleware/authMiddleware'
import { createOrderSchema, verifyPaymentSchema } from '../validators/schemas'
import type { PlanId } from '../services/paymentService'
const payments = new Hono()
payments.get('/plans', (c) => {
  const plans = paymentService.getPlans()
  return c.json({ success: true, plans })
})
payments.post('/create-order', requireAuth, async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const { planId } = createOrderSchema.parse(body)
  const result = await paymentService.createOrder(userId, planId as PlanId)
  return c.json({ success: true, ...result })
})
payments.post('/verify', requireAuth, async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = verifyPaymentSchema.parse(body)
  const result = await paymentService.verifyPayment(userId, razorpayOrderId, razorpayPaymentId, razorpaySignature)
  return c.json({ success: true, ...result })
})
payments.post('/webhook', async (c) => {
  const body = await c.req.json()
  const event = body?.event
  if (event === 'payment.failed') {
    const orderId = body?.payload?.payment?.entity?.order_id
    if (orderId) await paymentService.failPayment(orderId)
  }
  return c.json({ success: true })
})
export default payments
