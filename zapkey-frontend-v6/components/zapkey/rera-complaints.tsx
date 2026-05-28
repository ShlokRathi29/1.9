"use client"

import { useState } from "react"
import { Users, ChevronDown } from "lucide-react"

interface YearComplaint {
  year: string
  count: number
}

interface RERAComplaintsProps {
  projectName: string
  totalComplaints: number
  yearWiseBreakup: YearComplaint[]
  benchAssigned: number
  complaintSubmitted: number
  firstHearing: number
  hearingRescheduled: number
  hearingScheduled: number
  objectionSent: number
  orderApproved: number
  remarkApproved: number
  scrutinyCompleted: number
}

export function RERAComplaints({
  projectName,
  totalComplaints,
  yearWiseBreakup,
  benchAssigned,
  complaintSubmitted,
  firstHearing,
  hearingRescheduled,
  hearingScheduled,
  objectionSent,
  orderApproved,
  remarkApproved,
  scrutinyCompleted,
}: RERAComplaintsProps) {
  const [showAllYears, setShowAllYears] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          RERA complaints for {projectName}
        </h2>
        <span className="text-sm text-gray-500">
          Total complaints: <span className="text-orange-500 font-medium">{totalComplaints}</span>
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Year Wise Breakup */}
        <div>
          <h3 className="text-xs font-medium text-gray-500 mb-3">YEAR WISE BREAKUP</h3>
          <div className="space-y-2">
            {yearWiseBreakup.slice(0, showAllYears ? undefined : 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.year}:</span>
                <span className="text-sm font-medium text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
          {yearWiseBreakup.length > 3 && (
            <button 
              onClick={() => setShowAllYears(!showAllYears)}
              className="text-blue-600 text-xs mt-2 flex items-center gap-1"
            >
              View older complaints
              <ChevronDown className={`h-3 w-3 transition-transform ${showAllYears ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatItem label="BENCH ASSIGNED" value={benchAssigned} />
          <StatItem label="COMPLAINT SUBMITTED" value={complaintSubmitted} />
          <StatItem label="FIRST HEARING (CONCILIATION REFUSED)" value={firstHearing} />
          <StatItem label="HEARING RESCHEDULED" value={hearingRescheduled} />
          <StatItem label="HEARING SCHEDULED" value={hearingScheduled} />
          <StatItem label="OBJECTION SEND TO COMPLAINANT" value={objectionSent} />
          <StatItem label="ORDER APPROVED" value={orderApproved} />
          <StatItem label="REMARK APPROVED" value={remarkApproved} />
          <StatItem label="SCRUTINY COMPLETED" value={scrutinyCompleted} />
        </div>
      </div>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex items-center gap-1">
        <Users className="h-4 w-4 text-orange-500" />
        <span className="font-medium text-gray-900">{value}</span>
      </div>
    </div>
  )
}
