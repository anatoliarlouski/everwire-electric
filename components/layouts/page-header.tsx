import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string | ReactNode
  /** Kept for backwards compatibility; headers now always sit on a light surface. */
  theme?: 'light' | 'dark'
  className?: string
}

/**
 * Reusable page header component
 * Provides consistent title and description styling
 */
export function PageHeader({ title, description, className = '' }: PageHeaderProps) {
  return (
    <div className={`text-center mb-12 md:mb-16 ${className}`}>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
        {title}
      </h1>
      <div className="mx-auto mb-5 h-1 w-16 rounded-full bg-accent" aria-hidden="true" />
      {description && (
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}
