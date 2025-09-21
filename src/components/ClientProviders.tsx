'use client'

import { ReactNode } from 'react'
import { ToastProvider } from '@/hooks/use-toast'
import { ConfirmProvider } from '@/hooks/use-confirm'
import { ToastDisplay } from '@/components/ui/toast-display'

interface ClientProvidersProps {
  children: ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ToastProvider>
      <ConfirmProvider>
        {children}
        <ToastDisplay />
      </ConfirmProvider>
    </ToastProvider>
  )
}
