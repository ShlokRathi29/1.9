'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { Footer } from '@/components/zapkey/footer'
import { plans } from '@/lib/mock-data'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import { payments } from '@/lib/api'
import { useState } from 'react'

const planIdMap: Record<string, string> = {
  'Lite': 'lite',
  'Plus': 'plus',
  'Premium': 'premium',
}

declare global {
  interface Window { Razorpay: any }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function PlansPage() {
  const { setTokens, user } = useAppStore()
  const { toast } = useToast()
  const router = useRouter()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  // Check localStorage — more reliable than Zustand on first render
  const isLoggedIn = () =>
    typeof window !== 'undefined' && !!localStorage.getItem('zapkey_token')

  const handleBuyPlan = async (planName: string) => {
    const planId = planIdMap[planName]
    if (!planId) return

    if (!isLoggedIn()) {
      toast({
        title: 'Sign in required',
        description: 'Please log in or create an account to purchase tokens.',
        variant: 'destructive',
      })
      router.push('/login')
      return
    }

    setLoadingPlan(planId)
    try {
      const order = await payments.createOrder(planId)

      const loaded = await loadRazorpayScript()
      if (!loaded) {
        toast({ title: 'Could not load payment window. Please try again.', variant: 'destructive' })
        setLoadingPlan(null)
        return
      }

      const rzpOptions = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Zapkey',
        description: 'Token Purchase',
        prefill: {
          name: user?.name ?? '',
          email: user?.email ?? '',
          contact: user?.phone ?? '',
        },
        theme: { color: '#f97316' },
        handler: async (response: any) => {
          try {
            const result = await payments.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            // Use server's authoritative newBalance — never addTokens blindly
            setTokens(result.newBalance)
            toast({
              title: 'Payment successful! 🎉',
              description: `${result.tokensAdded} tokens added. You now have ${result.newBalance} tokens.`,
            })
          } catch {
            toast({ title: 'Payment verification failed. Contact support.', variant: 'destructive' })
          }
        },
        modal: {
          ondismiss: () => {
            toast({ title: 'Payment cancelled', description: 'You can try again anytime.' })
            setLoadingPlan(null)
          },
        },
      }

      const rzp = new window.Razorpay(rzpOptions)
      rzp.open()
    } catch (err: any) {
      if (err.status === 401 && !localStorage.getItem('zapkey_token')) {
        toast({
          title: 'Sign in required',
          description: 'Please log in to continue purchasing tokens.',
          variant: 'destructive',
        })

        router.push('/login')
        return
      }

      toast({
        title: err.message || 'Unable to start payment. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <ProfileSidebar />

      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Save lakhs on your property</h1>
          <p className="text-xl text-orange-100">
            Compare the quoted price with actual transacted prices on Zapkey to negotiate the best deal
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50 flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {!isLoggedIn() && (
            <div className="mb-10 bg-orange-50 border border-orange-200 rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-semibold text-gray-900">Sign in to purchase tokens</p>
                <p className="text-sm text-gray-500 mt-0.5">You need a Zapkey account to buy and use tokens.</p>
              </div>
              <div className="flex gap-3">
                <Link href="/login">
                  <Button variant="outline" className="border-orange-400 text-orange-600 hover:bg-orange-50">Sign in</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">Create account</Button>
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative transition-all ${plan.recommended ? 'ring-2 ring-orange-500 shadow-2xl scale-105' : 'border border-gray-200'}`}
              >
                {plan.recommended && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4">
                    Recommended
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</div>
                    <p className="text-sm text-gray-500 mt-1">{plan.transactions} transaction views</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">View {plan.transactions} transactions</span>
                    </li>
                    <li className="text-sm text-gray-500 pl-8">{plan.description}</li>
                  </ul>
                  <Button
                    onClick={() => handleBuyPlan(plan.name)}
                    disabled={loadingPlan === planIdMap[plan.name]}
                    className={`w-full h-11 font-semibold ${plan.recommended ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-white text-orange-600 border border-orange-500 hover:bg-orange-50'}`}
                  >
                    {loadingPlan === planIdMap[plan.name] ? 'Processing...' : 'Buy Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-14">
            <p className="text-gray-600">
              Need a custom plan?{' '}
              <Link href="mailto:support@zapkey.com" className="text-orange-600 font-semibold hover:text-orange-700">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
