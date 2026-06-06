# Pureframe Frontend

Real estate transaction analytics platform built with Next.js 15, TypeScript, TailwindCSS v4, shadcn/ui, and Zustand.

## Setup & Run

### Prerequisites
- Node.js 18+ **or** Bun 1.0+

### With Bun (recommended)
```bash
bun install
bun run dev
```

### With npm
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Route Map

| Route | Page |
|---|---|
| `/` | Homepage â€” hero search + trending cities |
| `/city/[cityName]/[cityId]` | All localities in a city |
| `/location/[cityName]/[locationName]/[locationId]` | All projects in a locality |
| `/project/[cityName]/[locationName]/[projectName]/[projectId]` | Full project detail |
| `/transactions?projectId=X` | Transaction table with filters |
| `/plans` | Token purchase plans |
| `/cart` | Shopping cart |
| `/login` | Login page |
| `/signup` | Signup page |
| `/profile` | User profile |
| `/account` | Account (orders, history) |
| `/alerts` | Notifications |
| `/favorites` | Saved transactions |
| `/viewed-transactions` | History of viewed transactions |

## Architecture Notes

- **State**: Zustand store in `lib/store.ts` â€” replace with real API calls when backend is ready
- **Mock Data**: `lib/mock-data.ts` â€” swap with API calls to Bun+Hono backend
- **Components**: `components/pureframe/` â€” domain components; `components/ui/` â€” shadcn/ui
- **Auth**: Currently mocked â€” wire to `POST /api/v1/auth/signup` and `/api/v1/auth/login`
- **Token Reveal**: Transactions table uses 1 token per reveal â€” wire to backend unlock API

## Connecting Backend (Bun + Hono)

1. Create `lib/api.ts` with an axios instance pointing to your backend
2. Replace mock calls in pages with real API functions
3. Add JWT handling in the axios interceptor
4. Wire `/plans` page to Razorpay payment flow

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```
