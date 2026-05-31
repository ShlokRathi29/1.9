import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Pureframe Labs - Real Estate Transaction Analytics',
  description: 'Look at actual property transactions to negotiate a better deal. Government registry data for Pune, Mumbai, Bangalore and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-white">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased bg-white`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
