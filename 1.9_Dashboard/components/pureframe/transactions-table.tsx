"use client"

import { Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  id: number
  date: string
  project: string
  location: string
  type: "Sale" | "Rent" | "Mortgage"
  floorTower: string
  unit: string
  amount: string | null
}

const transactions: Transaction[] = [
  { id: 1, date: "17 Mar, 2026", project: "Geras Trinity ...", location: "Kharadi", type: "Mortgage", floorTower: "-", unit: "", amount: null },
  { id: 2, date: "16 Mar, 2026", project: "Geras Trinity ...", location: "Kharadi", type: "Sale", floorTower: "14, II", unit: "1506", amount: null },
  { id: 3, date: "9 Feb, 2026", project: "Geras Trinity ...", location: "Kharadi", type: "Rent", floorTower: "8", unit: "1-805", amount: null },
  { id: 4, date: "8 Feb, 2026", project: "Geras Trinity ...", location: "Kharadi", type: "Mortgage", floorTower: "-", unit: "1407", amount: null },
  { id: 5, date: "31 Jan, 2026", project: "Geras Trinity ...", location: "Kharadi", type: "Sale", floorTower: "6, I", unit: "601", amount: null },
  { id: 6, date: "20 Jan, 2026", project: "Geras Trinity ...", location: "Kharadi", type: "Rent", floorTower: "5", unit: "1-505", amount: null },
  { id: 7, date: "16 Jan, 2026", project: "Geras Trinity ...", location: "Kharadi", type: "Rent", floorTower: "1", unit: "11003", amount: null },
  { id: 8, date: "10 Jan, 2026", project: "Geras Trinity ...", location: "Kharadi", type: "Rent", floorTower: "1", unit: "2", amount: null },
  { id: 9, date: "12 Nov, 2025", project: "Geras Trinity ...", location: "Kharadi", type: "Rent", floorTower: "1, 2", unit: "1203", amount: null },
  { id: 10, date: "7 Nov, 2025", project: "Geras Trinity ...", location: "Kharadi", type: "Mortgage", floorTower: "-, 4", unit: "", amount: null },
  { id: 11, date: "4 Nov, 2025", project: "Geras Trinity ...", location: "Kharadi", type: "Rent", floorTower: "1", unit: "1", amount: null },
  { id: 12, date: "17 Oct, 2025", project: "Geras Trinity ...", location: "Kharadi", type: "Rent", floorTower: "-", unit: "", amount: null },
  { id: 13, date: "16 Oct, 2025", project: "Geras Trinity ...", location: "Kharadi", type: "Sale", floorTower: "12, II", unit: "1205", amount: null },
  { id: 14, date: "7 Oct, 2025", project: "Geras Trinity ...", location: "Kharadi", type: "Mortgage", floorTower: "-", unit: "403", amount: null },
  { id: 15, date: "29 Sep, 2025", project: "Geras Trinity ...", location: "Kharadi", type: "Rent", floorTower: "2", unit: "", amount: null },
  { id: 16, date: "26 Sep, 2025", project: "Geras Trinity ...", location: "Kharadi", type: "Sale", floorTower: "4", unit: "10", amount: null },
  { id: 17, date: "25 Sep, 2025", project: "Geras Trinity ...", location: "Kharadi", type: "Sale", floorTower: "4", unit: "403", amount: null },
  { id: 18, date: "18 Sep, 2025", project: "Geras Trinity ...", location: "Kharadi", type: "Rent", floorTower: "1", unit: "1", amount: null },
  { id: 19, date: "3 Sep, 2025", project: "Geras Trinity ...", location: "Kharadi", type: "Rent", floorTower: "1", unit: "1-1002", amount: null },
  { id: 20, date: "2 Sep, 2025", project: "Geras Trinity ...", location: "Kharadi", type: "Rent", floorTower: "5", unit: "", amount: null },
  { id: 21, date: "1 Sep, 2025", project: "Geras Trinity ...", location: "Kharadi", type: "Mortgage", floorTower: "-", unit: "602", amount: null },
  { id: 22, date: "18 Aug, 2025", project: "Geras Trinity ...", location: "Kharadi", type: "Rent", floorTower: "10", unit: "1002", amount: null },
  { id: 23, date: "6 Aug, 2025", project: "Geras Trinity ...", location: "Kharadi", type: "Rent", floorTower: "9", unit: "902", amount: null },
  { id: 24, date: "1 Aug, 2025", project: "Geras Trinity ...", location: "Kharadi", type: "Rent", floorTower: "6", unit: "602", amount: null },
  { id: 25, date: "30 Jul, 2025", project: "Geras Trinity ...", location: "Kharadi", type: "Rent", floorTower: "1", unit: "", amount: null },
]

function getTypeBadgeStyle(type: string) {
  switch (type) {
    case "Sale":
      return "bg-orange-100 text-orange-700 hover:bg-orange-100"
    case "Rent":
      return "bg-green-100 text-green-700 hover:bg-green-100"
    case "Mortgage":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100"
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100"
  }
}

export function TransactionsTable() {
  return (
    <div className="flex-1 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Project
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Floor, Tower
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Unit
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                {transaction.date}
              </td>
              <td className="px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {transaction.project}
                  </div>
                  <div className="text-xs text-gray-500">
                    {transaction.location}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant="secondary"
                  className={getTypeBadgeStyle(transaction.type)}
                >
                  {transaction.type}
                </Badge>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                {transaction.floorTower}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                {transaction.unit}
              </td>
              <td className="px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-100">
                  <Lock className="h-4 w-4 text-orange-500" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
