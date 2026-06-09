'use client'
import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { Footer } from '@/components/pureframe/footer'
import { ProjectDetailHeader } from '@/components/pureframe/project-detail-header'
import { BHKAnalysis } from '@/components/pureframe/bhk-analysis'
import { ProjectTowers } from '@/components/pureframe/project-towers'
import { RecentTransactions } from '@/components/pureframe/recent-transactions'
import { Amenities } from '@/components/pureframe/amenities'
import { Litigations } from '@/components/pureframe/litigations'
import { RERAComplaints } from '@/components/pureframe/rera-complaints'
import { MapNeighborhood } from '@/components/pureframe/map-neighborhood'
import { FAQSection } from '@/components/pureframe/faq-section'
import { RERANumbers } from '@/components/pureframe/rera-numbers'
import { TrendingProjects } from '@/components/pureframe/trending-projects'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { projects as mockProjects, localities as mockLocalities, cities as mockCities } from '@/lib/mock-data'
import { projects as projectsApi, unlock as unlockApi } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
const bhkData = [
  { type: '1 BHK', sizeRange: '470 - 605 sqft', totalUnits: 3078, unitsSold: 3018, percentSold: 98 },
  { type: '2 BHK', sizeRange: '540 - 980 sqft', totalUnits: 5477, unitsSold: 4181, percentSold: 80 },
  { type: '3 BHK', sizeRange: '1070 - 1390 sqft', totalUnits: 1733, unitsSold: 958, percentSold: 55 },
  { type: '4 BHK', sizeRange: '1610 - 1850 sqft', totalUnits: 82, unitsSold: 18, percentSold: 22 },
  { type: 'Row House', sizeRange: '1110 - 1710 sqft', totalUnits: 98, unitsSold: 93, percentSold: 95 },
]
const towersData = [
  { name: 'A', reraNumber: 'P52100002646', completionDate: 'Dec-2027', unitsSold: '700', totalUnits: '794', percentSold: 88 },
  { name: 'B', reraNumber: 'P52100002647', completionDate: 'Dec-2027', unitsSold: '784', totalUnits: '794', percentSold: 99 },
  { name: 'C', reraNumber: 'P52100002648', completionDate: 'Jun-2028', unitsSold: '522', totalUnits: '692', percentSold: 75 },
  { name: 'D', reraNumber: 'P52100002649', completionDate: 'Jun-2028', unitsSold: '64', totalUnits: '692', percentSold: 9 },
]
const transactionsData = [
  { date: 'May, 2026', type: 'Sale' as const, floorTower: '14, II', unit: '1506', amount: '₹ 92.50 Lac' },
  { date: 'May, 2026', type: 'Sale' as const, floorTower: '4, -', unit: '403', amount: '₹ 85.30 Lac' },
  { date: 'Apr, 2026', type: 'Sale' as const, floorTower: '6, I', unit: '601', amount: '₹ 78.00 Lac' },
  { date: 'Apr, 2026', type: 'Rent' as const, floorTower: '2, A', unit: '201', amount: '₹ 28,000/mo' },
  { date: 'Mar, 2026', type: 'Sale' as const, floorTower: '8, B', unit: '802', amount: '₹ 95.75 Lac' },
  { date: 'Feb, 2026', type: 'Rent' as const, floorTower: '5, C', unit: '503', amount: '₹ 25,000/mo' },
]
const amenitiesData = [
  { name: 'Basketball Court', icon: 'basketball' }, { name: 'Gymnasium', icon: 'gymnasium' },
  { name: 'Indoor Games', icon: 'indoor-games' }, { name: 'Swimming Pool', icon: 'swimming' },
  { name: 'Yoga Centre', icon: 'yoga' }, { name: 'Cricket Ground', icon: 'cricket' },
  { name: 'Jogging Track', icon: 'jogging' }, { name: 'Community Hall', icon: 'community' },
  { name: 'Tennis Court', icon: 'tennis' }, { name: 'Children Play Area', icon: 'play-area' },
  { name: 'Landscaped Garden', icon: 'garden' }, { name: 'Skating Rink', icon: 'skating' },
]
const reraNumbersData = [
  { id: 'P52100002646' }, { id: 'P52100005460' },
  { id: 'P52100002682' }, { id: 'P52100057117' },
]
export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { tokens, deductTokens, user } = useAppStore()
  const cityName = decodeURIComponent(params.cityName as string)
  const locationName = decodeURIComponent((params.locationName as string).replace(/-/g, ' '))
  const projectName = decodeURIComponent((params.projectName as string).replace(/-/g, ' '))
  const projectId = params.projectId as string
  const [projectData, setProjectData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [requiresUnlock, setRequiresUnlock] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const fetchProject = async () => {
    setLoading(true)
    try {
      const res = await projectsApi.getDetail(projectId)
      setProjectData(res.project ?? res)
      setRequiresUnlock(res.requiresUnlock ?? false)
    } catch (err: any) {
      if (err.status === 404) {
        const mock = mockProjects.find((p) => p.id === projectId)
        setProjectData(mock ?? null)
        setRequiresUnlock(false)
      } else {
        toast({ title: 'Something went wrong. Please try again.', variant: 'destructive' })
      }
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { fetchProject() }, [projectId])
  const handleUnlock = async () => {
    if (!user) {
      router.push(`/login?redirect=/project/${encodeURIComponent(cityName)}/${encodeURIComponent(locationName)}/${encodeURIComponent(projectName)}/${projectId}`)
      return
    }
    if (tokens < 1) return
    setUnlocking(true)
    try {
      await unlockApi.unlockProject(projectId)
      deductTokens(1)
      toast({ title: 'Project unlocked!', description: 'Full transaction data is now visible.' })
      setRequiresUnlock(false)
      await fetchProject()
    } catch (err: any) {
      if (err.status === 401) {
        router.push('/login')
      } else if (err.status === 402) {
        toast({ title: 'Not enough tokens — buy more', description: '', variant: 'destructive' })
      } else {
        toast({ title: 'Something went wrong. Please try again.', variant: 'destructive' })
      }
    } finally {
      setUnlocking(false)
    }
  }
  const mockProject = useMemo(() => mockProjects.find((p) => p.id === projectId), [projectId])
  const mockLocality = useMemo(() => mockLocalities.find((l) => l.id === mockProject?.localityId), [mockProject])
  const mockCity = useMemo(() => mockCities.find((c) => c.id === mockLocality?.cityId), [mockLocality])
  const trendingProjectsData = useMemo(() =>
    mockProjects
      .filter((p) => p.localityId === mockProject?.localityId && p.id !== projectId)
      .slice(0, 10)
      .map((p) => ({
        name: p.name,
        href: `/project/${encodeURIComponent(mockCity?.name ?? cityName)}/${encodeURIComponent(mockLocality?.name ?? locationName)}/${encodeURIComponent(p.name)}/${p.id}`,
        hasRera: p.isRERA,
      })),
    [mockProject, projectId, mockCity, mockLocality, cityName, locationName]
  )
  const displayProjectName = projectData?.name ?? projectName
  const displayLocationName = projectData?.localityName ?? mockLocality?.name ?? locationName
  const displayCityName = projectData?.cityName ?? mockCity?.name ?? cityName
  const cityIdNum = mockCity ? parseInt(mockCity.id, 10) : 2
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ProfileSidebar />
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
      ) : (
        <>
          {}
          {requiresUnlock && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Unlock {displayProjectName}
                </h2>
                {!user ? (
                  <>
                    <p className="text-gray-500 mb-6">Sign in to unlock this project for <span className="font-semibold text-gray-900">1 token</span></p>
                    <Link href={`/login`} className="block mb-3">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold h-11 rounded-xl">
                        Sign in to Unlock
                      </Button>
                    </Link>
                    <Link href="/signup" className="block mb-3">
                      <Button variant="outline" className="w-full h-11 rounded-xl border-orange-300 text-orange-600">
                        Create free account
                      </Button>
                    </Link>
                  </>
                ) : tokens > 0 ? (
                  <>
                    <p className="text-gray-500 mb-1">Cost: <span className="font-semibold text-gray-900">1 token</span></p>
                    <p className="text-sm text-gray-400 mb-6">
                      Your balance: <span className="font-semibold text-orange-600">{tokens} tokens</span>
                    </p>
                    <Button
                      onClick={handleUnlock}
                      disabled={unlocking}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold h-11 rounded-xl mb-3"
                    >
                      {unlocking ? 'Unlocking...' : 'Unlock Now'}
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 mb-6">You have <span className="font-semibold text-red-500">0 tokens</span>. Buy more to unlock projects.</p>
                    <Link href="/plans" className="block mb-3">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold h-11 rounded-xl">
                        Buy tokens
                      </Button>
                    </Link>
                  </>
                )}
                <Button variant="ghost" onClick={() => router.back()} className="w-full text-gray-500">
                  Go back
                </Button>
              </div>
            </div>
          )}
          <ProjectDetailHeader
            projectName={displayProjectName}
            location={displayLocationName}
            cityName={displayCityName}
            totalArea={projectData?.totalArea ?? '65,896'}
            saleIndex={projectData?.saleCount?.toLocaleString() ?? (mockProject?.saleCount.toLocaleString() ?? '2,486')}
            constructionPeriod={projectData?.constructionPeriod ?? 'Dec 2019 - Sep 2029'}
            rating={projectData?.rating ?? '4.2'}
            expectedPricing={projectData?.expectedPricing ?? '57 Lac - 1.2 Cr'}
            developer={projectData?.developer ?? 'Kolte Patil Developers'}
            reraNumbers={projectData?.reraNumbers ?? ['P52100002646', 'P52100005460', '+2']}
            lastSoldDate={projectData?.lastSoldDate ?? 'May 2026'}
            lastSoldPrice={projectData?.lastSoldPrice ?? '92.50 Lac'}
          />
          <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            <BHKAnalysis
              projectName={displayProjectName}
              totalUnitsSold={projectData?.totalUnitsSold ?? 8268}
              totalUnits={projectData?.totalUnits ?? 11168}
              data={projectData?.bhkData ?? bhkData}
            />
            <ProjectTowers towers={projectData?.towers ?? towersData} />
            <RecentTransactions transactions={projectData?.recentTransactions ?? transactionsData} totalTransactions={projectData?.saleCount ?? 616} />
            <Amenities projectName={displayProjectName} amenities={projectData?.amenities ?? amenitiesData} />
            <Litigations
              projectName={displayProjectName}
              civilCases={projectData?.civilCases ?? 12}
              blankCases={projectData?.blankCases ?? 1}
              totalCases={projectData?.totalCases ?? 13}
            />
            <RERAComplaints
              projectName={displayProjectName}
              totalComplaints={projectData?.totalComplaints ?? 35}
              yearWiseBreakup={projectData?.yearWiseBreakup ?? [
                { year: '2026', count: 11 }, { year: '2025', count: 19 }, { year: '2024', count: 5 },
              ]}
              benchAssigned={4} complaintSubmitted={4} firstHearing={1}
              hearingRescheduled={1} hearingScheduled={3} objectionSent={4}
              orderApproved={13} remarkApproved={6} scrutinyCompleted={7}
            />
            <MapNeighborhood projectName={displayProjectName} />
            <FAQSection locationName={displayLocationName} />
            <RERANumbers projectName={displayProjectName} reraNumbers={projectData?.reraNumbers?.map((id: string) => ({ id })) ?? reraNumbersData} />
            {trendingProjectsData.length > 0 && (
              <TrendingProjects location={displayLocationName} projects={trendingProjectsData} />
            )}
          </main>
        </>
      )}
      <Footer />
    </div>
  )
}
