'use client'

import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ToastProvider } from '@/hooks/use-toast'
import { ConfirmProvider } from '@/hooks/use-confirm'
import { ToastDisplay } from '@/components/ui/toast-display'

interface ClientProvidersProps {
  children: ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  // Criar QueryClient dentro do componente para evitar problemas de SSR
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minuto
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ConfirmProvider>
          {children}
          <ToastDisplay />
          <Toaster position="top-right" richColors />
        </ConfirmProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}
