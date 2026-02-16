// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AccessibilityProvider } from '../components/Accessibility'
import Navigation from '../components/Navigation'
import { AuthProvider } from '../contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Todo Web Application',
  description: 'A secure multi-user todo application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          <AccessibilityProvider>
            {children}
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  )
}