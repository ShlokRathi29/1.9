import { Context, Next } from 'hono'
import { verify } from 'jsonwebtoken'
import { env } from '../config/env'

export interface JwtPayload {
  userId: string
  email?: string
  iat: number
  exp: number
}

declare module 'hono' {
  interface ContextVariableMap {
    userId: string
    jwtPayload: JwtPayload
  }
}

/** Require a valid Bearer JWT. Sets c.var.userId. */
export async function requireAuth(c: Context, next: Next) {
  const header = c.req.header('Authorization')
  if (!header || !header.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  const token = header.slice(7)
  try {
    const payload = verify(token, env.JWT_SECRET) as JwtPayload
    c.set('userId', payload.userId)
    c.set('jwtPayload', payload)
    await next()
  } catch {
    return c.json({ success: false, error: 'Invalid or expired token' }, 401)
  }
}

/** Optional auth — sets userId if token present, but does not block. */
export async function optionalAuth(c: Context, next: Next) {
  const header = c.req.header('Authorization')
  if (header?.startsWith('Bearer ')) {
    try {
      const payload = verify(header.slice(7), env.JWT_SECRET) as JwtPayload
      c.set('userId', payload.userId)
      c.set('jwtPayload', payload)
    } catch {
      // ignore invalid tokens for optional auth
    }
  }
  await next()
}
