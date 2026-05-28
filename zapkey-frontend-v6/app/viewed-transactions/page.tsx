'use client'

import { useState, useMemo } from 'react'
import { Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { Footer } from '@/components/zapkey/footer'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

const ITEMS_PER_PAGE = 10

export default function ViewedTransactionsPage() {
  const { viewedTransactions } = useAppStore()
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(viewedTransactions.length / ITEMS_PER_PAGE)
  const paginatedTransactions = viewedTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleExportExcel = () => {
    const csvContent = [
      ['Date', 'Project', 'Type', 'Floor/Tower', 'Unit', 'Amount'],
      ...paginatedTransactions.map((vt) => [
        vt.transaction.date,
        vt.transaction.projectName,
        vt.transaction.type,
        vt.transaction.floorTower,
        vt.transaction.unit,
        vt.transaction.amount,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const element = document.createElement('a')
    element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`)
    element.setAttribute('download', 'viewed-transactions.csv')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: 'Downloaded',
      description: 'Transactions exported successfully',
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <ProfileSidebar />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex gap-8">
              <button className="pb-4 text-orange-500 font-semibold border-b-2 border-orange-500">
                Viewed Transactions
              </button>
              <button className="pb-4 text-gray-500 font-semibold">Viewed Addresses</button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
            <p className="text-sm text-gray-600">
              {viewedTransactions.length > 0
                ? `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1} - ${Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    viewedTransactions.length
                  )} of ${viewedTransactions.length} Transactions`
                : 'No transactions viewed yet'}
            </p>
            {viewedTransactions.length > 0 && (
              <Button
                onClick={handleExportExcel}
                variant="outline"
                className="flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-50"
              >
                <Download className="w-4 h-4" />
                Download Excel
              </Button>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {viewedTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="font-semibold text-gray-700">DATE</TableHead>
                      <TableHead className="font-semibold text-gray-700">PROJECT</TableHead>
                      <TableHead className="font-semibold text-gray-700">TYPE</TableHead>
                      <TableHead className="font-semibold text-gray-700">FLOOR, TOWER</TableHead>
                      <TableHead className="font-semibold text-gray-700">UNIT</TableHead>
                      <TableHead className="font-semibold text-gray-700">AMOUNT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((vt) => (
                      <TableRow key={vt.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <TableCell className="text-gray-700">{vt.transaction.date}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">
                              {vt.transaction.projectName}
                            </p>
                            <p className="text-xs text-gray-500">Kharadi</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-red-100 text-red-700">
                            {vt.transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {vt.transaction.floorTower}
                        </TableCell>
                        <TableCell className="text-gray-700">{vt.transaction.unit}</TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          {vt.transaction.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-gray-500 text-lg mb-4">No viewed transactions yet</p>
                <p className="text-gray-400 text-sm">View transactions to see them here</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {viewedTransactions.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                    className={
                      currentPage === i + 1
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : ''
                    }
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
