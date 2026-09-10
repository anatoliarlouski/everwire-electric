import type { ReactNode } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MobileCallBar } from '@/components/mobile-call-bar'

interface PageContainerProps {
  children: ReactNode
  /** Kept for backwards compatibility; every page is now on the light brand background. */
  theme?: 'light' | 'dark'
  className?: string
}

/**
 * Standard page container with header, footer and the mobile sticky call bar.
 * Use this for all pages to maintain consistency.
 */
export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <>
      <main className={`min-h-screen bg-background has-call-bar ${className}`}>
        <Header />
        {children}
        <Footer />
      </main>
      <MobileCallBar />
    </>
  )
}
