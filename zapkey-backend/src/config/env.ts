/**
 * Centralised env config — throws at startup if required vars are missing.
 */

function requireEnv(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing required environment variable: ${key}`)
  return val
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback
}

export const env = {
  DATABASE_URL:        requireEnv('DATABASE_URL'),
  DB2_URL:             optionalEnv('DB2_URL', ''),
  JWT_SECRET:          requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN:      optionalEnv('JWT_EXPIRES_IN', '7d'),
  RAZORPAY_KEY_ID:     optionalEnv('RAZORPAY_KEY_ID', ''),
  RAZORPAY_KEY_SECRET: optionalEnv('RAZORPAY_KEY_SECRET', ''),
  PORT:                parseInt(optionalEnv('PORT', '3001'), 10),
  NODE_ENV:            optionalEnv('NODE_ENV', 'development'),
  FRONTEND_URL:        optionalEnv('FRONTEND_URL', 'http://localhost:3000'),
  isDev():             boolean { return this.NODE_ENV === 'development' },
  isProd():            boolean { return this.NODE_ENV === 'production' },
}
