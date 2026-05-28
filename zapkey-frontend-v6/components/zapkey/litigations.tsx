"use client"

import { Scale, FileX } from "lucide-react"

interface LitigationsProps {
  projectName: string
  civilCases: number
  blankCases: number
  totalCases: number
}

export function Litigations({ projectName, civilCases, blankCases, totalCases }: LitigationsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Litigations related to {projectName}
        </h2>
        <span className="text-sm text-gray-500">
          Total cases: <span className="text-orange-500 font-medium">{totalCases}</span>
        </span>
      </div>
      
      <div className="flex gap-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 rounded-lg p-3">
            <Scale className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">CIVIL CASES</p>
            <p className="text-xl font-bold text-gray-900">{civilCases}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 rounded-lg p-3">
            <FileX className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">BLANK</p>
            <p className="text-xl font-bold text-gray-900">{blankCases}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
