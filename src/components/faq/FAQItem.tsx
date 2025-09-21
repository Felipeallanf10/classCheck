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
    <Card className="transition-all duration-200 hover:shadow-md w-full">
      <CardContent className="p-0 w-full">
        <Button
          variant="ghost"
          className="w-full justify-between p-4 md:p-6 text-left font-medium hover:bg-muted/50 h-auto min-h-[60px] items-start"
          onClick={handleToggle}
          data-faq-button="true"
        >
          <div className="flex-1 min-w-0 pr-2 w-full">
            {categoria && (
              <span className="text-xs md:text-sm text-muted-foreground font-normal mb-1 block faq-text">
                {categoria}
              </span>
            )}
            <span className="text-sm md:text-base font-semibold text-foreground leading-relaxed faq-text text-wrap-force inline-block w-full">
              {pergunta}
            </span>
          </div>
          <div className="ml-2 md:ml-4 flex-shrink-0 mt-1">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            )}
          </div>
        </Button>
        
        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out w-full",
          isExpanded ? "max-h-none opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0 w-full">
            <div className="text-sm md:text-base text-muted-foreground leading-relaxed faq-text text-wrap-force">
              {resposta}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
