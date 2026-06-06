import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface LocalityCardProps {
  name: string
  transactionCount: number
  href?: string
}

export function LocalityCard({ name, transactionCount, href = "#" }: LocalityCardProps) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow group"
    >
      <div>
        <h3 className="text-sm font-medium text-gray-900">Properties in {name}</h3>
        <p className="text-xs text-orange-500 mt-1">{transactionCount.toLocaleString()} sale txns</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
    </Link>
  )
}
