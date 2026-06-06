import { Context } from 'hono'
import { ZodError } from 'zod'
import { env } from '../config/env'

/**
 * Global error handler — use with app.onError()
 * This is Hono's official pattern for catching all thrown errors
 * and returning proper HTTP status codes.
 */
export function globalErrorHandler(err: Error, c: Context) {
  // Log a clean one-liner, not the raw Error object (avoids Bun's noisy stack dump)
  const status = (err as any).status ?? 500
  console.error(`[Error] ${c.req.method} ${c.req.path} → ${status}: ${err.message}`)

  if (err instanceof ZodError) {
    return c.json(
      {
        success: false,
        error: 'Validation error',
        details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      },
      400
    )
  }

  return c.json(
    {
      success: false,
      error: env.isDev() ? err.message : 'Internal server error',
      ...(env.isDev() && { stack: err.stack }),
    },
    status
  )
}

/** Create a typed HTTP error */
export function httpError(message: string, status: number = 400): Error {
  const err = new Error(message) as any
  err.status = status
  return err
}
