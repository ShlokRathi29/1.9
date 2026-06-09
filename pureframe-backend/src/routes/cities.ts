import { Hono } from 'hono'
import { projectService } from '../services/projectService'
import { paginationSchema } from '../validators/schemas'
const cities = new Hono()
cities.get('/', async (c) => {
  const data = await projectService.getCities()
  return c.json({ success: true, data })
})
cities.get('/:cityId/localities', async (c) => {
  const cityId = c.req.param('cityId')
  const query = paginationSchema.parse(Object.fromEntries(new URL(c.req.url).searchParams))
  const result = await projectService.getCityLocalities(cityId, query.page, query.limit)
  return c.json({ success: true, ...result })
})
export default cities
