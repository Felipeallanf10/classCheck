'use client'

import { Separator } from '@/components/ui/separator'

interface PageHeaderProps {
  title: string
  description?: string
  showSeparator?: boolean
}

export function PageHeader({ 
  title, 
  description, 
  showSeparator = true 
}: PageHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-muted-foreground max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {showSeparator && <Separator />}
    </div>
  )
}
