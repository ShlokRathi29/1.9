"use client"
import { Home, ChevronRight, Star, Calendar, MapPin, Building2, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
interface ProjectDetailHeaderProps {
  projectName: string
  location: string
  cityName: string
  totalArea: string
  saleIndex: string
  constructionPeriod: string
  rating: string
  expectedPricing: string
  developer: string
  reraNumbers: string[]
  lastSoldDate: string
  lastSoldPrice: string
}
export function ProjectDetailHeader({
  projectName,
  location,
  cityName,
  totalArea,
  saleIndex,
  constructionPeriod,
  rating,
  expectedPricing,
  developer,
  reraNumbers,
  lastSoldDate,
  lastSoldPrice,
}: ProjectDetailHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      {}
      <div className="bg-gray-100 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="flex items-center gap-1 hover:text-orange-500">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/city/${cityName}/4`} className="hover:text-orange-500">{cityName}</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/location/${cityName}/${location}/1`} className="hover:text-orange-500">{location}</Link>
        </div>
      </div>
      {}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {}
          <div className="lg:w-1/4">
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-4 h-40 flex items-center justify-center">
              <Building2 className="h-20 w-20 text-orange-400" />
            </div>
          </div>
          {}
          <div className="lg:w-3/4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{projectName}</h1>
                <p className="text-gray-500 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {location}
                </p>
              </div>
            </div>
            {}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Area</p>
                <p className="font-semibold text-gray-900">{totalArea}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  Sale Index <TrendingUp className="h-3 w-3" />
                </p>
                <p className="font-semibold text-gray-900">{saleIndex}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  Construction <Calendar className="h-3 w-3" />
                </p>
                <p className="font-semibold text-gray-900">{constructionPeriod}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Rating</p>
                <p className="font-semibold text-gray-900 flex items-center gap-1">
                  {rating}
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                </p>
              </div>
            </div>
            {}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Expected Pricing</p>
                <p className="font-semibold text-gray-900">{expectedPricing}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Developer</p>
                <p className="font-semibold text-gray-900">{developer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">RERA Numbers</p>
                <p className="font-semibold text-gray-900">
                  {reraNumbers[0]}
                  {reraNumbers.length > 1 && (
                    <span className="text-orange-500 ml-1">+{reraNumbers.length - 1}</span>
                  )}
                </p>
              </div>
            </div>
            {}
            <div className="flex items-center gap-2 text-orange-500 text-sm">
              <span className="text-orange-400">↓</span>
              <span>Last sold - {lastSoldDate} - Rs. {lastSoldPrice}</span>
              <span className="text-orange-400">↓</span>
            </div>
          </div>
        </div>
        {}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full p-2">
              <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-700">Not finding what you are looking for?</span>
          </div>
          <button className="text-blue-600 font-medium hover:underline">Search here</button>
        </div>
      </div>
    </div>
  )
}
