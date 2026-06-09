'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Phone, Loader2, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAppStore } from '@/lib/store'
import { auth } from '@/lib/api'
import { PureframeLogo } from '@/components/pureframe-logo'

const WIDGET_ID = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID || ''
const TOKEN_AUTH = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH || ''

declare global {
  interface Window {
    initSendOTP?: (config: any) => void
  }
}

type LoginMethod = 'phone' | 'email'
type LoginMode = 'otp' | 'password'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { setUser, setTokens } = useAppStore()

  // Login method & mode
  const [method, setMethod] = useState<LoginMethod>('phone')
  const [mode, setMode] = useState<LoginMode>('otp')

  // Form fields
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // OTP state
  const [otpStep, setOtpStep] = useState(false)
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [otpSending, setOtpSending] = useState(false)
  const [otpVerifying, setOtpVerifying] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [otpError, setOtpError] = useState('')

  // MSG91 refs
  const msg91Methods = useRef<any>(null)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Load MSG91 script
  useEffect(() => {
    const urls = [
      'https://verify.msg91.com/otp-provider.js',
      'https://verify.phone91.com/otp-provider.js'
    ]
    if (document.querySelector(`script[src="${urls[0]}"]`) || document.querySelector(`script[src="${urls[1]}"]`)) return
    let i = 0
    function attempt() {
      const s = document.createElement('script')
      s.src = urls[i]
      s.async = true
      s.onerror = () => { i++; if (i < urls.length) attempt() }
      document.head.appendChild(s)
    }
    attempt()
  }, [])

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const sanitizePhone = (raw: string) => {
    const cleaned = raw.trim().replace(/[\s\-]/g, '')
    if (cleaned.startsWith('+91')) return cleaned.slice(3)
    if (cleaned.startsWith('91') && cleaned.length === 12) return cleaned.slice(2)
    return cleaned
  }

  const getIdentifier = () => {
    if (method === 'phone') {
      const phone = sanitizePhone(phoneNumber)
      if (!/^\d{10}$/.test(phone)) {
        toast({ title: 'Invalid phone', description: 'Please enter a valid 10-digit mobile number.', variant: 'destructive' })
        return null
      }
      return { identifier: phone, msg91Id: `91${phone}` }
    } else {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast({ title: 'Invalid email', description: 'Please enter a valid email address.', variant: 'destructive' })
        return null
      }
      return { identifier: email, msg91Id: email }
    }
  }

  // Send OTP
  const sendOTP = useCallback(() => {
    const id = getIdentifier()
    if (!id) return

    setOtpStep(true)
    setOtpCode(['', '', '', '', '', ''])
    setOtpError('')
    setOtpSending(true)

    if (!window.initSendOTP) {
      toast({ title: 'Service loading', description: 'OTP service is still loading. Please wait a moment.', variant: 'destructive' })
      setOtpSending(false)
      setOtpStep(false)
      return
    }

    const timeoutId = setTimeout(() => {
      setOtpError('timeout')
      setOtpSending(false)
    }, 60000)

    window.initSendOTP({
      widgetId: WIDGET_ID,
      tokenAuth: TOKEN_AUTH,
      identifier: id.msg91Id,
      exposeMethods: true,
      success: async (data: any) => {
        clearTimeout(timeoutId)
        if ((window as any).vTimeoutRef) clearTimeout((window as any).vTimeoutRef)
        // OTP verified successfully by MSG91 — now log in via backend
        setOtpVerifying(false)
        setOtpSending(false)
        setLoading(true)
        try {
          const { token, user } = await auth.otpLogin({ identifier: id.identifier, otpToken: data.message })
          localStorage.setItem('pureframe_token', token)
          setUser(user)
          setTokens(user.walletBalance ?? 0)
          toast({ title: 'Welcome back!', description: 'You have been logged in successfully.' })
          router.push('/')
        } catch (err: any) {
          toast({ title: 'Login failed', description: err.message || 'Could not log in.', variant: 'destructive' })
        } finally {
          setLoading(false)
        }
      },
      failure: (error: any) => {
        clearTimeout(timeoutId)
        if ((window as any).vTimeoutRef) clearTimeout((window as any).vTimeoutRef)
        setOtpError(error?.message || 'Verification failed. Please try again.')
        setOtpVerifying(false)
        setOtpSending(false)
      },
      getRetryMethods: (methods: any) => {
        clearTimeout(timeoutId)
        msg91Methods.current = methods
        setOtpSending(false)
        setCountdown(30)
        setTimeout(() => otpInputRefs.current[0]?.focus(), 200)
      }
    })

    // Failsafe to show OTP inputs
    setTimeout(() => {
      setOtpSending((prev) => {
        if (prev) {
          setCountdown(30)
          setTimeout(() => otpInputRefs.current[0]?.focus(), 200)
          return false
        }
        return prev
      })
    }, 8000)
  }, [phoneNumber, email, method, toast, router, setUser, setTokens])

  // Verify OTP
  const verifyOTP = useCallback(() => {
    if (otpVerifying) return
    const code = otpCode.join('')
    if (code.length < 4) {
      setOtpError('Please enter the complete OTP.')
      return
    }
    setOtpVerifying(true)
    setOtpError('')

    const vTimeout = setTimeout(() => {
      setOtpVerifying(false)
      setOtpError('Verification timed out. Please try again.')
    }, 15000)
    ;(window as any).vTimeoutRef = vTimeout

    const verifyFn = msg91Methods.current?.verifyOtp || (window as any).verifyOtp
    if (verifyFn) {
      verifyFn(code)
    } else {
      setOtpVerifying(false)
      setOtpError('Verification service unavailable. Please resend OTP.')
    }
  }, [otpCode, otpVerifying])

  // Retry OTP
  const retryOTP = useCallback((retryMethod: number) => {
    if (countdown > 0) return
    setOtpCode(['', '', '', '', '', ''])
    setOtpError('')
    setCountdown(30)
    const retryFn = msg91Methods.current?.retryOtp || (window as any).retryOtp
    if (retryFn) retryFn(retryMethod)
  }, [countdown])

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otpCode]
    newOtp[index] = value.slice(-1)
    setOtpCode(newOtp)
    setOtpError('')
    if (value && index < 5) otpInputRefs.current[index + 1]?.focus()

    // Auto-verify when all filled
    if (newOtp.every(d => d !== '') && newOtp.join('').length >= 4) {
      if (otpVerifying) return
      setTimeout(() => {
        setOtpVerifying(true)
        setOtpError('')
        const vTimeout = setTimeout(() => {
          setOtpVerifying(false)
          setOtpError('Verification timed out. Please try again.')
        }, 15000)
        ;(window as any).vTimeoutRef = vTimeout
        const verifyFn = msg91Methods.current?.verifyOtp || (window as any).verifyOtp
        if (verifyFn) verifyFn(newOtp.join(''))
      }, 150)
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (paste.length >= 4) {
      const newOtp = [...otpCode]
      paste.split('').forEach((c, i) => { if (i < 6) newOtp[i] = c })
      setOtpCode(newOtp)
      setTimeout(() => {
        setOtpVerifying(true)
        setOtpError('')
        if (msg91Methods.current?.verifyOtp) msg91Methods.current.verifyOtp(newOtp.join(''))
      }, 150)
    }
  }

  const cancelOtp = () => {
    setOtpStep(false)
    setOtpCode(['', '', '', '', '', ''])
    setOtpError('')
    setOtpVerifying(false)
    msg91Methods.current = null
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

  const displayIdentifier = method === 'phone' ? phoneNumber : email
  const isInputValid = method === 'phone'
    ? /^\d{10}$/.test(sanitizePhone(phoneNumber))
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

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

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative overflow-hidden">

          {/* ── OTP Verification Panel (slides over) ── */}
          <div
            className={`absolute inset-0 bg-white z-20 p-8 flex flex-col transition-all duration-300 ease-in-out ${
              otpStep ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center mb-5 shadow-sm">
                {method === 'email' ? (
                  <Mail className="w-7 h-7 text-orange-600" />
                ) : (
                  <Phone className="w-7 h-7 text-orange-600" />
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Verify your {method === 'email' ? 'email' : 'phone'}</h2>
              <p className="text-sm text-gray-500 mb-6 text-center leading-relaxed">
                {otpSending ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Sending OTP…</span>
                ) : loading ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Logging in…</span>
                ) : (
                  <>We sent a code to <span className="font-semibold text-gray-700">{displayIdentifier}</span></>
                )}
              </p>

              {!otpSending && !loading && (
                <>
                  {/* OTP Input Boxes */}
                  <div className="flex gap-2.5 mb-4">
                    {otpCode.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpInputRefs.current[i] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onPaste={i === 0 ? handleOtpPaste : undefined}
                        disabled={otpVerifying}
                        className={`w-11 h-13 text-center text-lg font-bold rounded-xl border-2 outline-none transition-all duration-200 ${
                          otpVerifying
                            ? 'border-orange-300 bg-orange-50/50 text-orange-700'
                            : digit
                              ? 'border-orange-400 bg-orange-50/30 text-gray-900 shadow-sm'
                              : 'border-gray-200 bg-gray-50/50 text-gray-900 hover:border-gray-300'
                        } focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:bg-white disabled:opacity-70`}
                        style={{ caretColor: 'transparent' }}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <p className="text-sm text-red-500 mb-3 text-center font-medium">{otpError}</p>
                  )}

                  <Button
                    onClick={verifyOTP}
                    disabled={otpVerifying || otpCode.join('').length < 4}
                    className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-base mb-4 transition-all duration-200"
                  >
                    {otpVerifying ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</span>
                    ) : (
                      <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Verify OTP</span>
                    )}
                  </Button>

                  {/* Resend / Retry */}
                  <div className="text-center text-sm text-gray-500">
                    {countdown > 0 ? (
                      <span>Resend in <span className="font-semibold text-orange-600 tabular-nums">{countdown}s</span></span>
                    ) : (
                      <div className="flex items-center gap-3 justify-center">
                        <button onClick={() => retryOTP(1)} className="text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-colors">
                          Resend {method === 'phone' ? 'SMS' : 'Email'}
                        </button>
                        {method === 'phone' && (
                          <>
                            <span className="text-gray-300">•</span>
                            <button onClick={() => retryOTP(2)} className="text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-colors">
                              Voice Call
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <button onClick={cancelOtp} className="text-sm text-gray-400 hover:text-gray-600 mt-4 transition-colors text-center">
              &larr; Back to login
            </button>
          </div>

          {/* ── Method Toggle (Phone / Email) ── */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMethod('phone'); setOtpStep(false) }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                method === 'phone'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Phone className="w-4 h-4" /> Phone
            </button>
            <button
              onClick={() => { setMethod('email'); setOtpStep(false) }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                method === 'email'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
          </div>

          {/* ── Input Field ── */}
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

          {/* ── OTP Login Button ── */}
          {mode === 'otp' && (
            <>
              <Button
                onClick={sendOTP}
                disabled={!isInputValid || loading || otpSending}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold text-base shadow-md shadow-orange-200/50 hover:shadow-lg hover:shadow-orange-300/50 transition-all duration-200 mb-3"
              >
                {otpSending ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Sending OTP…</span>
                ) : (
                  <span className="flex items-center gap-2">Send OTP <ArrowRight className="w-4 h-4" /></span>
                )}
              </Button>
              <button
                onClick={() => setMode('password')}
                className="w-full text-center text-sm text-gray-500 hover:text-orange-600 transition-colors font-medium flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" /> Login with password instead
              </button>
            </>
          )}

          {/* ── Password Login Form ── */}
          {mode === 'password' && (
            <form onSubmit={handlePasswordLogin}>
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
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold text-base shadow-md shadow-orange-200/50 hover:shadow-lg hover:shadow-orange-300/50 transition-all duration-200 mb-3"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Signing in…</span>
                ) : (
                  <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>
                )}
              </Button>
              <button
                type="button"
                onClick={() => setMode('otp')}
                className="w-full text-center text-sm text-gray-500 hover:text-orange-600 transition-colors font-medium flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Login with OTP instead
              </button>
            </form>
          )}

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

        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Secured with MSG91 OTP verification
        </p>
      </div>
    </div>
  )
}
