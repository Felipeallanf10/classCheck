import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`} aria-label="Breadcrumb">
      <Button variant="ghost" size="sm" asChild className="h-auto p-1">
        <Link href="/" className="hover:text-foreground">
          <Home className="h-4 w-4" />
        </Link>
      </Button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          {item.href && index < items.length - 1 ? (
            <Button variant="ghost" size="sm" asChild className="h-auto p-1">
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            </Button>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
