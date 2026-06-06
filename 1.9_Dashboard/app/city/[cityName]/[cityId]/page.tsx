'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { Footer } from '@/components/pureframe/footer'
import { CityBanner } from '@/components/pureframe/city-banner'
import { LocalityCard } from '@/components/pureframe/locality-card'
import { CityPagination } from '@/components/pureframe/city-pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { browse } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { cities as mockCities, localities as mockLocalities } from '@/lib/mock-data'

const ITEMS_PER_PAGE = 30

export default function CityPage() {
  const params = useParams()
  const { toast } = useToast()
  const cityName = decodeURIComponent(params.cityName as string)
  const cityId = params.cityId as string

  const [localities, setLocalities] = useState<any[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    browse.getCityLocalities(cityId, currentPage, ITEMS_PER_PAGE)
      .then((res) => {
        setLocalities(res.data ?? [])
        setTotalItems(res.total ?? 0)
        setTotalPages(res.pages ?? 1)
      })
      .catch(() => {
        // Fallback to mock
        const fallback = mockLocalities
          .filter((l) => l.cityId === cityId)
          .sort((a, b) => b.saleCount - a.saleCount)
        setLocalities(fallback.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE))
        setTotalItems(fallback.length)
        setTotalPages(Math.ceil(fallback.length / ITEMS_PER_PAGE))
        toast({ title: 'Something went wrong. Please try again.', variant: 'destructive' })
      })
      .finally(() => setLoading(false))
  }, [cityId, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <ProfileSidebar />
      <CityBanner cityName={cityName} localityCount={totalItems} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localities.map((locality) => (
                <LocalityCard
                  key={locality.id}
                  name={locality.name}
                  transactionCount={locality.saleCount ?? locality._count?.transactions ?? 0}
                  href={`/location/${encodeURIComponent(cityName)}/${encodeURIComponent(locality.name)}/${locality.id}`}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <CityPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
