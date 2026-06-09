import { Bell, ArrowUpRight, FileSpreadsheet, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
interface ProjectHeaderProps {
  projectName: string
  location: string
  totalTransactions: number
}
export function ProjectHeader({
  projectName = "Geras Trinity Towers",
  location = "Kharadi",
  totalTransactions = 616,
}: ProjectHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white py-4">
      <div className="mx-auto max-w-7xl px-4">
        {}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <Building className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-gray-900">
                  {projectName}
                </h1>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
                <Button
                  size="sm"
                  className="ml-2 bg-orange-500 text-white hover:bg-orange-600"
                >
                  <Bell className="mr-1 h-3 w-3" />
                  Set Alert
                </Button>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                <span>{location}</span>
                <ArrowUpRight className="h-3 w-3" />
                <span className="text-gray-400">
                  viewed by 100+ buyers
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <svg
                viewBox="0 0 24 24"
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Analyze data like a PRO
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Download Excel
            </Button>
          </div>
        </div>
        {}
        <p className="text-sm font-medium text-gray-900">
          Showing {totalTransactions} transactions
        </p>
      </div>
    </div>
  )
}
