'use client'

import { usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SidebarProvider } from '@/components/ui/sidebar'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Rotas que devem exibir a navegação (páginas logadas)
  const showNavRoutes = ['/home', '/favoritos', '/aulas', '/eventos', '/dashboard']
  
  // Rotas de autenticação que usam layout próprio
  const isAuthRoute = pathname.startsWith('/login') || 
                     pathname.startsWith('/cadastro') || 
                     pathname.startsWith('/reset-password')
  
  // Verifica se deve mostrar a navegação
  const showNav = showNavRoutes.some(route => pathname.startsWith(route))

  // Se for rota de autenticação, renderiza só o conteúdo (sem theme toggle)
  if (isAuthRoute) {
    return <>{children}</>
  }

  // Se for rota pública (como landing page), renderiza sem sidebar
  if (!showNav) {
    return (
      <>
        {children}
        {/* Botão flutuante theme apenas */}
        <div className="fixed bottom-4 right-4">
          <ThemeToggle/>
        </div>
      </>
    )
  }

  // Se for rota logada, renderiza com sidebar
  return (
    <>
      <div className="flex min-h-screen">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1">{children}</main>
        </SidebarProvider>
      </div>
      {/* Botão flutuante theme */}
      <div className="fixed bottom-4 right-4">
        <ThemeToggle/>
      </div>
    </>
  )
}
