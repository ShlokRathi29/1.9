'use client'

import { create } from 'zustand'
import { User, CartItem, ViewedTransaction } from './types'

interface AppStore {
  user: User | null
  setUser: (user: User | null) => void

  tokens: number
  setTokens: (amount: number) => void
  deductTokens: (amount: number) => void
  addTokens: (amount: number) => void

  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (projectId: string) => void
  clearCart: () => void

  viewedTransactions: ViewedTransaction[]
  addViewedTransaction: (transaction: ViewedTransaction) => void

  favoriteTransactionIds: string[]
  toggleFavorite: (transactionId: string) => void
  isFavorite: (transactionId: string) => boolean

  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppStore>()((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),

  tokens: 0, // 0 until Navbar syncs real value from /user/me
  setTokens: (amount) => set({ tokens: amount }),
  deductTokens: (amount) => set((state) => ({ tokens: Math.max(0, state.tokens - amount) })),
  addTokens: (amount) => set((state) => ({ tokens: state.tokens + amount })),

  cart: [],
  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((c) => c.projectId === item.projectId)
      if (existing) {
        return { cart: state.cart.map((c) => c.projectId === item.projectId ? { ...c, tokens: c.tokens + item.tokens } : c) }
      }
      return { cart: [...state.cart, item] }
    }),
  removeFromCart: (projectId) => set((state) => ({ cart: state.cart.filter((i) => i.projectId !== projectId) })),
  clearCart: () => set({ cart: [] }),

  viewedTransactions: [],
  addViewedTransaction: (transaction) =>
    set((state) => {
      if (state.viewedTransactions.find((t) => t.id === transaction.id)) return state
      return { viewedTransactions: [transaction, ...state.viewedTransactions] }
    }),

  favoriteTransactionIds: [],
  toggleFavorite: (transactionId) =>
    set((state) => ({
      favoriteTransactionIds: state.favoriteTransactionIds.includes(transactionId)
        ? state.favoriteTransactionIds.filter((id) => id !== transactionId)
        : [...state.favoriteTransactionIds, transactionId],
    })),
  isFavorite: (transactionId) => get().favoriteTransactionIds.includes(transactionId),

  isSidebarOpen: false,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}))
