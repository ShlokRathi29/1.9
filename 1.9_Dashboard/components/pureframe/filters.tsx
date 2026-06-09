"use client"
import { Calendar, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
interface FiltersProps {
  onClearAll?: () => void
}
export function Filters({ onClearAll }: FiltersProps) {
  return (
    <div className="w-[240px] shrink-0">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          <button
            onClick={onClearAll}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        </div>
        {}
        <div className="mb-6">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Transaction Type
          </h4>
          <RadioGroup defaultValue="sale" className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sale" id="sale" />
              <Label htmlFor="sale" className="text-sm font-normal text-gray-700">
                Sale
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rent" id="rent" />
              <Label htmlFor="rent" className="text-sm font-normal text-gray-700">
                Rent
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mortgage" id="mortgage" />
              <Label htmlFor="mortgage" className="text-sm font-normal text-gray-700">
                Mortgage
              </Label>
            </div>
          </RadioGroup>
        </div>
        {}
        <div className="mb-6">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Registration Date
          </h4>
          <div className="space-y-3">
            <div className="relative">
              <Input
                placeholder="Start Date"
                className="border-gray-200 pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                placeholder="End Date"
                className="border-gray-200 pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
        {}
        <div className="mb-6">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Min Area <span className="text-gray-400">(Sq.Ft.)</span>
            <span className="ml-4">Max Area <span className="text-gray-400">(Sq.Ft.)</span></span>
          </h4>
          <div className="flex gap-2">
            <Input placeholder="Min Area" className="border-gray-200" />
            <Input placeholder="Max Area" className="border-gray-200" />
          </div>
        </div>
        {}
        <div className="mb-6">
          <h4 className="mb-3 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Floor
            <Info className="h-3 w-3 text-gray-400" />
          </h4>
          <Input placeholder="Floor" className="border-gray-200" />
        </div>
        {}
        <div className="mb-6">
          <h4 className="mb-3 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Unit
            <Info className="h-3 w-3 text-gray-400" />
          </h4>
          <Input placeholder="Unit" className="border-gray-200" />
        </div>
        {}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h4 className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Instant Agreement
              <Info className="h-3 w-3 text-gray-400" />
            </h4>
            <div className="flex items-center gap-2">
              <Switch />
              <span className="text-orange-500">⚡</span>
            </div>
          </div>
        </div>
        {}
        <Button className="w-full bg-orange-500 text-white hover:bg-orange-600">
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
