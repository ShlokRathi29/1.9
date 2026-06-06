"use client"

import { Home, ChevronDown, Info, Calendar } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"

interface LocationBannerProps {
  cityName: string
  cityId: number
  locationName: string
  projectCount: number
}

export function LocationBanner({ cityName, cityId, locationName, projectCount }: LocationBannerProps) {
  return (
    <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-blue-500">
      <div className="mx-auto max-w-7xl px-4 py-4">
        {/* Breadcrumb */}
        <div className="mb-2 flex items-center gap-2 text-sm text-white/90">
          <Link href="/" className="flex items-center gap-1 hover:text-white">
            <Home className="h-3.5 w-3.5" />
            Home
          </Link>
          <span>/</span>
          <Link href={`/city/${cityName}/${cityId}`} className="hover:text-white">
            {cityName}
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Location Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-white">
                  Trending projects in <span className="font-bold">{locationName}</span>
                </h1>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {projectCount} projects
                </span>
              </div>
              <p className="mt-0.5 text-sm text-white/80">Based on # of sale registrations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Info Button */}
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30">
              <Info className="h-4 w-4" />
            </button>

            {/* Time Period Selector */}
            <Select defaultValue="12">
              <SelectTrigger className="w-[140px] border-0 bg-white text-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="Select period" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
                <SelectItem value="12">12 Months</SelectItem>
                <SelectItem value="24">24 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
