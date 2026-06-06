'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { localities, cities } from '@/lib/mock-data'

// This route exists for backward compatibility with v2 links
// It redirects to the new /location/[cityName]/[locationName]/[id] route
export default function LocalityRedirectPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    const locality = localities.find((l) => l.id === id)
    if (locality) {
      const city = cities.find((c) => c.id === locality.cityId)
      if (city) {
        router.replace(`/location/${encodeURIComponent(city.name)}/${encodeURIComponent(locality.name)}/${id}`)
        return
      }
    }
    router.replace('/')
  }, [id, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">Redirecting...</div>
    </div>
  )
}
