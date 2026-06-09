import { Hono } from 'hono'
import { projectService } from '../services/projectService'
import { unlockService } from '../services/unlockService'
import { requireAuth, optionalAuth } from '../middleware/authMiddleware'
import { searchProjectsSchema, transactionFilterSchema } from '../validators/schemas'
import { httpError } from '../middleware/errorMiddleware'
const projects = new Hono()
projects.get('/search', async (c) => {
  const query = searchProjectsSchema.parse(Object.fromEntries(new URL(c.req.url).searchParams))
  const result = await projectService.searchProjects(query.city, query.q, query.page, query.limit)
  return c.json({ success: true, ...result })
})
projects.get('/:projectId', optionalAuth, async (c) => {
  const projectId = c.req.param('projectId')
  const userId = c.get('userId') as string | undefined
  const project = await projectService.getProjectById(projectId)
  if (!project) throw httpError('Project not found', 404)
  if (userId) {
    const unlockStatus = await unlockService.getStatus(userId, projectId)
    if (unlockStatus.isUnlocked) {
      return c.json({
        success: true,
        project,
        unlockStatus: { isUnlocked: true, expiresAt: unlockStatus.expiresAt, daysRemaining: unlockStatus.daysRemaining },
      })
    }
  }
  const { rera_numbers: _, developer: __, ...summary } = project as any
  return c.json({
    success: true,
    project: {
      id: project.id,
      name: project.name,
      sale_count: project.sale_count,
      is_rera: project.is_rera,
    },
    requiresUnlock: true,
    unlockStatus: { isUnlocked: false },
  })
})
projects.get('/:projectId/transactions', optionalAuth, async (c) => {
  const projectId = c.req.param('projectId')
  const userId = c.get('userId') as string | undefined
  const filters = transactionFilterSchema.parse(Object.fromEntries(new URL(c.req.url).searchParams))
  const project = await projectService.getProjectById(projectId)
  if (!project) throw httpError('Project not found', 404)
  const result = await projectService.getProjectTransactions(projectId, filters)
  const isUnlocked = userId
    ? (await unlockService.getStatus(userId, projectId)).isUnlocked
    : false
  const maskedData = result.data.map((t: any) => ({
    ...t,
    amount_lakhs: isUnlocked ? t.amount_lakhs : null,
    amount_display: isUnlocked ? `₹ ${t.amount_lakhs} Lac` : null,
    locked: !isUnlocked,
  }))
  return c.json({ success: true, data: maskedData, total: result.total, pages: result.pages, isUnlocked })
})
export default projects
