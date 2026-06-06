import { ChevronRight } from "lucide-react"
import Link from "next/link"

export function TrendsSection() {
  return (
    <div className="border-t border-gray-200 bg-white py-6">
      <div className="mx-auto max-w-7xl px-4">
        <h3 className="mb-4 text-sm font-medium text-gray-600">
          View Rent & Sale Trends in -
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Project Trend */}
          <Link
            href="#"
            className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">
                Geras Trinity Towers
              </span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Link>

          {/* Locality Trend */}
          <Link
            href="#"
            className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">Kharadi</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Link>
        </div>

        {/* Info Text */}
        <p className="mt-6 text-sm text-gray-600">
          Pureframe Labs helps you negotiate the best price based on the latest property
          transactions in any project. We have 6 sales in Geras Trinity Towers
          which have been registered in the last 12 months. In case you plan to
          find your dream home in Geras Trinity Towers or across any other 309
          projects in Kharadi, you mu...{" "}
          <button className="font-medium text-blue-600 hover:text-blue-800">
            Read More
          </button>
        </p>
      </div>
    </div>
  )
}
