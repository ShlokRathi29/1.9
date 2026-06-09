const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1'
function redirectToLogin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pureframe_token')
    window.location.href = '/login'
  }
}
const AUTH_REDIRECT_PATHS = ['/user/me', '/auth/']
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('pureframe_token') : null
  const { headers: optionHeaders, ...restOptions } = options ?? {}
  const res = await fetch(`${BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(optionHeaders instanceof Headers
        ? Object.fromEntries(optionHeaders.entries())
        : (optionHeaders as Record<string, string>) ?? {}),
    },
  })
  if (res.status === 401) {
    const shouldRedirect = AUTH_REDIRECT_PATHS.some((p) => path.includes(p))
    if (shouldRedirect) {
      redirectToLogin()
    }
    const body = await res.json().catch(() => ({ error: 'Unauthorized' }))
    const err: any = new Error(body.error || body.message || 'Unauthorized')
    err.status = 401
    throw err
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    const err: any = new Error(body.error || body.message || `API error ${res.status}`)
    err.status = res.status
    throw err
  }
  return res.json()
}
export const auth = {
  signup: (data: { name: string; email?: string; phone?: string; password: string; phoneToken?: string; emailToken?: string }) =>
    apiFetch<{ token: string; user: any }>('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { emailOrPhone: string; password: string }) =>
    apiFetch<{ token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  otpLogin: (data: { identifier: string; otpToken: string }) =>
    apiFetch<{ token: string; user: any }>('/auth/otp-login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => apiFetch<{ user: any }>('/user/me'),
}
export const browse = {
  getCities: () => apiFetch<{ data: any[] }>('/cities'),
  getCityLocalities: (cityId: string, page = 1, limit = 30) =>
    apiFetch<{ data: any[]; total: number; pages: number }>(`/cities/${cityId}/localities?page=${page}&limit=${limit}`),
  getLocalityProjects: (localityId: string, page = 1, limit = 30) =>
    apiFetch<{ data: any[]; total: number; pages: number }>(`/localities/${localityId}/projects?page=${page}&limit=${limit}`),
  searchProjects: (city: string, q: string, page = 1, limit = 10) =>
    apiFetch<{ data: any[]; total: number; pages: number }>(
      `/projects/search?city=${encodeURIComponent(city)}&q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`
    ),
}
export const projects = {
  getDetail: (projectId: string) => apiFetch<any>(`/projects/${projectId}`),
  getTransactions: (projectId: string, page = 1, filters?: Record<string, string>) => {
    const params = new URLSearchParams({ page: String(page), limit: '10', ...(filters ?? {}) })
    return apiFetch<{ data: any[]; total: number; pages: number; isUnlocked: boolean }>(
      `/projects/${projectId}/transactions?${params}`
    )
  },
}
export const unlock = {
  unlockProject: (projectId: string) =>
    apiFetch<{ success: boolean; expiresAt: string; daysRemaining: number; remainingTokens: number }>('/unlock', {
      method: 'POST',
      body: JSON.stringify({ projectId }),
    }),
  getStatus: (projectId: string) =>
    apiFetch<{ isUnlocked: boolean; expiresAt?: string; daysRemaining?: number }>(
      `/unlock/status/${projectId}`
    ),
}
export const wallet = {
  getBalance: () => apiFetch<{ balance: number; transactions: any[] }>('/wallet'),
}
export const payments = {
  createOrder: (planId: string) =>
    apiFetch<{ orderId: string; amount: number; currency: string; keyId: string; tokensAdded: number }>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    }),
  verifyPayment: (data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) =>
    apiFetch<{ success: boolean; tokensAdded: number; newBalance: number }>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
