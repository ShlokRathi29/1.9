"use client"

import { Search, ShoppingCart, Bell, ChevronDown, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"

export function Header() {
  const router = useRouter()

  const handleCityChange = (value: string) => {
    const cityMap: Record<string, { id: number; name: string }> = {
      pune: { id: 4, name: "Pune" },
      mumbai: { id: 1, name: "Mumbai" },
      bangalore: { id: 2, name: "Bangalore" },
      delhi: { id: 3, name: "Delhi" },
    }
    const city = cityMap[value]
    if (city) {
      router.push(`/city/${city.name}/${city.id}`)
    }
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
              <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900">Zapkey</span>
        </div>

        {/* Search Section */}
        <div className="flex flex-1 items-center gap-3 px-8">
          {/* City Selector */}
          <Select defaultValue="pune" onValueChange={handleCityChange}>
            <SelectTrigger className="w-[140px] border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Select City" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pune">Pune</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
              <SelectItem value="bangalore">Bangalore</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
            </SelectContent>
          </Select>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search Projects or Locality"
              className="w-full border-gray-200 bg-white pl-10"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <button className="relative text-gray-600 hover:text-gray-900">
            <ShoppingCart className="h-5 w-5" />
          </button>
          <button className="relative text-gray-600 hover:text-gray-900">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              20
            </span>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* AI Banner */}
      <div className="flex items-center justify-center gap-4 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 py-2">
        <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
          NEW
        </span>
        <span className="flex items-center gap-1 text-sm font-medium text-orange-400">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          AI POWERED
        </span>
        <button className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 hover:bg-amber-200">
          🔍 Search by Property Address
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </header>
  )
}
