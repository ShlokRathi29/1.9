'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { Footer } from '@/components/zapkey/footer'
import { LocationBanner } from '@/components/zapkey/location-banner'
import { ProjectCard } from '@/components/zapkey/project-card'
import { CityPagination } from '@/components/zapkey/city-pagination'
import { FAQSection } from '@/components/zapkey/faq-section'
import { Skeleton } from '@/components/ui/skeleton'
import { browse } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { cities as mockCities, localities as mockLocalities, projects as mockProjects } from '@/lib/mock-data'

const ITEMS_PER_PAGE = 30

export default function LocationPage() {
  const params = useParams()
  const { toast } = useToast()
  const cityName = decodeURIComponent(params.cityName as string)
  const locationName = decodeURIComponent((params.locationName as string).replace(/-/g, ' '))
  const locationId = params.locationId as string

  const [projectsList, setProjectsList] = useState<any[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const city = mockCities.find((c) => c.name.toLowerCase() === cityName.toLowerCase())
  const cityIdNum = city ? parseInt(city.id, 10) : 2

  useEffect(() => {
    setLoading(true)
    browse.getLocalityProjects(locationId, currentPage, ITEMS_PER_PAGE)
      .then((res) => {
        setProjectsList(res.data ?? [])
        setTotalItems(res.total ?? 0)
        setTotalPages(res.pages ?? 1)
      })
      .catch(() => {
        const fallback = mockProjects
          .filter((p) => p.localityId === locationId)
          .sort((a, b) => b.saleCount - a.saleCount)
        setProjectsList(fallback.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE))
        setTotalItems(fallback.length)
        setTotalPages(Math.ceil(fallback.length / ITEMS_PER_PAGE))
        toast({ title: 'Something went wrong. Please try again.', variant: 'destructive' })
      })
      .finally(() => setLoading(false))
  }, [locationId, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <ProfileSidebar />
      <LocationBanner
        cityName={cityName}
        cityId={cityIdNum}
        locationName={locationName}
        projectCount={totalItems}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 border-b border-gray-100">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        ) : projectsList.length > 0 ? (
          <>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {projectsList.map((project) => (
                <ProjectCard
                  key={project.id}
                  name={project.name}
                  saleTxns={project.saleCount ?? project._count?.transactions ?? 0}
                  hasRera={project.isRERA ?? false}
                  href={`/project/${encodeURIComponent(cityName)}/${encodeURIComponent(locationName)}/${encodeURIComponent(project.name)}/${project.id}`}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <CityPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
            <p className="text-gray-500 text-lg">No projects found in this locality yet.</p>
          </div>
        )}
      </main>

      <FAQSection locationName={locationName} />
      <Footer />
    </div>
  )
}
