import { Context } from 'hono'
import { ZodError } from 'zod'
import { env } from '../config/env'
export function globalErrorHandler(err: Error, c: Context) {
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
export function httpError(message: string, status: number = 400): Error {
  const err = new Error(message) as any
  err.status = status
  return err
}
