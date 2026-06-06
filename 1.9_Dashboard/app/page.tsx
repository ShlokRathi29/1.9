'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ChevronRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Navbar } from '@/components/navbar'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { Footer } from '@/components/pureframe/footer'
import { Badge } from '@/components/ui/badge'
import { cities as mockCities } from '@/lib/mock-data'
import { browse } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

const cityIcons: Record<string, string> = {
  '1': '🏙️', '2': '🏗️', '3': '🌳', '4': '💎',
  '5': '🌊', '6': '🏢', '7': '🛏️', '8': '🌞',
}

export default function HomePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [cities, setCities] = useState<any[]>([])
  const [citiesLoading, setCitiesLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch cities on mount
  useEffect(() => {
    browse.getCities()
      .then((res) => setCities(res.data ?? res))
      .catch(() => {
        setCities(mockCities)
        toast({ title: 'Backend offline — showing cached city data' })
      })
      .finally(() => setCitiesLoading(false))
  }, [])

  // Debounced project search
  useEffect(() => {
    if (!selectedCity || searchQuery.length < 2) {
      setSearchResults([])
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await browse.searchProjects(selectedCity, searchQuery)
        setSearchResults(res.data ?? [])
      } catch {
        setSearchResults([])
      }
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [searchQuery, selectedCity])

  const handleViewTransactions = () => {
    if (!selectedCity) return
    const city = cities.find((c) => c.id === selectedCity)
    if (city) router.push(`/city/${encodeURIComponent(city.name)}/${city.id}`)
  }

  const handleProjectSelect = (project: any) => {
    // Backend returns snake_case: locality_name, city_name
    const cityN = project.city_name || project.cityName || ''
    const localityN = project.locality_name || project.localityName || ''
    router.push(
      `/project/${encodeURIComponent(cityN)}/${encodeURIComponent(localityN)}/${encodeURIComponent(project.name)}/${project.id}`
    )
    setSearchQuery('')
    setShowSuggestions(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <ProfileSidebar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
            <Badge className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">NEW</Badge>
            <Badge className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
              </svg>
              AI POWERED
            </Badge>
            <button className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 text-sm bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              🔍 Search by Property Address
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Look at actual transactions to<br className="hidden md:block" /> negotiate a better deal!
            </h1>
            <p className="text-xl text-gray-500">
              Property transactions as per government registry records
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-12 border-gray-300 rounded-xl">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {citiesLoading
                    ? [1, 2, 3].map((i) => (
                        <div key={i} className="px-2 py-1"><Skeleton className="h-5 w-24" /></div>
                      ))
                    : cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {cityIcons[city.id] || '🏙️'} {city.name}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search Projects, Townships, Localities..."
                  className="pl-9 h-12 rounded-xl border-gray-300"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true) }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {showSuggestions && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    {searchResults.slice(0, 6).map((project) => (
                      <button
                        key={project.id}
                        className="w-full text-left px-4 py-3 hover:bg-orange-50 border-b last:border-b-0 text-sm transition-colors"
                        onMouseDown={() => handleProjectSelect(project)}
                      >
                        <div className="font-medium text-gray-900">{project.name}</div>
                        <div className="text-xs text-gray-500">{project.locality_name || project.localityName} · {project.sale_count ?? project.saleCount} sale txns</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleViewTransactions}
                disabled={!selectedCity}
                className="h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base disabled:opacity-50"
              >
                View Transactions
              </Button>
            </div>

            {!selectedCity && searchQuery.length > 1 && (
              <div className="mt-4 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Please select a city first to search projects
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trending Cities */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Trending projects in</h2>
            <p className="text-gray-500">Based on # of sale registrations</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {citiesLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-36 rounded-2xl" />
                ))
              : cities.map((city) => (
                  <Link key={city.id} href={`/city/${encodeURIComponent(city.name)}/${city.id}`}>
                    <div className="group cursor-pointer bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-8 text-center hover:shadow-lg hover:border-orange-300 transition-all hover:scale-105">
                      <div className="text-5xl mb-3">{cityIcons[city.id] || city.icon || '🏙️'}</div>
                      <p className="font-semibold text-gray-900">{city.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{city.localitiesCount ?? city._count?.localities ?? ''} localities</p>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Why Pureframe Labs */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-10">Why use Pureframe Labs?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📋', title: 'Government Data', desc: 'Real registration data from official government records — not estimates.' },
              { icon: '⚡', title: 'Instant Access', desc: 'Browse city → locality → project in seconds. No account required to browse.' },
              { icon: '💰', title: 'Save Lakhs', desc: 'Know actual sold prices before you negotiate. Stop overpaying on your dream home.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
