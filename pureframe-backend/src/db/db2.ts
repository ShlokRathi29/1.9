import { Pool, PoolClient } from 'pg'
import { env } from '../config/env'
let _pool: Pool | null = null
function getPool(): Pool {
  if (!_pool) {
    if (!env.DB2_URL) {
      throw new Error('DB2_URL is not set. Cannot connect to external database.')
    }
    _pool = new Pool({
      connectionString: env.DB2_URL,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    })
    _pool.on('error', (err) => {
      console.error('[DB2] Unexpected pool error:', err)
    })
  }
  return _pool
}
export async function db2Query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  const pool = getPool()
  const { rows } = await pool.query(sql, params)
  return rows as T[]
}
export async function db2Client(): Promise<PoolClient> {
  return getPool().connect()
}
export async function db2Close(): Promise<void> {
  if (_pool) {
    await _pool.end()
    _pool = null
  }
}
