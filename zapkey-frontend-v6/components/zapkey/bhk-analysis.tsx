"use client"

import { useState } from "react"
import { ChevronDown, Printer, FileSpreadsheet } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BHKData {
  type: string
  sizeRange: string
  totalUnits: number
  unitsSold: number
  percentSold: number
}

interface BHKAnalysisProps {
  projectName: string
  totalUnitsSold: number
  totalUnits: number
  data: BHKData[]
}

export function BHKAnalysis({ projectName, totalUnitsSold, totalUnits, data }: BHKAnalysisProps) {
  const [selectedBHK, setSelectedBHK] = useState("all")

  const filteredData = selectedBHK === "all" 
    ? data 
    : data.filter(d => d.type.toLowerCase().includes(selectedBHK))

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {projectName} BHK Analysis
          </h2>
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedBHK} onValueChange={setSelectedBHK}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="1 bhk">1 BHK</SelectItem>
              <SelectItem value="2 bhk">2 BHK</SelectItem>
              <SelectItem value="3 bhk">3 BHK</SelectItem>
              <SelectItem value="4 bhk">4 BHK</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-gray-400">Last updated on: MonthName, Sep 2025</span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Disclaimer
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="bg-blue-100 rounded-full p-3">
          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-500">UNITS SOLD</p>
          <p className="text-xl font-bold text-gray-900">{totalUnitsSold.toLocaleString()} of {totalUnits.toLocaleString()}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="p-2 hover:bg-gray-200 rounded">
            <Printer className="h-5 w-5 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded">
            <FileSpreadsheet className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">BHK</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">TOTAL UNITS</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">UNITS SOLD</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">% UNITS SOLD</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-900">{row.type}</span>
                  <span className="text-gray-400 text-sm ml-1">({row.sizeRange})</span>
                </td>
                <td className="py-3 px-4 text-gray-700">{row.totalUnits.toLocaleString()}</td>
                <td className="py-3 px-4 text-gray-700">{row.unitsSold.toLocaleString()}</td>
                <td className="py-3 px-4 text-gray-700">{row.percentSold}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
