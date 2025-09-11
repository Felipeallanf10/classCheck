'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FAQItemProps {
  pergunta: string
  resposta: string
  categoria?: string
  isOpen?: boolean
  onToggle?: () => void
}

export function FAQItem({ 
  pergunta, 
  resposta, 
  categoria,
  isOpen = false,
  onToggle
}: FAQItemProps) {
  const [internalOpen, setInternalOpen] = useState(isOpen)
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else {
      setInternalOpen(!internalOpen)
    }
  }

  const isExpanded = onToggle ? isOpen : internalOpen

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-0">
        <Button
          variant="ghost"
          className="w-full justify-between p-6 text-left font-medium hover:bg-muted/50"
          onClick={handleToggle}
        >
          <div className="flex-1">
            {categoria && (
              <span className="text-sm text-muted-foreground font-normal mb-1 block">
                {categoria}
              </span>
            )}
            <span className="text-base font-semibold text-foreground">
              {pergunta}
            </span>
          </div>
          <div className="ml-4 flex-shrink-0">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </Button>
        
        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-6 pb-6 pt-0">
            <div className="text-muted-foreground leading-relaxed">
              {resposta}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
