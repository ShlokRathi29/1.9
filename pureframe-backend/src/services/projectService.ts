/**
 * projectService — reads from DB2 (external, read-only).
 * All functions have TODO comments showing where real DB2 SQL goes.
 * Until DB2 is available, mock data is returned so the API is functional.
 */
import { db2Query } from '../db/db2'
import { env } from '../config/env'
import type { TransactionFilter } from '../validators/schemas'

// ─── Mock data (remove when DB2 is connected) ─────────────────────────────────

const MOCK_CITIES = [
  { id: '1', name: 'Mumbai',    localities_count: 180 },
  { id: '2', name: 'Pune',      localities_count: 282 },
  { id: '3', name: 'Bangalore', localities_count: 215 },
  { id: '4', name: 'Hyderabad', localities_count: 198 },
  { id: '5', name: 'Chennai',   localities_count: 176 },
  { id: '6', name: 'Noida',     localities_count: 145 },
  { id: '7', name: 'Delhi',     localities_count: 210 },
  { id: '8', name: 'Ahmedabad', localities_count: 134 },
]

const MOCK_LOCALITIES = [
  { id: '1-1',  city_id: '2', name: 'Wagholi',           sale_count: 5506 },
  { id: '1-2',  city_id: '2', name: 'Hinjewadi',         sale_count: 4190 },
  { id: '1-3',  city_id: '2', name: 'Hadapsar',          sale_count: 3741 },
  { id: '1-4',  city_id: '2', name: 'Moshi',             sale_count: 3561 },
  { id: '1-5',  city_id: '2', name: 'Tathawade',         sale_count: 3445 },
  { id: '1-6',  city_id: '2', name: 'Wakad',             sale_count: 3437 },
  { id: '1-7',  city_id: '2', name: 'Chikhali',          sale_count: 3163 },
  { id: '1-8',  city_id: '2', name: 'Charholi Budruk',   sale_count: 2797 },
  { id: '1-9',  city_id: '2', name: 'Kiwale',            sale_count: 2724 },
  { id: '1-10', city_id: '2', name: 'Baner',             sale_count: 2628 },
  { id: '1-11', city_id: '2', name: 'Ravet',             sale_count: 2506 },
  { id: '1-12', city_id: '2', name: 'Kharadi',           sale_count: 2486 },
  { id: '1-13', city_id: '2', name: 'Bavdhan',           sale_count: 1960 },
  { id: '1-14', city_id: '2', name: 'Chakan',            sale_count: 1850 },
  { id: '1-15', city_id: '2', name: 'Undri',             sale_count: 1804 },
  { id: '1-16', city_id: '2', name: 'Ambegaon Budruk',   sale_count: 1639 },
  { id: '1-17', city_id: '2', name: 'Balewadi',          sale_count: 1593 },
  { id: '1-18', city_id: '2', name: 'Kondhwa',           sale_count: 1487 },
  { id: '1-19', city_id: '2', name: 'Kothrud',           sale_count: 1424 },
  { id: '1-20', city_id: '2', name: 'Punawale',          sale_count: 3651 },
  { id: '2-1',  city_id: '1', name: 'Thane',             sale_count: 4200 },
  { id: '2-2',  city_id: '1', name: 'Andheri',           sale_count: 3800 },
  { id: '3-1',  city_id: '3', name: 'Whitefield',        sale_count: 5100 },
  { id: '3-2',  city_id: '3', name: 'Electronic City',   sale_count: 4300 },
]

const MOCK_PROJECTS = [
  { id: '1',  locality_id: '1-1',  name: 'Geras Island of Joy',          sale_count: 520,  is_rera: true,  developer: 'Geras Group',        rera_numbers: ['P52100012345'] },
  { id: '2',  locality_id: '1-1',  name: 'VI Yashwin Enchante Phase 1',  sale_count: 433,  is_rera: true,  developer: 'VI Realty',           rera_numbers: ['P52100023456'] },
  { id: '3',  locality_id: '1-1',  name: 'Flamante By VTP Luxe Phase 1', sale_count: 258,  is_rera: true,  developer: 'VTP Realty',          rera_numbers: ['P52100034567'] },
  { id: '7',  locality_id: '1-2',  name: 'Kolte Patil Life Republic',    sale_count: 1540, is_rera: true,  developer: 'Kolte Patil',         rera_numbers: ['P52100002646', 'P52100005460'] },
  { id: '8',  locality_id: '1-2',  name: 'The Gale at Godrej Park World',sale_count: 851,  is_rera: true,  developer: 'Godrej Properties',   rera_numbers: ['P52100045678'] },
  { id: '9',  locality_id: '1-2',  name: 'Paranjape Blue Ridge',         sale_count: 540,  is_rera: true,  developer: 'Paranjape Schemes',   rera_numbers: ['P52100056789'] },
  { id: '13', locality_id: '1-12', name: 'Geras Trinity Towers',         sale_count: 616,  is_rera: true,  developer: 'Geras Group',         rera_numbers: ['P52100067890', 'P52100078901'] },
  { id: '14', locality_id: '1-12', name: 'Kohinoor Flamante',            sale_count: 280,  is_rera: true,  developer: 'Kohinoor Group',      rera_numbers: ['P52100089012'] },
  { id: '15', locality_id: '1-12', name: 'Vilas Javdekar Paloma',        sale_count: 195,  is_rera: false, developer: 'Vilas Javdekar',      rera_numbers: [] },
]

const MOCK_TRANSACTIONS = [
  { id: '1',  project_id: '13', project_name: 'Geras Trinity Towers', date: '17 Mar, 2026', type: 'Sale',     floor_tower: '14, II', unit: '1506', amount_lakhs: 92.50 },
  { id: '2',  project_id: '13', project_name: 'Geras Trinity Towers', date: '16 Mar, 2026', type: 'Mortgage', floor_tower: '-',      unit: '1407', amount_lakhs: 65.00 },
  { id: '3',  project_id: '13', project_name: 'Geras Trinity Towers', date: '9 Feb, 2026',  type: 'Rent',     floor_tower: '8',      unit: '1-805',amount_lakhs: 0.28  },
  { id: '4',  project_id: '13', project_name: 'Geras Trinity Towers', date: '5 Feb, 2026',  type: 'Sale',     floor_tower: '6, I',   unit: '601',  amount_lakhs: 78.00 },
  { id: '5',  project_id: '13', project_name: 'Geras Trinity Towers', date: '20 Jan, 2026', type: 'Rent',     floor_tower: '5',      unit: '1-505',amount_lakhs: 0.25  },
  { id: '6',  project_id: '1',  project_name: 'Geras Island of Joy',  date: '8 Oct, 2025',  type: 'Sale',     floor_tower: '2',      unit: '201',  amount_lakhs: 49.50 },
  { id: '7',  project_id: '7',  project_name: 'Kolte Patil Life Republic', date: '5 Nov, 2025', type: 'Sale', floor_tower: '5',  unit: '501',  amount_lakhs: 68.50 },
  { id: '8',  project_id: '7',  project_name: 'Kolte Patil Life Republic', date: '12 Nov, 2025',type: 'Sale', floor_tower: '6',  unit: '603',  amount_lakhs: 71.00 },
  { id: '9',  project_id: '9',  project_name: 'Paranjape Blue Ridge',  date: '1 Dec, 2025',  type: 'Sale',     floor_tower: '2',      unit: '205',  amount_lakhs: 62.75 },
  { id: '10', project_id: '13', project_name: 'Geras Trinity Towers',  date: '3 Jan, 2026',  type: 'Sale',     floor_tower: '9, III', unit: '904',  amount_lakhs: 88.00 },
]

// ─── Service ──────────────────────────────────────────────────────────────────

function useMock(): boolean {
  return !env.DB2_URL
}

export const projectService = {
  async getCities() {
    if (useMock()) return MOCK_CITIES

    // TODO: replace with real DB2 query
    // return db2Query('SELECT id, name, localities_count FROM cities ORDER BY name')
    return MOCK_CITIES
  },

  async getCityLocalities(cityId: string, page: number, limit: number) {
    if (useMock()) {
      const rows = MOCK_LOCALITIES.filter((l) => l.city_id === cityId)
        .sort((a, b) => b.sale_count - a.sale_count)
      const total = rows.length
      const data = rows.slice((page - 1) * limit, page * limit)
      return { data, total, pages: Math.ceil(total / limit) }
    }

    // TODO: replace with real DB2 query
    // const rows = await db2Query(
    //   'SELECT id, name, sale_count FROM localities WHERE city_id = $1 ORDER BY sale_count DESC LIMIT $2 OFFSET $3',
    //   [cityId, limit, (page - 1) * limit]
    // )
    const rows = MOCK_LOCALITIES.filter((l) => l.city_id === cityId)
      .sort((a, b) => b.sale_count - a.sale_count)
    const total = rows.length
    const data = rows.slice((page - 1) * limit, page * limit)
    return { data, total, pages: Math.ceil(total / limit) }
  },

  async getLocalityProjects(localityId: string, page: number, limit: number) {
    if (useMock()) {
      const rows = MOCK_PROJECTS.filter((p) => p.locality_id === localityId)
        .sort((a, b) => b.sale_count - a.sale_count)
      const total = rows.length
      const data = rows.slice((page - 1) * limit, page * limit)
      return { data, total, pages: Math.ceil(total / limit) }
    }

    // TODO: replace with real DB2 query
    // const rows = await db2Query(
    //   'SELECT id, name, sale_count, is_rera, developer FROM projects WHERE locality_id = $1 ORDER BY sale_count DESC LIMIT $2 OFFSET $3',
    //   [localityId, limit, (page - 1) * limit]
    // )
    const rows = MOCK_PROJECTS.filter((p) => p.locality_id === localityId)
      .sort((a, b) => b.sale_count - a.sale_count)
    const total = rows.length
    const data = rows.slice((page - 1) * limit, page * limit)
    return { data, total, pages: Math.ceil(total / limit) }
  },

  async searchProjects(city: string, q: string, page: number, limit: number) {
    // Helper: join project with locality + city names for URL building
    const enrich = (p: typeof MOCK_PROJECTS[number]) => {
      const locality = MOCK_LOCALITIES.find((l) => l.id === p.locality_id)
      const cityObj  = MOCK_CITIES.find((c) => c.id === locality?.city_id)
      return {
        ...p,
        locality_name: locality?.name ?? '',
        city_name: cityObj?.name ?? '',
      }
    }

    if (useMock()) {
      const rows = MOCK_PROJECTS
        .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
        .map(enrich)
      const total = rows.length
      const data = rows.slice((page - 1) * limit, page * limit)
      return { data, total, pages: Math.ceil(total / limit) }
    }

    // TODO: replace with real DB2 query (join with localities + cities for city filter)
    // const rows = await db2Query(
    //   `SELECT p.id, p.name, p.sale_count, p.is_rera, l.name AS locality_name, c.name AS city_name
    //    FROM projects p JOIN localities l ON p.locality_id = l.id
    //    JOIN cities c ON l.city_id = c.id
    //    WHERE c.id = $1 AND p.name ILIKE $2
    //    ORDER BY p.sale_count DESC LIMIT $3 OFFSET $4`,
    //   [city, `%${q}%`, limit, (page - 1) * limit]
    // )
    const rows = MOCK_PROJECTS
      .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
      .map(enrich)
    const total = rows.length
    const data = rows.slice((page - 1) * limit, page * limit)
    return { data, total, pages: Math.ceil(total / limit) }
  },

  async getProjectById(projectId: string) {
    if (useMock()) {
      return MOCK_PROJECTS.find((p) => p.id === projectId) ?? null
    }

    // TODO: replace with real DB2 query (fetch full project details)
    // const [project] = await db2Query('SELECT * FROM projects WHERE id = $1', [projectId])
    return MOCK_PROJECTS.find((p) => p.id === projectId) ?? null
  },

  async getProjectTransactions(projectId: string, filters: TransactionFilter) {
    if (useMock()) {
      let rows = MOCK_TRANSACTIONS.filter((t) => t.project_id === projectId)
      if (filters.type) rows = rows.filter((t) => t.type === filters.type)
      const total = rows.length
      const data = rows.slice(
        (filters.page - 1) * filters.limit,
        filters.page * filters.limit
      )
      return { data, total, pages: Math.ceil(total / filters.limit) }
    }

    // TODO: replace with real DB2 query
    // Build dynamic SQL based on filters
    // const clauses: string[] = ['project_id = $1']
    // const params: any[] = [projectId]
    // if (filters.type) { clauses.push(`type = $${params.length + 1}`); params.push(filters.type) }
    // ...etc
    let rows = MOCK_TRANSACTIONS.filter((t) => t.project_id === projectId)
    if (filters.type) rows = rows.filter((t) => t.type === filters.type)
    const total = rows.length
    const data = rows.slice(
      (filters.page - 1) * filters.limit,
      filters.page * filters.limit
    )
    return { data, total, pages: Math.ceil(total / filters.limit) }
  },
}
