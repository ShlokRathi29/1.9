import { Hono } from 'hono'
import { authService } from '../services/authService'
import { requireAuth } from '../middleware/authMiddleware'
import { signupSchema, loginSchema, otpLoginSchema, updateUserSchema } from '../validators/schemas'
const auth = new Hono()
auth.post('/signup', async (c) => {
  const body = await c.req.json()
  const data = signupSchema.parse(body)
  const result = await authService.signup(data)
  return c.json({ success: true, ...result }, 201)
})
auth.post('/login', async (c) => {
  const body = await c.req.json()
  const data = loginSchema.parse(body)
  const result = await authService.login(data)
  return c.json({ success: true, ...result })
})
auth.post('/otp-login', async (c) => {
  const body = await c.req.json()
  const data = otpLoginSchema.parse(body)
  const result = await authService.otpLogin(data)
  return c.json({ success: true, ...result })
})
auth.post('/logout', (c) => c.json({ success: true, message: 'Logged out' }))
auth.get('/me', requireAuth, async (c) => {
  const userId = c.get('userId')
  const user = await authService.getMe(userId)
  return c.json({ success: true, user })
})
auth.put('/me', requireAuth, async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const data = updateUserSchema.parse(body)
  const user = await authService.updateMe(userId, data)
  return c.json({ success: true, user })
})
export default auth
