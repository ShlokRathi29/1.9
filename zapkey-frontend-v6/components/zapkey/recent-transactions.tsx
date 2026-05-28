"use client"

import { useState } from "react"
import { Lock, ExternalLink } from "lucide-react"

interface Transaction {
  date: string
  type: "Sale" | "Rent"
  floorTower: string
  unit: string
  amount: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
  totalTransactions: number
}

export function RecentTransactions({ transactions, totalTransactions }: RecentTransactionsProps) {
  const [activeTab, setActiveTab] = useState<"sale" | "rent">("sale")

  const filteredTransactions = transactions.filter(t => 
    activeTab === "sale" ? t.type === "Sale" : t.type === "Rent"
  )

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Negotiate better using Recent Transactions
          </h2>
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
          View {totalTransactions.toLocaleString()} Transactions
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("sale")}
          className={`pb-3 px-1 text-sm font-medium ${
            activeTab === "sale"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Sale
        </button>
        <button
          onClick={() => setActiveTab("rent")}
          className={`pb-3 px-1 text-sm font-medium ${
            activeTab === "rent"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Rent
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">DATE</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">TYPE</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">FLOOR, TOWER</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">UNIT</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.slice(0, 6).map((transaction, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700">{transaction.date}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    transaction.type === "Sale" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700">{transaction.floorTower}</td>
                <td className="py-3 px-4 text-gray-700">{transaction.unit}</td>
                <td className="py-3 px-4 text-gray-700">{transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
