"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
interface CityPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
}
export function CityPagination({ currentPage, totalPages, onPageChange }: CityPaginationProps) {
  const visiblePages = []
  const maxVisible = 5
  for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) {
    visiblePages.push(i)
  }
  return (
    <div className="flex items-center justify-between py-6 px-4">
      <button
        onClick={() => onPageChange&&onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>
      <div className="flex items-center gap-1">
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange&&onPageChange(page)}
            className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-white border border-gray-300 text-gray-900"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange&&onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
