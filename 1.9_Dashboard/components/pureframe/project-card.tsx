import { ChevronRight } from "lucide-react"
import Link from "next/link"
interface ProjectCardProps {
  name: string
  saleTxns: number
  hasRera?: boolean
  href: string
}
export function ProjectCard({ name, saleTxns, hasRera = false, href }: ProjectCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between border-b border-gray-100 bg-white px-4 py-4 transition-colors hover:bg-gray-50"
    >
      <div>
        <h3 className="font-medium text-gray-900">{name}</h3>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="rounded bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
            {saleTxns} sale txns
          </span>
          {hasRera && (
            <span className="flex items-center gap-1 rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              RERA
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
    </Link>
  )
}
