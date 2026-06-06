'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { Footer } from '@/components/pureframe/footer'
import { useAppStore } from '@/lib/store'
import { transactions } from '@/lib/mock-data'

export default function FavoritesPage() {
  const { favoriteTransactionIds } = useAppStore()
  const favoriteTransactions = transactions.filter((t) =>
    favoriteTransactionIds.includes(t.id)
  )

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <ProfileSidebar />

      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-12">Favourite Transactions</h1>

          {favoriteTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-48 h-48 bg-red-100 rounded-full flex items-center justify-center mb-8">
                <Heart className="w-24 h-24 text-red-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Favourite transactions found
              </h2>
              <p className="text-gray-600 mb-8">
                Favourite your transactions to make it appear
                <br />
                here
              </p>
              <Link href="/">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Back Home
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteTransactions.map((transaction) => (
                <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{transaction.projectName}</h3>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600">Type:</span>{' '}
                      <span className="font-medium">{transaction.type}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Unit:</span>{' '}
                      <span className="font-medium">{transaction.unit}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Amount:</span>{' '}
                      <span className="font-semibold text-gray-900">{transaction.amount}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
