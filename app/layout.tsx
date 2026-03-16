import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import NiceNav from '@/components/shared/NiceNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Command - Your AI Second Brain',
  description: 'ADHD-friendly productivity system using the NICE method',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <NiceNav />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
