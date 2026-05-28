# Zapkey Backend

Bun + Hono + Prisma REST API for the Zapkey real estate analytics platform.

## Quick Start

### 1. Install dependencies
```bash
bun install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — fill in DATABASE_URL and JWT_SECRET at minimum
```

### 3. Set up the database
```bash
# Make sure PostgreSQL is running, then:
bun run db:migrate          # creates tables from Prisma schema
bun run db:generate         # generates Prisma client
```

### 4. Start the server
```bash
bun run dev                 # dev mode with --watch
bun run start               # production
```

Server runs on **http://localhost:3001**

---

## API Reference

All endpoints prefixed `/api/v1/`. Auth via `Authorization: Bearer <token>`.

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | No | Register, returns JWT + user |
| POST | `/auth/login` | No | Login, returns JWT + user |
| POST | `/auth/logout` | No | Stateless — client discards token |
| GET | `/user/me` | ✅ | Get current user + balance |
| PUT | `/user/me` | ✅ | Update name/email/phone |

### Browse (reads from DB2)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/cities` | No | List all cities |
| GET | `/cities/:cityId/localities` | No | Localities in city (paginated, sorted by sale count) |
| GET | `/localities/:localityId/projects` | No | Projects in locality |
| GET | `/projects/search?city=&q=` | No | Search projects by name |
| GET | `/projects/:projectId` | Optional | Full detail if unlocked, summary if not |
| GET | `/projects/:projectId/transactions` | Optional | Paginated txns; amounts masked if locked |

### Unlock
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/unlock` | ✅ | Unlock project (costs 1 token, 15-day window) |
| GET | `/unlock/status/:projectId` | ✅ | Check unlock status + days remaining |

### Wallet
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/wallet` | ✅ | Balance + last 20 wallet transactions |

### Payments
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/payments/plans` | No | List all plans |
| POST | `/payments/create-order` | ✅ | Create Razorpay order |
| POST | `/payments/verify` | ✅ | Verify HMAC + credit tokens |
| POST | `/payments/webhook` | No | Razorpay webhook (failure handling) |

### Misc
| Method | Path | Description |
|---|---|---|
| GET | `/` | Server info |
| GET | `/api/v1/health` | Health check |

---

## Project Structure

```
src/
├── index.ts              ← Hono app entry, route mounting, CORS
├── config/
│   └── env.ts            ← Centralised env with startup validation
├── db/
│   ├── prisma.ts         ← PrismaClient singleton (DB1)
│   └── db2.ts            ← pg Pool for external DB2 (read-only)
├── middleware/
│   ├── authMiddleware.ts ← JWT verify, requireAuth / optionalAuth
│   └── errorMiddleware.ts← Global error handler + ZodError formatting
├── validators/
│   └── schemas.ts        ← All Zod schemas + inferred types
├── services/
│   ├── authService.ts    ← signup, login, getMe, updateMe
│   ├── projectService.ts ← DB2 queries (mock fallback until DB2 ready)
│   ├── walletService.ts  ← Atomic debit/credit with ledger logging
│   ├── unlockService.ts  ← 15-day project unlock logic
│   └── paymentService.ts ← Razorpay order + HMAC verify
└── routes/
    ├── auth.ts
    ├── cities.ts
    ├── locations.ts
    ├── projects.ts
    ├── unlock.ts
    ├── wallet.ts
    └── payments.ts
prisma/
└── schema.prisma         ← User, UnlockedProject, WalletTransaction, PaymentTransaction
```

---

## Connecting DB2

When the external database is ready:

1. Set `DB2_URL` in `.env`
2. Open `src/services/projectService.ts`
3. For each function, uncomment the `db2Query(...)` block and remove the mock fallback
4. Adjust column names to match the real DB2 schema

The service automatically detects if `DB2_URL` is set and switches from mock to real queries.

---

## Business Rules (enforced in code)

- **1 token = 1 project unlock** for 15 days (`UNLOCK_DURATION_DAYS = 15`)
- **Razorpay HMAC** verified server-side in `paymentService.verifyPayment` before any token credit
- **Wallet is a ledger** — every movement creates a `WalletTransaction` record
- **Atomic transactions** — debit and balance update happen inside `prisma.$transaction()`
- **DB2 is never written to** — only `db2Query` (read-only pool) is used
- **Amounts are masked** in transaction responses until the project is unlocked

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string for DB1 |
| `DB2_URL` | Optional | External DB2. If missing, mock data is used |
| `JWT_SECRET` | ✅ | Min 32-char random secret for JWT signing |
| `JWT_EXPIRES_IN` | No | JWT expiry (default: `7d`) |
| `RAZORPAY_KEY_ID` | Optional | Razorpay key ID (payments disabled if absent) |
| `RAZORPAY_KEY_SECRET` | Optional | Razorpay secret (payments disabled if absent) |
| `PORT` | No | Server port (default: `3001`) |
| `NODE_ENV` | No | `development` or `production` |
| `FRONTEND_URL` | No | CORS origin (default: `http://localhost:3000`) |
