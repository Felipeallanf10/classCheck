'use client'

import { useEffect } from 'react'
import { useSession } from '@/hooks/useSession'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { AppLoading } from '@/components/ui'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Role[]
  redirectTo?: string
  loadingMessage?: string
}

/**
 * Componente para proteger páginas por role
 * 
 * Uso básico (apenas autenticado):
 * <ProtectedRoute>
 *   <MinhasPagina />
 * </ProtectedRoute>
 * 
 * Uso com roles específicos:
 * <ProtectedRoute allowedRoles={['ADMIN', 'PROFESSOR']}>
 *   <PaginaAdminOuProfessor />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login',
  loadingMessage = 'Verificando permissões...',
}: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Se não está autenticado, redireciona para login
    if (status === 'unauthenticated') {
      router.push(redirectTo)
    }
  }, [status, router, redirectTo])

  // Loading enquanto verifica sessão
  if (status === 'loading') {
    return (
      <AppLoading 
        steps={[
          "Verificando autenticação...",
          "Carregando permissões...",
          "Pronto!"
        ]}
        currentStep={1}
        text="ClassCheck"
        subText={loadingMessage}
      />
    )
  }

  // Não autenticado
  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-4">
            <span>Você precisa estar autenticado para acessar esta página.</span>
            <Button onClick={() => router.push('/login')}>
              Ir para Login
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Se tem roles específicos, verifica permissão
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = session.user.role
    const hasPermission = allowedRoles.includes(userRole)

    if (!hasPermission) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Alert variant="destructive" className="max-w-md">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription className="flex flex-col gap-4">
              <div>
                <p className="font-semibold mb-2">Acesso Negado</p>
                <p className="text-sm">
                  Você não tem permissão para acessar esta página.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Roles permitidos: {allowedRoles.join(', ')}
                  <br />
                  Seu role: {userRole}
                </p>
              </div>
              <Button onClick={() => router.push('/dashboard')}>
                Voltar ao Dashboard
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )
    }
  }

  // Tudo certo, renderiza o conteúdo
  return <>{children}</>
}
