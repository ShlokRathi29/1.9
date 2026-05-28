import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { env } from './config/env'
import { globalErrorHandler } from './middleware/errorMiddleware'

// ── Routes ────────────────────────────────────────────────────────────────────
import authRoutes    from './routes/auth'
import cityRoutes    from './routes/cities'
import locationRoutes from './routes/locations'
import projectRoutes from './routes/projects'
import unlockRoutes  from './routes/unlock'
import walletRoutes  from './routes/wallet'
import paymentRoutes from './routes/payments'

// ── App ───────────────────────────────────────────────────────────────────────

const app = new Hono()

// ── Global Middleware ─────────────────────────────────────────────────────────

app.use('*', logger())
app.use('*', secureHeaders())
app.use('*', cors({
  origin: [env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

// ── Global Error Handler (Hono's official pattern) ───────────────────────────
app.onError(globalErrorHandler)

// ── Health check ──────────────────────────────────────────────────────────────

app.get('/', (c) => c.json({
  name: 'Zapkey Backend',
  version: '1.0.0',
  status: 'ok',
  timestamp: new Date().toISOString(),
}))

app.get('/api/v1/health', (c) => c.json({
  status: 'ok',
  db1: 'connected',       // TODO: add real DB ping
  db2: env.DB2_URL ? 'configured' : 'not configured (using mock)',
  timestamp: new Date().toISOString(),
}))

// ── API Routes ────────────────────────────────────────────────────────────────

app.route('/api/v1/auth',       authRoutes)
app.route('/api/v1/user',       authRoutes)    // /user/me aliases
app.route('/api/v1/cities',     cityRoutes)
app.route('/api/v1/localities', locationRoutes)
app.route('/api/v1/projects',   projectRoutes)
app.route('/api/v1/unlock',     unlockRoutes)
app.route('/api/v1/wallet',     walletRoutes)
app.route('/api/v1/payments',   paymentRoutes)

// ── 404 handler ───────────────────────────────────────────────────────────────

app.notFound((c) => c.json({ success: false, error: `Route not found: ${c.req.method} ${c.req.path}` }, 404))

// ── Start ─────────────────────────────────────────────────────────────────────

console.log(`\n🚀 Zapkey Backend starting on port ${env.PORT}`)
console.log(`   ENV: ${env.NODE_ENV}`)
console.log(`   DB2: ${env.DB2_URL ? 'configured' : 'mock mode (no DB2_URL)'}`)
console.log(`   Razorpay: ${env.RAZORPAY_KEY_ID ? 'configured' : 'not configured'}`)
console.log(`   CORS origin: ${env.FRONTEND_URL}\n`)

export default {
  port: env.PORT,
  fetch: app.fetch,
}
