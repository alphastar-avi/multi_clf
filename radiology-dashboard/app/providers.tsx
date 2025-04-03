"use client"

import { ThemeProvider } from 'next-themes'
// Import any other context providers you're using

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* Wrap with any other providers you're using */}
      {children}
    </ThemeProvider>
  )
} 