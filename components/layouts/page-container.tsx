import type { ReactNode } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MobileCallBar } from '@/components/mobile-call-bar'

interface PageContainerProps {
  children: ReactNode
  /** Kept for backwards compatibility; every page is now on the light brand background. */
  theme?: 'light' | 'dark'
  className?: string
  /** Chrome-free layout for internal tools: header only, no footer or sticky call bar. */
  variant?: 'site' | 'tool'
}

/**
 * Standard page container with header, footer and the mobile sticky call bar.
 * Use this for all pages to maintain consistency.
 */
export function PageContainer({ children, className = '', variant = 'site' }: PageContainerProps) {
  const isTool = variant === 'tool'
  return (
    <>
      <main className={`min-h-screen bg-background ${isTool ? '' : 'has-call-bar'} ${className}`}>
        <Header />
        {children}
        {!isTool && <Footer />}
      </main>
      {!isTool && <MobileCallBar />}
    </>
  )
}
