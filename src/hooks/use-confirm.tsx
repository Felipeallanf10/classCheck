'use client'

import { useState, createContext, useContext, ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmOptions {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

interface ConfirmContextType {
  confirm: (options?: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextType | null>(null)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({})
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null)

  const confirm = (opts: ConfirmOptions = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions({
        title: 'Confirmar ação',
        description: 'Tem certeza que deseja continuar?',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        variant: 'default',
        ...opts,
      })
      setResolveRef(() => resolve)
      setIsOpen(true)
    })
  }

  const handleConfirm = () => {
    resolveRef?.(true)
    setIsOpen(false)
    setResolveRef(null)
  }

  const handleCancel = () => {
    resolveRef?.(false)
    setIsOpen(false)
    setResolveRef(null)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel()
    }
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary-900 dark:text-primary-100">
              {options.title}
            </DialogTitle>
            {options.description && (
              <DialogDescription className="text-muted-foreground">
                {options.description}
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancel}>
              {options.cancelText}
            </Button>
            <Button 
              variant={options.variant === 'destructive' ? 'destructive' : 'default'}
              onClick={handleConfirm}
              className={options.variant === 'default' ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800' : ''}
            >
              {options.confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider')
  }
  return context
}
