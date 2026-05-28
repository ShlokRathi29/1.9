export interface City {
  id: string
  name: string
  icon: string
  localitiesCount: number
}

export interface Locality {
  id: string
  name: string
  cityId: string
  saleCount: number
}

export interface Project {
  id: string
  name: string
  localityId: string
  saleCount: number
  isRERA: boolean
}

export interface Transaction {
  id: string
  projectId: string
  projectName: string
  date: string
  type: 'Sale' | 'Rent'
  floorTower: string
  unit: string
  amount: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  tokens: number
  avatar?: string
}

export interface Plan {
  id: string
  name: string
  price: number
  transactions: number
  description: string
  recommended?: boolean
}

export interface CartItem {
  projectId: string
  projectName: string
  tokens: number
}

export interface ViewedTransaction {
  id: string
  transaction: Transaction
  viewedAt: string
}
