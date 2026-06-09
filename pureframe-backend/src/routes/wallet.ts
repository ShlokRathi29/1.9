import { Hono } from 'hono'
import { walletService } from '../services/walletService'
import { requireAuth } from '../middleware/authMiddleware'
const wallet = new Hono()
wallet.get('/', requireAuth, async (c) => {
  const userId = c.get('userId')
  const result = await walletService.getBalance(userId)
  return c.json({ success: true, ...result })
})
export default wallet
