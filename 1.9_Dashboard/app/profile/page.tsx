'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { Footer } from '@/components/pureframe/footer'
import { useAppStore } from '@/lib/store'
export default function ProfilePage() {
  const { user } = useAppStore()
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <ProfileSidebar />
      <div className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">User Profile</h1>
          <Card className="border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase">NAME</label>
                  <p className="text-lg text-gray-900 mt-1">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase">EMAIL</label>
                  <p className="text-lg text-gray-900 mt-1">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase">PHONE NUMBER</label>
                  <p className="text-lg text-gray-900 mt-1">{user?.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
