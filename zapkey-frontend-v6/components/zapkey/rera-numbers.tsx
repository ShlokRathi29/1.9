"use client"

import { Building2 } from "lucide-react"

interface RERANumber {
  id: string
  imageUrl?: string
}

interface RERANumbersProps {
  projectName: string
  reraNumbers: RERANumber[]
}

export function RERANumbers({ projectName, reraNumbers }: RERANumbersProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        RERA Numbers for {projectName}
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {reraNumbers.map((rera, index) => (
          <div key={index} className="text-center">
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-4 h-24 flex items-center justify-center mb-2">
              <Building2 className="h-10 w-10 text-orange-400" />
            </div>
            <p className="text-xs text-gray-600 truncate">{rera.id}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-400">
        This project is registered under MahaRERA as available at: https://maharera.mahaonline.gov.in
      </p>
    </div>
  )
}
