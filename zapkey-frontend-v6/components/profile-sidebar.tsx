'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, Tag, ShoppingBag, User, CalendarDays, Heart, Bell, Info, FileText, HelpCircle, LogOut } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAppStore } from '@/lib/store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function ProfileSidebar() {
  const router = useRouter()
  const { user, isSidebarOpen, setSidebarOpen, setUser, setTokens } = useAppStore()

  const handleLogout = () => {
    localStorage.removeItem('zapkey_token')
    setUser(null)
    setTokens(0)
    setSidebarOpen(false)
    router.push('/')
  }

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: CalendarDays, label: 'My Account', href: '/account' },
    { icon: Heart, label: 'Favourites', href: '/favorites' },
    { icon: FileText, label: 'Viewed Transactions', href: '/viewed-transactions' },
    { icon: Bell, label: 'My Alerts', href: '/alerts' },
    { icon: Info, label: 'About Us', href: '#' },
    { icon: FileText, label: 'Blogs', href: '#' },
    { icon: HelpCircle, label: 'FAQs', href: '#' },
  ]

  return (
    <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="right" className="w-64 p-0">
        <SheetTitle className="sr-only">User Profile Menu</SheetTitle>
        <SheetHeader className="border-b p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => { if (!item.href.startsWith('#')) setSidebarOpen(false) }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </Link>
            ))}
          </nav>

          <div className="border-t p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>

          <div className="border-t p-4 text-xs text-gray-500 text-center">
            <p>© Pureframe Labs 2026</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
