'use client'

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AvaliacaoForm } from "./AvaliacaoForm"
import { type AvaliacaoFormData } from "@/lib/validations/avaliacao"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface AvaliacaoModalProps {
  aulaTitle: string
  aulaId?: string
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AvaliacaoModal({ 
  aulaTitle, 
  aulaId,
  children,
  open,
  onOpenChange 
}: AvaliacaoModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    } else {
      setIsOpen(newOpen)
    }
  }

  const handleSubmit = (data: AvaliacaoFormData) => {
    console.log("Avaliação enviada:", { aulaId, aulaTitle, ...data })
    
    // Fechar modal após envio
    setTimeout(() => {
      handleOpenChange(false)
    }, 1000)
  }

  return (
    <Dialog open={open ?? isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Star className="h-4 w-4" />
            Avaliar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Avaliar Aula
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <AvaliacaoForm 
            aulaTitle={aulaTitle}
            onSubmit={handleSubmit}
            className="border-0 shadow-none p-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
