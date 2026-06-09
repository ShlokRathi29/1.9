import { Hono } from 'hono'
import { unlockService } from '../services/unlockService'
import { requireAuth } from '../middleware/authMiddleware'
import { unlockSchema } from '../validators/schemas'
const unlock = new Hono()
unlock.post('/', requireAuth, async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const { projectId } = unlockSchema.parse(body)
  const result = await unlockService.unlock(userId, projectId)
  return c.json({ success: true, ...result })
})
unlock.get('/status/:projectId', requireAuth, async (c) => {
  const userId = c.get('userId')
  const projectId = c.req.param('projectId')
  const status = await unlockService.getStatus(userId, projectId)
  return c.json({ success: true, ...status })
})
export default unlock
