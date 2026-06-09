"use client"
import { Home, Info, ChevronDown } from "lucide-react"
import Link from "next/link"
interface CityBannerProps {
  cityName: string
  localityCount: number
}
export function CityBanner({ cityName, localityCount }: CityBannerProps) {
  return (
    <div className="bg-gradient-to-r from-[#1a3a5c] to-[#2d5a87] text-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {}
            <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="12" width="10" height="20" fill="#f97316" rx="1" />
                <rect x="22" y="8" width="10" height="24" fill="#fb923c" rx="1" />
                <rect x="10" y="15" width="2" height="2" fill="white" />
                <rect x="14" y="15" width="2" height="2" fill="white" />
                <rect x="10" y="19" width="2" height="2" fill="white" />
                <rect x="14" y="19" width="2" height="2" fill="white" />
                <rect x="10" y="23" width="2" height="2" fill="white" />
                <rect x="14" y="23" width="2" height="2" fill="white" />
                <rect x="24" y="11" width="2" height="2" fill="white" />
                <rect x="28" y="11" width="2" height="2" fill="white" />
                <rect x="24" y="15" width="2" height="2" fill="white" />
                <rect x="28" y="15" width="2" height="2" fill="white" />
                <rect x="24" y="19" width="2" height="2" fill="white" />
                <rect x="28" y="19" width="2" height="2" fill="white" />
                <rect x="24" y="23" width="2" height="2" fill="white" />
                <rect x="28" y="23" width="2" height="2" fill="white" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-white/70 mb-1">
                <Link href="/" className="hover:text-white flex items-center gap-1">
                  <Home className="w-3 h-3" />
                  Home
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold flex items-center gap-2">
                  Trending Locations in{" "}
                  <span className="flex items-center gap-1">
                    {cityName}
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </h1>
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded">
                  {localityCount} localities
                </span>
              </div>
              <p className="text-xs text-white/60 mt-1">Based on # of sale registrations</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
              <Info className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              12 Months
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
