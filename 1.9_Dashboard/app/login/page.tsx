'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Phone, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAppStore } from '@/lib/store'
import { auth } from '@/lib/api'
import { PureframeLogo } from '@/components/pureframe-logo'

type LoginMethod = 'phone' | 'email'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { setUser, setTokens } = useAppStore()

  // Login method
  const [method, setMethod] = useState<LoginMethod>('phone')

  // Form fields
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const sanitizePhone = (raw: string) => {
    const cleaned = raw.trim().replace(/[\s\-]/g, '')
    if (cleaned.startsWith('+91')) return cleaned.slice(3)
    if (cleaned.startsWith('91') && cleaned.length === 12) return cleaned.slice(2)
    return cleaned
  }

  // Password login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailOrPhone = method === 'phone' ? sanitizePhone(phoneNumber) : email
    if (!emailOrPhone || !password) {
      toast({ title: 'Missing fields', description: 'Please fill in all fields.', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const { token, user } = await auth.login({ emailOrPhone, password })
      localStorage.setItem('pureframe_token', token)
      setUser(user)
      setTokens(user.walletBalance ?? 0)
      toast({ title: 'Welcome back!', description: 'You have been logged in successfully.' })
      router.push('/')
    } catch (err: any) {
      toast({ title: 'Login failed', description: err.message || 'Invalid credentials.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50/30 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-orange-500 bg-orange-50 group-hover:bg-orange-100 transition-colors duration-200">
              <PureframeLogo className="h-7 w-7" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Pureframe Labs</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

          {/* ── Method Toggle (Phone / Email) ── */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setMethod('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                method === 'phone'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Phone className="w-4 h-4" /> Phone
            </button>
            <button
              onClick={() => setMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                method === 'email'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
          </div>

          {/* ── Login Form ── */}
          <form onSubmit={handlePasswordLogin}>
            {/* Input Field */}
            {method === 'phone' ? (
              <div className="mb-5">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                <div className="relative mt-1.5">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium select-none">+91</div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-11 border-gray-300 rounded-xl pl-11 focus:border-orange-400 focus:ring-orange-200"
                    autoComplete="tel"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 h-11 border-gray-300 rounded-xl focus:border-orange-400 focus:ring-orange-200"
                  autoComplete="email"
                />
              </div>
            )}

            {/* Password Field */}
            <div className="mb-5">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-gray-300 rounded-xl pr-11 focus:border-orange-400 focus:ring-orange-200"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold text-base shadow-md shadow-orange-200/50 hover:shadow-lg hover:shadow-orange-300/50 transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Signing in…</span>
              ) : (
                <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>
              )}
            </Button>
          </form>

          {/* ── Divider ── */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-gray-400">or</span></div>
          </div>

          {/* ── Google (coming soon) ── */}
          <Button variant="outline" className="w-full h-11 rounded-xl border-gray-300 font-medium hover:bg-gray-50 transition-all duration-200" disabled>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google (coming soon)
          </Button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
