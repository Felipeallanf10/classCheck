'use client'

import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ToastProvider } from '@/hooks/use-toast'
import { ConfirmProvider } from '@/hooks/use-confirm'
import { ToastDisplay } from '@/components/ui/toast-display'
import { SessionProvider } from '@/components/providers/SessionProvider'

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
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ConfirmProvider>
            {children}
            <ToastDisplay />
            <Toaster position="top-right" richColors />
          </ConfirmProvider>
        </ToastProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
