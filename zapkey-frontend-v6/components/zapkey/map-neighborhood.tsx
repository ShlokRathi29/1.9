"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"

interface MapNeighborhoodProps {
  projectName: string
  latitude?: number
  longitude?: number
}

export function MapNeighborhood({ projectName, latitude = 18.5912, longitude = 73.7389 }: MapNeighborhoodProps) {
  const [activeTab, setActiveTab] = useState<"map" | "satellite">("map")

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Map & Neighborhood</h2>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("map")}
          className={`px-3 py-1 text-sm rounded ${
            activeTab === "map"
              ? "bg-gray-100 text-gray-900 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setActiveTab("satellite")}
          className={`px-3 py-1 text-sm rounded ${
            activeTab === "satellite"
              ? "bg-gray-100 text-gray-900 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Satellite
        </button>
      </div>

      {/* Map Container */}
      <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden">
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15125.!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDM1JzI4LjMiTiA3M8KwNDQnMjAuMCJF!5e0!3m2!1sen!2sin!4v1`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        />
        
        {/* Fallback if iframe doesn't load */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-orange-500 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">{projectName}</p>
            <p className="text-gray-400 text-sm">Hinjawadi, Pune</p>
          </div>
        </div>
      </div>

      {/* See places nearby */}
      <div className="mt-4 flex justify-end">
        <button className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline">
          <MapPin className="h-4 w-4" />
          See places nearby
        </button>
      </div>
    </div>
  )
}
