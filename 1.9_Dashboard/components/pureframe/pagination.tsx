"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
interface PaginationProps {
  currentPage: number
  totalPages: number
  totalTransactions: number
  onPageChange?: (page: number) => void
}
export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalTransactions = 0,
  onPageChange,
}: PaginationProps) {
  const startItem = Math.min((currentPage - 1) * 10 + 1, totalTransactions)
  const endItem = Math.min(currentPage * 10, totalTransactions)
  const getVisiblePages = () => {
    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span>–<span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalTransactions}</span> Transactions
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost" size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          className="text-gray-500"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />Previous
        </Button>
        {getVisiblePages().map((page, i) =>
          page === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
          ) : (
            <Button
              key={page}
              variant="ghost" size="sm"
              onClick={() => onPageChange?.(page as number)}
              className={`h-8 w-8 text-sm ${page === currentPage ? 'bg-gray-900 text-white hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {page}
            </Button>
          )
        )}
        <Button
          variant="ghost" size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          className="text-gray-700"
        >
          Next<ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
