# Pureframe Labs - Project Setup Guide

This guide provides step-by-step instructions to set up and run the full-stack Pureframe Labs project (Zapkey Frontend v6 & Backend) on a new machine. 

## Prerequisites

### 1. Install Node.js
We recommend using a stable version of Node.js (v18 or above).
- Download and install Node.js from the official website: [Node.js Downloads](https://nodejs.org/)
- Verify the installation by running the following commands in your terminal:
  ```bash
  node -v
  npm -v
  ```

### 2. Install Bun
This project uses **Bun** as its primary package manager and JavaScript runtime.
- Install Bun by following the instructions on [Bun's official site](https://bun.sh/). 
- For Windows (using PowerShell):
  ```powershell
  powershell -c "irm bun.sh/install | iex"
  ```
- Verify the installation:
  ```bash
  bun -v
  ```

### 3. Install and Setup PostgreSQL
The backend uses PostgreSQL as its database.
- Download and install PostgreSQL from the [official website](https://www.postgresql.org/download/).
- During installation, remember the password you set for the default `postgres` user.
- Alternatively, you can use a cloud PostgreSQL provider like [Supabase](https://supabase.com/) or [Neon](https://neon.tech/) to get a free hosted database URL.

---

## Backend Setup (Zapkey Backend)

1. **Navigate to the backend directory:**
   ```bash
   cd zapkey-backend
   ```

2. **Install Dependencies:**
   ```bash
   bun install
   ```

3. **Environment Configuration:**
   - Create a `.env` file in the `zapkey-backend` root folder.
   - Add the necessary environment variables. The most critical one is the database URL.
   ```env
   # Example PostgreSQL Connection String
   # Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/zapkey"
   JWT_SECRET="your_secure_jwt_secret"
   JWT_EXPIRES_IN="7d"
   
   # External Integrations (Optional for basic running)
   RAZORPAY_KEY_ID="your_razorpay_key"
   RAZORPAY_KEY_SECRET="your_razorpay_secret"
   ```

4. **Initialize the Database:**
   - Run Prisma commands to generate the client and push the schema to your database.
   ```bash
   bun run db:generate
   bun run db:push
   ```
   *(Note: Ensure your PostgreSQL server is running and the credentials in `.env` are correct before executing this).*

5. **Start the Backend Server:**
   ```bash
   bun run dev
   ```
   The backend should now be running.

---

## Frontend Setup (Zapkey Frontend v6)

1. **Open a new terminal window** and navigate to the frontend directory:
   ```bash
   cd zapkey-frontend-v6
   ```

2. **Install Dependencies:**
   ```bash
   bun install
   ```

3. **Environment Configuration:**
   - Create a `.env.local` file in the `zapkey-frontend-v6` directory.
   - Configure the environment variables to point to the backend:
   ```env
   # Update this port based on what the backend prints when it starts
   NEXT_PUBLIC_API_URL="http://localhost:3000" 
   ```

4. **Start the Frontend Server:**
   ```bash
   bun run dev
   ```
   The Next.js frontend will start and typically be accessible at `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied by the backend).

---

## Managing the Database

To easily view and manage your database via a web interface, open a new terminal in the backend directory and run:
```bash
bun run db:studio
```
This will open **Prisma Studio** in your default web browser at `http://localhost:5555`.
