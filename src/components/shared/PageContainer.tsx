'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  full: 'max-w-full'
}

export function PageContainer({ 
  children, 
  className,
  maxWidth = '3xl'
}: PageContainerProps) {
  return (
    <div className={cn(
      'container mx-auto py-6 md:py-8 lg:py-12 container-no-overflow mobile-constrain',
      // Padding responsivo baseado na largura máxima
      maxWidth === 'full' ? 'px-4 sm:px-6 lg:px-8' : 'px-4 md:px-6 lg:px-8',
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  )
}
