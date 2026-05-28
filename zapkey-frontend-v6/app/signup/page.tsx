'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAppStore } from '@/lib/store'
import { auth } from '@/lib/api'

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { setUser, setTokens } = useAppStore()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

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
    // Sanitize phone — strip spaces, dashes, +91 prefix
    const rawPhone = form.phone.trim().replace(/[\s\-]/g, '')
    const phone = rawPhone.startsWith('+91') ? rawPhone.slice(3) : rawPhone.startsWith('91') && rawPhone.length === 12 ? rawPhone.slice(2) : rawPhone

    if (phone && !/^\d{10}$/.test(phone)) {
      toast({ title: 'Invalid phone number', description: 'Enter a valid 10-digit Indian mobile number.', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const payload: any = { name: form.name, password: form.password }
      if (form.email) payload.email = form.email
      if (phone) payload.phone = phone
      const { token, user } = await auth.signup(payload)
      localStorage.setItem('zapkey_token', token)
      setUser(user)
      setTokens(user.walletBalance ?? 0)
      toast({ title: 'Account created!', description: 'Welcome to Zapkey.' })
      router.push('/')
    } catch (err: any) {
      toast({ title: 'Signup failed', description: err.message || 'Could not create account.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">Zapkey</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Get started with Zapkey</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></Label>
              <Input id="name" type="text" placeholder="Rahul Sharma" value={form.name} onChange={update('name')} className="mt-1 h-11 border-gray-300 rounded-xl" autoComplete="name" />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" value={form.email} onChange={update('email')} className="mt-1 h-11 border-gray-300 rounded-xl" autoComplete="email" />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="9876543210" value={form.phone} onChange={update('phone')} className="mt-1 h-11 border-gray-300 rounded-xl" autoComplete="tel" />
              <p className="text-xs text-gray-400 mt-1">At least one of email or phone is required</p>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={update('password')}
                  className="h-11 border-gray-300 rounded-xl pr-11"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-base">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-gray-400">or</span></div>
          </div>

          <Button variant="outline" className="w-full h-11 rounded-xl border-gray-300 font-medium" disabled>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google (coming soon)
          </Button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-600 font-semibold hover:text-orange-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
