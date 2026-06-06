import { City, Locality, Project, Transaction, Plan } from './types'

export const cities: City[] = [
  { id: '1', name: 'Mumbai', icon: '🏙️', localitiesCount: 180 },
  { id: '2', name: 'Pune', icon: '🏗️', localitiesCount: 282 },
  { id: '3', name: 'Bangalore', icon: '🌳', localitiesCount: 215 },
  { id: '4', name: 'Hyderabad', icon: '💎', localitiesCount: 198 },
  { id: '5', name: 'Chennai', icon: '🌊', localitiesCount: 176 },
  { id: '6', name: 'Noida', icon: '🏢', localitiesCount: 145 },
  { id: '7', name: 'Delhi', icon: '🏛️', localitiesCount: 210 },
  { id: '8', name: 'Ahmedabad', icon: '🌞', localitiesCount: 134 },
]

export const localities: Locality[] = [
  // Pune (cityId: '2')
  { id: '1-1', name: 'Wagholi', cityId: '2', saleCount: 5506 },
  { id: '1-2', name: 'Hinjewadi', cityId: '2', saleCount: 4190 },
  { id: '1-3', name: 'Hadapsar', cityId: '2', saleCount: 3741 },
  { id: '1-4', name: 'Moshi', cityId: '2', saleCount: 3561 },
  { id: '1-5', name: 'Tathawade', cityId: '2', saleCount: 3445 },
  { id: '1-6', name: 'Wakad', cityId: '2', saleCount: 3437 },
  { id: '1-7', name: 'Chikhali', cityId: '2', saleCount: 3163 },
  { id: '1-8', name: 'Charholi Budruk', cityId: '2', saleCount: 2797 },
  { id: '1-9', name: 'Kiwale', cityId: '2', saleCount: 2724 },
  { id: '1-10', name: 'Baner', cityId: '2', saleCount: 2628 },
  { id: '1-11', name: 'Ravet', cityId: '2', saleCount: 2506 },
  { id: '1-12', name: 'Kharadi', cityId: '2', saleCount: 2486 },
  { id: '1-13', name: 'Bavdhan', cityId: '2', saleCount: 1960 },
  { id: '1-14', name: 'Chakan', cityId: '2', saleCount: 1850 },
  { id: '1-15', name: 'Undri', cityId: '2', saleCount: 1804 },
  { id: '1-16', name: 'Ambegaon Budruk', cityId: '2', saleCount: 1639 },
  { id: '1-17', name: 'Balewadi', cityId: '2', saleCount: 1593 },
  { id: '1-18', name: 'Kondhwa', cityId: '2', saleCount: 1487 },
  { id: '1-19', name: 'Kothrud', cityId: '2', saleCount: 1424 },
  { id: '1-20', name: 'Punawale', cityId: '2', saleCount: 3651 },
  // Mumbai (cityId: '1')
  { id: '2-1', name: 'Thane', cityId: '1', saleCount: 4200 },
  { id: '2-2', name: 'Andheri', cityId: '1', saleCount: 3800 },
  { id: '2-3', name: 'Powai', cityId: '1', saleCount: 2900 },
  { id: '2-4', name: 'Borivali', cityId: '1', saleCount: 2400 },
  { id: '2-5', name: 'Malad', cityId: '1', saleCount: 2100 },
  // Bangalore (cityId: '3')
  { id: '3-1', name: 'Whitefield', cityId: '3', saleCount: 5100 },
  { id: '3-2', name: 'Electronic City', cityId: '3', saleCount: 4300 },
  { id: '3-3', name: 'Sarjapur Road', cityId: '3', saleCount: 3600 },
  { id: '3-4', name: 'HSR Layout', cityId: '3', saleCount: 2800 },
]

export const projects: Project[] = [
  // Wagholi (1-1)
  { id: '1', name: 'Geras Island of Joy', localityId: '1-1', saleCount: 520, isRERA: true },
  { id: '2', name: 'VI Yashwin Enchante Phase 1', localityId: '1-1', saleCount: 433, isRERA: true },
  { id: '3', name: 'Flamante By VTP Luxe Phase 1', localityId: '1-1', saleCount: 258, isRERA: true },
  { id: '4', name: 'Rohan Abhilasha', localityId: '1-1', saleCount: 238, isRERA: true },
  { id: '5', name: 'Mahindra IvyLush', localityId: '1-1', saleCount: 231, isRERA: true },
  { id: '6', name: 'Kolte Patil Springshire', localityId: '1-1', saleCount: 172, isRERA: false },
  // Hinjewadi (1-2)
  { id: '7', name: 'Kolte Patil Life Republic', localityId: '1-2', saleCount: 1540, isRERA: true },
  { id: '8', name: 'The Gale at Godrej Park World', localityId: '1-2', saleCount: 851, isRERA: true },
  { id: '9', name: 'Paranjape Blue Ridge', localityId: '1-2', saleCount: 540, isRERA: true },
  { id: '10', name: 'VTP Monarque', localityId: '1-2', saleCount: 99, isRERA: true },
  { id: '11', name: 'Godrej 24', localityId: '1-2', saleCount: 31, isRERA: true },
  { id: '12', name: 'Rohan Nidita Phase 1', localityId: '1-2', saleCount: 41, isRERA: true },
  // Kharadi (1-12)
  { id: '13', name: 'Geras Trinity Towers', localityId: '1-12', saleCount: 616, isRERA: true },
  { id: '14', name: 'Kohinoor Flamante', localityId: '1-12', saleCount: 280, isRERA: true },
  { id: '15', name: 'Vilas Javdekar Paloma', localityId: '1-12', saleCount: 195, isRERA: false },
  // Baner (1-10)
  { id: '16', name: 'Godrej Avenues', localityId: '1-10', saleCount: 450, isRERA: true },
  { id: '17', name: 'Kumar Pristine', localityId: '1-10', saleCount: 320, isRERA: true },
]

export const transactions: Transaction[] = [
  { id: '1', projectId: '13', projectName: 'Geras Trinity Towers', date: '17 Mar, 2026', type: 'Sale', floorTower: '14, II', unit: '1506', amount: '₹92.50 Lac' },
  { id: '2', projectId: '13', projectName: 'Geras Trinity Towers', date: '16 Mar, 2026', type: 'Mortgage', floorTower: '-', unit: '1407', amount: '₹65.00 Lac' },
  { id: '3', projectId: '13', projectName: 'Geras Trinity Towers', date: '9 Feb, 2026', type: 'Rent', floorTower: '8', unit: '1-805', amount: '₹28,000/mo' },
  { id: '4', projectId: '13', projectName: 'Geras Trinity Towers', date: '5 Feb, 2026', type: 'Sale', floorTower: '6, I', unit: '601', amount: '₹78.00 Lac' },
  { id: '5', projectId: '13', projectName: 'Geras Trinity Towers', date: '20 Jan, 2026', type: 'Rent', floorTower: '5', unit: '1-505', amount: '₹25,000/mo' },
  { id: '6', projectId: '1', projectName: 'Geras Island of Joy', date: '8 Oct, 2025', type: 'Sale', floorTower: '2', unit: '201', amount: '₹49.50 Lac' },
  { id: '7', projectId: '1', projectName: 'Geras Island of Joy', date: '15 Oct, 2025', type: 'Sale', floorTower: '3', unit: '305', amount: '₹52.25 Lac' },
  { id: '8', projectId: '7', projectName: 'Kolte Patil Life Republic', date: '5 Nov, 2025', type: 'Sale', floorTower: '5', unit: '501', amount: '₹68.50 Lac' },
  { id: '9', projectId: '7', projectName: 'Kolte Patil Life Republic', date: '12 Nov, 2025', type: 'Sale', floorTower: '6', unit: '603', amount: '₹71.00 Lac' },
  { id: '10', projectId: '9', projectName: 'Paranjape Blue Ridge', date: '1 Dec, 2025', type: 'Sale', floorTower: '2', unit: '205', amount: '₹62.75 Lac' },
]

export const plans: Plan[] = [
  {
    id: '1',
    name: 'Lite',
    price: 499,
    transactions: 15,
    description: 'Recommended for Sellers. Best if you are looking to know the best price to negotiate in a project.',
  },
  {
    id: '2',
    name: 'Plus',
    price: 2499,
    transactions: 150,
    description: 'Recommended for Brokers and Buyers. Best if you want to track activity across multiple buildings in a locality.',
    recommended: true,
  },
  {
    id: '3',
    name: 'Premium',
    price: 9999,
    transactions: 1000,
    description: 'Recommended for research. Best if you want to analyze trends across projects in a city.',
  },
]
