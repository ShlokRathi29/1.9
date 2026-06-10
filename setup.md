# Pureframe Labs - Project Setup Guide

This guide provides step-by-step instructions to set up and run the full-stack Pureframe Labs project (1.9 Dashboard & Backend) on a new machine. 

## Prerequisites

### 1. Install Node.js
We recommend using a stable version of Node.js (v18 or above).
- Download and install Node.js from the official website: [Node.js Downloads](https://nodejs.org/)
- Verify the installation by running the following commands in your terminal:
  ```bash
  node -v
  npm -v
  ```

### 2. Install pnpm
This project uses **pnpm** as its package manager.
- Install pnpm globally via npm:
  ```bash
  npm install -g pnpm
  ```
- Verify the installation:
  ```bash
  pnpm -v
  ```

### 3. Install and Setup PostgreSQL
The backend uses PostgreSQL as its database.
- Download and install PostgreSQL from the [official website](https://www.postgresql.org/download/).
- During installation, remember the password you set for the default `postgres` user.
- Alternatively, you can use a cloud PostgreSQL provider like [Supabase](https://supabase.com/) or [Neon](https://neon.tech/) to get a free hosted database URL.

---

## Backend Setup (Pureframe Backend)

1. **Navigate to the backend directory:**
   ```bash
   cd pureframe-backend
   ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment Configuration:**
   - Create a `.env` file in the `pureframe-backend` root folder.
   - Add the necessary environment variables. The most critical one is the database URL.
   ```env
   # Example PostgreSQL Connection String
   # Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/pureframe"
   JWT_SECRET="your_secure_jwt_secret"
   JWT_EXPIRES_IN="7d"

   # MSG91 OTP (used for signup verification)
   MSG91_AUTHKEY="your_msg91_authkey"

   # External Integrations (Optional for basic running)
   RAZORPAY_KEY_ID="your_razorpay_key"
   RAZORPAY_KEY_SECRET="your_razorpay_secret"
   ```

4. **Initialize the Database:**
   - Run Prisma commands to generate the client and push the schema to your database.
   ```bash
   pnpm run db:generate
   pnpm run db:push
   ```
   *(Note: Ensure your PostgreSQL server is running and the credentials in `.env` are correct before executing this).*

5. **Start the Backend Server:**
   ```bash
   pnpm run dev
   ```
   The backend should now be running on `http://localhost:3001`.

---

## Frontend Setup (1.9 Dashboard)

1. **Open a new terminal window** and navigate to the frontend directory:
   ```bash
   cd 1.9_Dashboard
   ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment Configuration:**
   - Create a `.env.local` file in the `1.9_Dashboard` directory.
   - Configure the environment variables:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3001"

   # MSG91 OTP (used for signup verification only; login uses password)
   NEXT_PUBLIC_MSG91_WIDGET_ID="your_msg91_widget_id"
   NEXT_PUBLIC_MSG91_TOKEN_AUTH="your_msg91_token_auth"
   ```

4. **Start the Frontend Server:**
   ```bash
   pnpm run dev
   ```
   The Next.js frontend will start at `http://localhost:3000`.

---

## Authentication

- **Login:** Password-based authentication only (phone or email + password).
- **Signup:** Uses MSG91 OTP verification for phone/email, followed by account creation with a password.

---

## Managing the Database

To easily view and manage your database via a web interface, open a new terminal in the backend directory and run:
```bash
pnpm run db:studio
```
This will open **Prisma Studio** in your default web browser at `http://localhost:5555`.
