'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { Footer } from '@/components/pureframe/footer'

const mockAlerts = [
  {
    id: '1',
    title: 'Price Drop Alert',
    message: 'Properties in Wagholi have seen a 5% price drop in the last month',
    type: 'price-drop',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    title: 'New Project Listed',
    message: 'A new project "Springhills" has been added in Hinjewadi',
    type: 'new-project',
    timestamp: '1 day ago',
  },
  {
    id: '3',
    title: 'Market Trend',
    message: 'Sales activity in Pune has increased by 12%',
    type: 'trend',
    timestamp: '3 days ago',
  },
]

export default function AlertsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <ProfileSidebar />

      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Alerts</h1>

          <div className="space-y-4">
            {mockAlerts.map((alert) => (
              <Card key={alert.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bell className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {alert.title}
                        </h3>
                        <p className="text-gray-600 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{alert.timestamp}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      Dismiss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {mockAlerts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Bell className="w-16 h-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Alerts</h2>
              <p className="text-gray-600">You&apos;ll receive alerts when there are important updates</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
