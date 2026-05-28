"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface TrendingProject {
  name: string
  href: string
  hasRera: boolean
}

interface TrendingProjectsProps {
  location: string
  projects: TrendingProject[]
}

export function TrendingProjects({ location, projects }: TrendingProjectsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Trending projects in {location}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <Link
            key={index}
            href={project.href}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-400">→</span>
              <span className="text-gray-700">{project.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {project.hasRera && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <span className="text-green-500">✓</span> RERA
                </span>
              )}
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
