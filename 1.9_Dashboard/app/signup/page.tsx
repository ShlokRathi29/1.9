'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle2, Loader2, Mail, Phone, ArrowRight, ShieldCheck } from 'lucide-react'
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
type VerifyTarget = 'phone' | 'email'
export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { setUser, setTokens } = useAppStore()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  // OTP verification state
  const [phoneToken, setPhoneToken] = useState('')
  const [emailToken, setEmailToken] = useState('')
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  // OTP input state
  const [otpTarget, setOtpTarget] = useState<VerifyTarget | null>(null)
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [otpSending, setOtpSending] = useState(false)
  const [otpVerifying, setOtpVerifying] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [otpError, setOtpError] = useState('')
  // MSG91 exposed methods ref
  const msg91Methods = useRef<any>(null)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])
  // Load MSG91 script
  useEffect(() => {
    const urls = [
      'https://verify.msg91.com/otp-provider.js',
      'https://verify.phone91.com/otp-provider.js'
    ]
    if (document.querySelector(`script[src="${urls[0]}"]`) || document.querySelector(`script[src="${urls[1]}"]`)) {
      return
    }
    let i = 0
    function attempt() {
      const s = document.createElement('script')
      s.src = urls[i]
      s.async = true
      s.onerror = () => {
        console.warn(`[OTP] Failed to load script from: ${urls[i]}`)
        i++
        if (i < urls.length) attempt()
        else console.error('[OTP] All MSG91 script sources failed!')
      }
      document.head.appendChild(s)
    }
    attempt()
  }, [])
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])
  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (field === 'phone') {
      setIsPhoneVerified(false)
      setPhoneToken('')
    }
    if (field === 'email') {
      setIsEmailVerified(false)
      setEmailToken('')
    }
  }
  const sanitizePhone = (raw: string) => {
    const cleaned = raw.trim().replace(/[\s\-]/g, '')
    if (cleaned.startsWith('+91')) return cleaned.slice(3)
    if (cleaned.startsWith('91') && cleaned.length === 12) return cleaned.slice(2)
    return cleaned
  }
  const triggerOTP = useCallback((target: VerifyTarget) => {
    let identifier = ''
    if (target === 'phone') {
      const phone = sanitizePhone(form.phone)
      if (!/^\d{10}$/.test(phone)) {
        toast({ title: 'Invalid phone', description: 'Please enter a valid 10-digit mobile number.', variant: 'destructive' })
        return
      }
      identifier = `91${phone}`
    } else {
      if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        toast({ title: 'Invalid email', description: 'Please enter a valid email address.', variant: 'destructive' })
        return
      }
      identifier = form.email
    }
    setOtpTarget(target)
    setOtpCode(['', '', '', '', '', ''])
    setOtpError('')
    setOtpSending(true)
    if (!window.initSendOTP) {
      console.error('[OTP] initSendOTP not available on window — script may not have loaded')
      toast({ title: 'Service loading', description: 'OTP service is still loading. Please wait a moment.', variant: 'destructive' })
      setOtpSending(false)
      return
    }
    const timeoutId = setTimeout(() => {
      console.warn('[OTP] Global timeout reached (60s) — widget may have failed silently')
      setOtpError('timeout')
      setOtpSending(false)
    }, 60000)
    window.initSendOTP({
      widgetId: WIDGET_ID,
      tokenAuth: TOKEN_AUTH,
      identifier,
      exposeMethods: true,
      success: (data: any) => {
        clearTimeout(timeoutId)
        if ((window as any).vTimeoutRef) clearTimeout((window as any).vTimeoutRef)
        if (target === 'phone') {
          setPhoneToken(data.message)
          setIsPhoneVerified(true)
        } else {
          setEmailToken(data.message)
          setIsEmailVerified(true)
        }
        setOtpTarget(null)
        setOtpVerifying(false)
        toast({ title: 'Verified!', description: `${target === 'phone' ? 'Phone number' : 'Email'} verified successfully.` })
      },
      failure: (error: any) => {
        clearTimeout(timeoutId)
        if ((window as any).vTimeoutRef) clearTimeout((window as any).vTimeoutRef)
        console.error('[OTP] ❌ Verification FAILED:', error)
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
    setTimeout(() => {
      setOtpSending((prev) => {
        if (prev) {
          console.warn('[OTP] Fallback triggered — forcing OTP input UI after 8s timeout')
          setCountdown(30)
          setTimeout(() => otpInputRefs.current[0]?.focus(), 200)
          return false
        }
        return prev
      })
    }, 8000)
  }, [form.phone, form.email, toast])
  const verifyOTP = useCallback(() => {
    if (otpVerifying) return;
    const code = otpCode.join('')
    if (code.length < 4) {
      setOtpError('Please enter the complete OTP.')
      return
    }
    setOtpVerifying(true)
    setOtpError('')
    // Failsafe timeout in case MSG91 silently fails
    const vTimeout = setTimeout(() => {
      setOtpVerifying(false)
      setOtpError('Verification timed out. Please try again.')
    }, 15000)
      ; (window as any).vTimeoutRef = vTimeout;
    const verifyFn = msg91Methods.current?.verifyOtp || (window as any).verifyOtp
    if (verifyFn) {
      verifyFn(code)
    } else {
      console.error('[OTP] No verifyOtp function available!')
      setOtpVerifying(false)
      setOtpError('Verification service unavailable. Please resend OTP.')
    }
  }, [otpCode, otpVerifying])
  // Retry OTP
  const retryOTP = useCallback((method: number) => {
    if (countdown > 0) return
    setOtpCode(['', '', '', '', '', ''])
    setOtpError('')
    setCountdown(30)
    const retryFn = msg91Methods.current?.retryOtp || (window as any).retryOtp
    if (retryFn) {
      retryFn(method) // MSG91 expects 1 for SMS, 2 for Voice
    } else {
      console.error('[OTP] No retryOtp function available!')
    }
  }, [countdown])
  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otpCode]
    newOtp[index] = value.slice(-1)
    setOtpCode(newOtp)
    setOtpError('')
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
    // Auto-verify when all filled
    if (newOtp.every(d => d !== '') && newOtp.join('').length >= 4) {
      if (otpVerifying) return;
      setTimeout(() => {
        setOtpVerifying(true)
        setOtpError('')
        const vTimeout = setTimeout(() => {
          setOtpVerifying(false)
          setOtpError('Verification timed out. Please try again.')
        }, 15000)
          ; (window as any).vTimeoutRef = vTimeout;
        const verifyFn = msg91Methods.current?.verifyOtp || (window as any).verifyOtp
        if (verifyFn) {
          verifyFn(newOtp.join(''))
        }
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
        if (msg91Methods.current?.verifyOtp) {
          msg91Methods.current.verifyOtp(newOtp.join(''))
        }
      }, 150)
    }
  }
  const cancelOtp = () => {
    setOtpTarget(null)
    setOtpCode(['', '', '', '', '', ''])
    setOtpError('')
    setOtpVerifying(false)
    msg91Methods.current = null
  }
  // Form submit
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || (!form.email && !form.phone) || !form.password) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields.', variant: 'destructive' })
      return
    }
    if (form.password.length < 6) {
      toast({ title: 'Weak password', description: 'Password must be at least 6 characters.', variant: 'destructive' })
      return
    }
    const phone = sanitizePhone(form.phone)
    if (phone && !/^\d{10}$/.test(phone)) {
      toast({ title: 'Invalid phone', description: 'Enter a valid 10-digit mobile number.', variant: 'destructive' })
      return
    }
    if (phone && !isPhoneVerified) {
      toast({ title: 'Verification required', description: 'Please verify your phone number.', variant: 'destructive' })
      return
    }
    if (form.email && !isEmailVerified) {
      toast({ title: 'Verification required', description: 'Please verify your email address.', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const payload: any = { name: form.name, password: form.password }
      if (form.email) {
        payload.email = form.email
        if (isEmailVerified) payload.emailToken = emailToken
      }
      if (phone) {
        payload.phone = phone
        if (isPhoneVerified) payload.phoneToken = phoneToken
      }
      const { token, user } = await auth.signup(payload)
      localStorage.setItem('pureframe_token', token)
      setUser(user)
      setTokens(user.walletBalance ?? 0)
      toast({ title: 'Account created!', description: 'Welcome to Pureframe Labs.' })
      router.push('/')
    } catch (err: any) {
      toast({ title: 'Signup failed', description: err.message || 'Could not create account.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }
  const showOtpPanel = otpTarget !== null
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50/30 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        { }
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-orange-500 bg-orange-50 group-hover:bg-orange-100 transition-colors duration-200">
              <PureframeLogo className="h-7 w-7" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Pureframe Labs</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Get started with Pureframe Labs</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative overflow-hidden">

          <div
            className={`absolute inset-0 bg-white z-20 p-8 flex flex-col transition-all duration-300 ease-in-out ${showOtpPanel ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
              }`}
          >
            <div className="flex-1 flex flex-col items-center justify-center">
    
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center mb-5 shadow-sm">
                {otpTarget === 'email' ? (
                  <Mail className="w-7 h-7 text-orange-600" />
                ) : (
                  <Phone className="w-7 h-7 text-orange-600" />
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Verify your {otpTarget === 'email' ? 'email' : 'phone'}</h2>
              <p className="text-sm text-gray-500 mb-6 text-center leading-relaxed">
                {otpSending ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Sending OTP…</span>
                ) : (
                  <>We sent a code to <span className="font-semibold text-gray-700">{otpTarget === 'email' ? form.email : form.phone}</span></>
                )}
              </p>
    
              {!otpSending && (
                <>
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
                        className={`w-11 h-13 text-center text-lg font-bold rounded-xl border-2 outline-none transition-all duration-200 ${otpVerifying
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
                    <p className="text-sm text-red-500 mb-3 text-center font-medium animate-in fade-in slide-in-from-top-1 duration-200">{otpError}</p>
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
                          Resend SMS
                        </button>
                        {otpTarget === 'phone' && (
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
              &larr; Back to form
            </button>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
  
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></Label>
              <Input id="name" type="text" placeholder="Rahul Sharma" value={form.name} onChange={update('name')} className="mt-1.5 h-11 border-gray-300 rounded-xl focus:border-orange-400 focus:ring-orange-200" autoComplete="name" />
            </div>
  
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></Label>
              <div className="flex gap-2 mt-1.5">
                <div className="relative flex-1">
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={update('email')}
                    disabled={isEmailVerified}
                    className={`h-11 border-gray-300 rounded-xl pr-10 transition-all duration-200 focus:border-orange-400 focus:ring-orange-200 ${isEmailVerified ? 'bg-green-50/50 border-green-300 text-green-800' : ''
                      }`}
                    autoComplete="email"
                  />
                  {isEmailVerified && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 animate-in zoom-in duration-300" />
                  )}
                </div>
                {form.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && !isEmailVerified && (
                  <Button
                    type="button"
                    onClick={() => triggerOTP('email')}
                    variant="outline"
                    className="h-11 rounded-xl whitespace-nowrap px-4 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 font-medium transition-all duration-200"
                  >
                    <Mail className="w-4 h-4 mr-1.5" /> Verify
                  </Button>
                )}
              </div>
              {isEmailVerified && (
                <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-1 duration-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Email verified successfully
                </p>
              )}
            </div>
  
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></Label>
              <div className="flex gap-2 mt-1.5">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium select-none">+91</div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={update('phone')}
                    disabled={isPhoneVerified}
                    className={`h-11 border-gray-300 rounded-xl pl-11 pr-10 transition-all duration-200 focus:border-orange-400 focus:ring-orange-200 ${isPhoneVerified ? 'bg-green-50/50 border-green-300 text-green-800' : ''
                      }`}
                    autoComplete="tel"
                  />
                  {isPhoneVerified && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 animate-in zoom-in duration-300" />
                  )}
                </div>
                {form.phone.replace(/[\s\-]/g, '').length >= 10 && !isPhoneVerified && (
                  <Button
                    type="button"
                    onClick={() => triggerOTP('phone')}
                    variant="outline"
                    className="h-11 rounded-xl whitespace-nowrap px-4 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 font-medium transition-all duration-200"
                  >
                    <Phone className="w-4 h-4 mr-1.5" /> Verify
                  </Button>
                )}
              </div>
              {isPhoneVerified ? (
                <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-1 duration-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Phone verified successfully
                </p>
              ) : (
                <p className="text-xs text-gray-400 mt-1.5">Required to secure your account</p>
              )}
            </div>
  
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={update('password')}
                  className="h-11 border-gray-300 rounded-xl pr-11 focus:border-orange-400 focus:ring-orange-200"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="mt-2 flex gap-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${form.password.length >= level * 3
                        ? level <= 1 ? 'bg-red-400' : level <= 2 ? 'bg-orange-400' : level <= 3 ? 'bg-yellow-400' : 'bg-green-400'
                        : 'bg-gray-200'
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>
  
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold text-base shadow-md shadow-orange-200/50 hover:shadow-lg hover:shadow-orange-300/50 transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Creating account…</span>
              ) : (
                <span className="flex items-center gap-2">Create Account <ArrowRight className="w-4 h-4" /></span>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-gray-400">or</span></div>
          </div>

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
            Already have an account?{' '}
            <Link href="/login" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">Sign in</Link>
          </p>
        </div>
        { }
        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Secured with MSG91 OTP verification
        </p>
      </div>
    </div>
  )
}
