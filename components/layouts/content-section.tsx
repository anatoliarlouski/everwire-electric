import type { ReactNode } from 'react'

interface ContentSectionProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full'
  withCard?: boolean
  noPadding?: boolean
}

/**
 * Reusable content section with consistent styling
 * Optional bordered card surface and responsive padding
 */
export function ContentSection({ 
  children, 
  className = '',
  maxWidth = '6xl',
  withCard = true,
  noPadding = false
}: ContentSectionProps) {
  const maxWidthClass = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  }[maxWidth]

  const paddingClass = noPadding ? '' : 'pt-16 pb-16 md:pt-20'
  
  const cardClasses = withCard 
    ? 'bg-card rounded-xl p-8 md:p-12 border border-border shadow-sm'
    : ''

  return (
    <div className={paddingClass}>
      <div className="container mx-auto px-4">
        <div className={`${maxWidthClass} mx-auto ${cardClasses} ${className}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
