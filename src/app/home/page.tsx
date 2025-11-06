'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Redirecionamento de /home para /dashboard
// Parte da Fase 1 - Unificação Home/Dashboard
export default function HomeRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redireciona imediatamente para o dashboard unificado
    router.replace('/dashboard')
  }, [router])

  // Fallback enquanto redireciona
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecionando para o dashboard...</p>
      </div>
    </div>
  )
}