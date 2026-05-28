'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { Search, Download, TrendingUp, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
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
import { Filters } from '@/components/zapkey/filters'
import { Pagination } from '@/components/zapkey/pagination'
import { TrendsSection } from '@/components/zapkey/trends-section'
import { projects as mockProjects } from '@/lib/mock-data'
import { projects as projectsApi } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

function TransactionsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const projectId = searchParams.get('projectId')
  const { addViewedTransaction } = useAppStore()

  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [transactionsList, setTransactionsList] = useState<any[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Record<string, string>>({})

  const mockProject = mockProjects.find((p) => p.id === projectId)

  const fetchTransactions = useCallback(async (page: number, activeFilters: Record<string, string>) => {
    if (!projectId) { setLoading(false); return }
    setLoading(true)
    try {
      const res = await projectsApi.getTransactions(projectId, page, activeFilters)
      setTransactionsList(res.data ?? [])
      setTotalItems(res.total ?? 0)
      setTotalPages(res.pages ?? 1)
    } catch (err: any) {
      if (err.status === 401) return // api.ts handles redirect
      toast({ title: 'Something went wrong. Please try again.', variant: 'destructive' })
      setTransactionsList([])
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchTransactions(currentPage, filters)
  }, [projectId, currentPage, filters])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchTransactions(page, filters)
  }

  const handleFilterClear = () => {
    setFilters({})
    setCurrentPage(1)
  }

  const handleExportCSV = () => {
    const unlocked = transactionsList.filter((t) => !t.locked)
    if (unlocked.length === 0) {
      toast({ title: 'Nothing to export', description: 'No unlocked transactions to export.', variant: 'destructive' })
      return
    }
    const csv = [
      ['Date', 'Project', 'Type', 'Floor/Tower', 'Unit', 'Amount'],
      ...unlocked.map((t) => [t.date, t.projectName ?? mockProject?.name ?? '', t.type, t.floorTower, t.unit, t.amount]),
    ].map((r) => r.join(',')).join('\n')
    const el = document.createElement('a')
    el.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
    el.download = 'transactions.csv'
    el.click()
    toast({ title: 'Downloaded', description: 'Transactions exported as CSV.' })
  }

  function getTypeBadgeClass(type: string) {
    if (type === 'Sale') return 'bg-orange-100 text-orange-700'
    if (type === 'Rent') return 'bg-green-100 text-green-700'
    return 'bg-blue-100 text-blue-700'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <ProfileSidebar />

      {mockProject && (
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{mockProject.name}</h1>
              <p className="text-sm text-gray-500">{totalItems} transactions</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50" onClick={handleExportCSV}>
                <Download className="w-4 h-4 mr-2" />Download Excel
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <TrendingUp className="w-4 h-4 mr-2" />Analyse like a PRO
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        <div className="flex gap-6">
          <Filters onClearAll={handleFilterClear} />
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {!projectId && (
                <div className="p-4 border-b border-gray-200">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by project name..."
                      className="pl-9 border-gray-300"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                    />
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-600 text-xs uppercase">DATE</TableHead>
                      <TableHead className="font-semibold text-gray-600 text-xs uppercase">PROJECT</TableHead>
                      <TableHead className="font-semibold text-gray-600 text-xs uppercase">TYPE</TableHead>
                      <TableHead className="font-semibold text-gray-600 text-xs uppercase">FLOOR, TOWER</TableHead>
                      <TableHead className="font-semibold text-gray-600 text-xs uppercase">UNIT</TableHead>
                      <TableHead className="font-semibold text-gray-600 text-xs uppercase">AMOUNT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 6 }).map((_, j) => (
                            <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : transactionsList.length > 0 ? (
                      transactionsList.map((t) => (
                        <TableRow key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <TableCell className="text-gray-700 text-sm">{t.date}</TableCell>
                          <TableCell>
                            <p className="font-medium text-gray-900 text-sm">{t.projectName ?? mockProject?.name ?? ''}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={getTypeBadgeClass(t.type)}>{t.type}</Badge>
                          </TableCell>
                          <TableCell className="text-gray-700 text-sm">{t.floorTower}</TableCell>
                          <TableCell className="text-gray-700 text-sm">{t.unit}</TableCell>
                          <TableCell>
                            {t.locked ? (
                              <span className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded" title="Amount locked">
                                <Lock className="w-4 h-4 text-orange-500" />
                              </span>
                            ) : (
                              <span className="font-semibold text-gray-900">{t.amount}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                          {projectId ? 'No transactions found' : 'Select a project to view transactions'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalTransactions={totalItems}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>

      <TrendsSection />
      <Footer />
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <TransactionsContent />
    </Suspense>
  )
}
