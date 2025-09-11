'use client'

import { usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Footer } from '@/components/Footer'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppLoading } from '@/components/ui'
import { useEffect, useState } from 'react'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  
  // Rotas que devem exibir a navegação (páginas logadas)
  const showNavRoutes = ['/home', '/favoritos', '/aulas', '/eventos', '/dashboard']
  
  // Rotas que são páginas institucionais (devem ter footer)
  const institutionalRoutes = ['/ajuda', '/contato', '/sobre', '/politica-de-privacidade', '/termos-de-uso', '/manutencao']
  
  // Rotas de autenticação que usam layout próprio
  const isAuthRoute = pathname.startsWith('/login') || 
                     pathname.startsWith('/cadastro') || 
                     pathname.startsWith('/reset-password')
  
  // Verifica se deve mostrar a navegação
  const showNav = showNavRoutes.some(route => pathname.startsWith(route))
  
  // Verifica se é página institucional (precisa de footer)
  const isInstitutionalPage = institutionalRoutes.some(route => pathname.startsWith(route)) || pathname === '/'

  // Simula loading entre rotas (apenas para rotas navegadas)
  useEffect(() => {
    if (showNav) {
      setIsLoading(true)
      const timer = setTimeout(() => setIsLoading(false), 800)
      return () => clearTimeout(timer)
    }
  }, [pathname, showNav])

  // Se for rota de autenticação, renderiza só o conteúdo (sem theme toggle)
  if (isAuthRoute) {
    return <>{children}</>
  }

  // Se for rota pública (como landing page), renderiza sem sidebar com theme toggle melhorado
  if (!showNav) {
    return (
      <>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          
          {/* Footer para páginas institucionais */}
          {isInstitutionalPage && <Footer />}
        </div>
        
        {/* Botão flutuante theme com design tokens */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-lg border border-neutral-200 dark:border-neutral-700">
            <ThemeToggle />
          </div>
        </div>
      </>
    )
  }

  // Se for rota logada, renderiza com sidebar e loading
  if (isLoading) {
    return (
      <AppLoading 
        steps={[
          "Carregando aplicação...",
          "Verificando permissões...",
          "Pronto!"
        ]}
        currentStep={2}
        text="ClassCheck"
        subText="Preparando sua experiência"
      />
    )
  }

  return (
    <>
      <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 transition-all duration-200">
            <div className="p-6 space-y-6">
              {children}
            </div>
          </main>
        </SidebarProvider>
      </div>
      
      {/* Botão flutuante theme com design tokens */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-lg border border-neutral-200 dark:border-neutral-700">
          <ThemeToggle />
        </div>
      </div>
    </>
  )
}
