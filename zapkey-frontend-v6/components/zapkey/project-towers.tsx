"use client"

import { QrCode } from "lucide-react"

interface Tower {
  name: string
  reraNumber: string
  completionDate: string
  unitsSold: string
  totalUnits: string
  percentSold: number
}

interface ProjectTowersProps {
  towers: Tower[]
}

export function ProjectTowers({ towers }: ProjectTowersProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">{towers[0]?.reraNumber?.split("P")[0]} Towers</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {towers.map((tower, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{tower.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">Construction</span>
                  <span className="text-xs font-medium text-gray-700">{tower.percentSold}%</span>
                </div>
              </div>
              {/* QR Code placeholder */}
              <div className="bg-gray-100 p-2 rounded">
                <QrCode className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">RERA NO.: </span>
                <span className="text-gray-700">{tower.reraNumber}</span>
              </div>
              <div>
                <span className="text-gray-500">Completion Date: </span>
                <span className="text-gray-700">{tower.completionDate}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500">UNITS SOLD </span>
                  <span className="text-xs font-medium text-orange-500">{tower.percentSold}%</span>
                </div>
              </div>
              <p className="text-gray-900 font-medium mt-1">
                {tower.unitsSold} <span className="text-gray-400">of {tower.totalUnits}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
