import { Hono } from 'hono'
import { projectService } from '../services/projectService'
import { paginationSchema } from '../validators/schemas'

const locations = new Hono()

// GET /api/v1/localities/:localityId/projects
locations.get('/:localityId/projects', async (c) => {
  const localityId = c.req.param('localityId')
  const query = paginationSchema.parse(Object.fromEntries(new URL(c.req.url).searchParams))
  const result = await projectService.getLocalityProjects(localityId, query.page, query.limit)
  return c.json({ success: true, ...result })
})

export default locations
