'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Eye, User, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { auth } from '@/lib/api'
import { PureframeLogo } from '@/components/pureframe-logo'

export function Navbar() {
  const { tokens, setSidebarOpen, user, setUser, setTokens } = useAppStore()

  useEffect(() => {
    const token = localStorage.getItem('zapkey_token')
    if (!token) return

    auth.me()
      .then(({ user: u }) => {
        setUser(u)
        setTokens(u.walletBalance ?? 0)
      })
      .catch(() => {
        localStorage.removeItem('zapkey_token')
        setUser(null)
        setTokens(0)
      })
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-orange-500 bg-orange-50">
              <PureframeLogo className="h-6 w-6" />
            </div>
            <span className="font-bold text-lg text-gray-900">Pureframe Labs</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-gray-700 hover:text-orange-500 font-medium border-b-2 border-orange-500 pb-1 text-sm">
              Transaction Data
            </Link>
            <span className="text-gray-300 font-medium text-sm cursor-not-allowed pb-1">Buy Homes</span>
            <span className="text-gray-300 font-medium text-sm cursor-not-allowed pb-1">Sell Homes</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-900">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </Link>

            {/* Token counter — only visible when logged in */}
            <Link href="/plans">
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-900">
                <Eye className="w-5 h-5" />
                {user && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {tokens}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="rounded-full bg-orange-500 text-white hover:bg-orange-600 w-9 h-9"
              >
                <User className="w-5 h-5" />
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-700 font-medium">
                    <LogIn className="w-4 h-4 mr-1" />Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
