'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Navbar } from '@/components/navbar'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { Footer } from '@/components/zapkey/footer'
import { wallet as walletApi } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

export default function AccountPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAppStore()
  const [balance, setBalance] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('zapkey_token')
    if (!token) { setLoading(false); return }

    walletApi.getBalance()
      .then((res) => {
        setBalance(res.balance)
        setTransactions(res.transactions ?? [])
      })
      .catch((err) => {
        if (err.status !== 401) {
          toast({ title: 'Something went wrong. Please try again.', variant: 'destructive' })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  function getTypeBadgeClass(type: string) {
    if (type === 'CREDIT') return 'bg-green-100 text-green-700'
    if (type === 'DEBIT') return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-700'
  }

  function formatDate(dateStr: string) {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    } catch { return dateStr }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <ProfileSidebar />

      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="agreements">Agreements</TabsTrigger>
              <TabsTrigger value="history">Transactions History</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-8">
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-48 h-48 bg-blue-100 rounded-full flex items-center justify-center mb-8">
                  <svg className="w-24 h-24 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Found</h2>
                <p className="text-gray-600">All your past orders will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="agreements" className="mt-8">
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-48 h-48 bg-purple-100 rounded-full flex items-center justify-center mb-8">
                  <svg className="w-24 h-24 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Agreements Found</h2>
                <p className="text-gray-600">Your agreements will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-8">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 rounded-lg" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Wallet balance card */}
                  {balance !== null && (
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 mb-6 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Token Balance</p>
                        <p className="text-3xl font-bold text-orange-600">{balance}</p>
                        <p className="text-xs text-gray-400 mt-1">tokens available</p>
                      </div>
                      <Button
                        onClick={() => router.push('/plans')}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Buy More Tokens
                      </Button>
                    </div>
                  )}

                  {transactions.length > 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="font-semibold text-gray-600 text-xs uppercase">Date</TableHead>
                            <TableHead className="font-semibold text-gray-600 text-xs uppercase">Type</TableHead>
                            <TableHead className="font-semibold text-gray-600 text-xs uppercase">Amount</TableHead>
                            <TableHead className="font-semibold text-gray-600 text-xs uppercase">Reference</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map((tx, i) => (
                            <TableRow key={tx.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                              <TableCell className="text-gray-700 text-sm">{formatDate(tx.createdAt ?? tx.date)}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className={getTypeBadgeClass(tx.type)}>
                                  {tx.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-semibold text-gray-900">
                                {tx.type === 'CREDIT' ? '+' : '-'}{tx.amount} tokens
                              </TableCell>
                              <TableCell className="text-gray-500 text-sm truncate max-w-[200px]">
                                {tx.reference ?? tx.description ?? '—'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24">
                      <div className="w-48 h-48 bg-green-100 rounded-full flex items-center justify-center mb-8">
                        <svg className="w-24 h-24 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">No Transactions Found</h2>
                      <p className="text-gray-600">Your token transaction history will appear here</p>
                      <Button
                        onClick={() => router.push('/plans')}
                        className="mt-6 bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Buy Tokens
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center">
            <Button onClick={() => router.push('/')} className="bg-orange-500 hover:bg-orange-600 text-white">
              Back Home
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
